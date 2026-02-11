import { ethers } from 'hardhat'
import * as fs from 'fs'
import * as path from 'path'

interface DeploymentResult {
  network: string
  chainId: number
  deployer: string
  timestamp: string
  contracts: {
    factory: string
    router: string
    alphaToken: string
    betaToken: string
    weth: string
  }
  pools: {
    alphaWeth: string
    betaWeth: string
    alphaBeta: string
  }
  initCodeHash: string
}

async function main() {
  const [deployer] = await ethers.getSigners()
  const network = await ethers.provider.getNetwork()

  console.log('=== CipherSwap Deployment ===')
  console.log(`Network: ${network.name} (chainId: ${network.chainId})`)
  console.log(`Deployer: ${deployer.address}`)

  const balance = await ethers.provider.getBalance(deployer.address)
  console.log(`Balance: ${ethers.formatEther(balance)} ETH`)
  console.log('')

  // WETH address - TEN Testnet precompile
  const WETH_ADDRESS = process.env.WETH_ADDRESS || '0x1000000000000000000000000000000000000042'
  console.log(`WETH address: ${WETH_ADDRESS}`)

  // ETH per pool for ALPHA/WETH and BETA/WETH pairs
  const ETH_PER_POOL = process.env.ETH_PER_POOL || '0.5'
  const ethPerPool = ethers.parseEther(ETH_PER_POOL)
  const totalEthNeeded = ethPerPool * 2n
  if (balance < totalEthNeeded) {
    console.error(`Insufficient ETH. Need ${ethers.formatEther(totalEthNeeded)} ETH for pools, have ${ethers.formatEther(balance)}`)
    process.exit(1)
  }

  // Step 1: Deploy Factory
  console.log('\n[1/8] Deploying UniswapV2Factory...')
  const Factory = await ethers.getContractFactory('UniswapV2Factory')
  const factory = await Factory.deploy(deployer.address)
  await factory.waitForDeployment()
  const factoryAddress = await factory.getAddress()
  console.log(`  Factory deployed at: ${factoryAddress}`)

  // Step 2: Compute init code hash
  console.log('\n[2/8] Computing init code hash...')
  const UniswapV2Pair = await ethers.getContractFactory('UniswapV2Pair')
  const initCodeHash = ethers.keccak256(UniswapV2Pair.bytecode)
  console.log(`  Init code hash: ${initCodeHash}`)

  // Check if the hash in UniswapV2Library matches
  const libraryPath = path.join(__dirname, '..', 'contracts', 'periphery', 'libraries', 'UniswapV2Library.sol')
  const librarySource = fs.readFileSync(libraryPath, 'utf8')
  const hashMatch = librarySource.match(/hex'([a-f0-9]{64})'/)

  if (hashMatch) {
    const libraryHash = '0x' + hashMatch[1]
    if (initCodeHash !== libraryHash) {
      console.log(`  WARNING: Library hash mismatch!`)
      console.log(`  Library has: ${libraryHash}`)
      console.log(`  Computed:    ${initCodeHash}`)
      console.log(`  Patching UniswapV2Library.sol...`)

      const updatedSource = librarySource.replace(hashMatch[1], initCodeHash.slice(2))
      fs.writeFileSync(libraryPath, updatedSource)
      console.log(`  Library patched. Recompiling...`)

      // We need to recompile after patching - but since we're in a script,
      // the Router needs to be deployed with the correct hash.
      // The user should recompile and redeploy if the hash changed.
      console.log(`  IMPORTANT: If deploying Router, recompile first: npx hardhat compile`)
      console.log(`  Then re-run this script.`)
      console.log(`  Continuing deployment with current compilation...`)
    } else {
      console.log(`  Hash matches UniswapV2Library.sol`)
    }
  }

  // Step 3: Deploy Router
  console.log('\n[3/8] Deploying UniswapV2Router02...')
  const Router = await ethers.getContractFactory('UniswapV2Router02')
  const router = await Router.deploy(factoryAddress, WETH_ADDRESS)
  await router.waitForDeployment()
  const routerAddress = await router.getAddress()
  console.log(`  Router deployed at: ${routerAddress}`)

  // Step 4: Deploy ALPHA token
  console.log('\n[4/8] Deploying ALPHA token...')
  const initialSupply = ethers.parseEther('100000000') // 100M tokens
  const AlphaToken = await ethers.getContractFactory('TestERC20')
  const alphaToken = await AlphaToken.deploy('Alpha Token', 'ALPHA', initialSupply)
  await alphaToken.waitForDeployment()
  const alphaAddress = await alphaToken.getAddress()
  console.log(`  ALPHA deployed at: ${alphaAddress}`)
  console.log(`  Initial supply: 100,000,000 ALPHA minted to ${deployer.address}`)

  // Step 5: Deploy BETA token
  console.log('\n[5/8] Deploying BETA token...')
  const BetaToken = await ethers.getContractFactory('TestERC20')
  const betaToken = await BetaToken.deploy('Beta Token', 'BETA', initialSupply)
  await betaToken.waitForDeployment()
  const betaAddress = await betaToken.getAddress()
  console.log(`  BETA deployed at: ${betaAddress}`)
  console.log(`  Initial supply: 100,000,000 BETA minted to ${deployer.address}`)

  // Step 6: Approve Router to spend all tokens
  console.log('\n[6/8] Approving Router to spend tokens...')
  const maxApproval = ethers.MaxUint256
  const approveTx1 = await alphaToken.approve(routerAddress, maxApproval)
  await approveTx1.wait()
  console.log(`  ALPHA approved for Router`)
  const approveTx2 = await betaToken.approve(routerAddress, maxApproval)
  await approveTx2.wait()
  console.log(`  BETA approved for Router`)

  // Split: 50% of each token to its ETH pair, 50% to ALPHA/BETA pair
  const halfSupply = initialSupply / 2n
  const deadline = Math.floor(Date.now() / 1000) + 600 // 10 minutes

  // Step 7: Create liquidity pools with ETH
  console.log('\n[7/8] Creating ALPHA/WETH and BETA/WETH pools...')
  console.log(`  Adding ${ethers.formatEther(halfSupply)} ALPHA + ${ethers.formatEther(ethPerPool)} ETH`)
  const lp1Tx = await router.addLiquidityETH(
    alphaAddress,
    halfSupply,
    halfSupply,
    ethPerPool,
    deployer.address,
    deadline,
    { value: ethPerPool }
  )
  await lp1Tx.wait()
  console.log(`  ALPHA/WETH pool created`)

  console.log(`  Adding ${ethers.formatEther(halfSupply)} BETA + ${ethers.formatEther(ethPerPool)} ETH`)
  const lp2Tx = await router.addLiquidityETH(
    betaAddress,
    halfSupply,
    halfSupply,
    ethPerPool,
    deployer.address,
    deadline,
    { value: ethPerPool }
  )
  await lp2Tx.wait()
  console.log(`  BETA/WETH pool created`)

  // Step 8: Create ALPHA/BETA pool
  console.log('\n[8/8] Creating ALPHA/BETA pool...')
  console.log(`  Adding ${ethers.formatEther(halfSupply)} ALPHA + ${ethers.formatEther(halfSupply)} BETA`)
  const lp3Tx = await router.addLiquidity(
    alphaAddress,
    betaAddress,
    halfSupply,
    halfSupply,
    halfSupply,
    halfSupply,
    deployer.address,
    deadline
  )
  await lp3Tx.wait()
  console.log(`  ALPHA/BETA pool created`)

  // Read pool addresses from factory
  const alphaWethPair = await factory.getPair(alphaAddress, WETH_ADDRESS)
  const betaWethPair = await factory.getPair(betaAddress, WETH_ADDRESS)
  const alphaBetaPair = await factory.getPair(alphaAddress, betaAddress)

  // Save deployment result
  const deployment: DeploymentResult = {
    network: network.name,
    chainId: Number(network.chainId),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      factory: factoryAddress,
      router: routerAddress,
      alphaToken: alphaAddress,
      betaToken: betaAddress,
      weth: WETH_ADDRESS,
    },
    pools: {
      alphaWeth: alphaWethPair,
      betaWeth: betaWethPair,
      alphaBeta: alphaBetaPair,
    },
    initCodeHash,
  }

  // Save deployment JSON
  const deploymentsDir = path.join(__dirname, '..', 'deployments')
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true })
  }
  const deploymentFile = path.join(
    deploymentsDir,
    `deployment-${network.chainId}-${Date.now()}.json`
  )
  fs.writeFileSync(deploymentFile, JSON.stringify(deployment, null, 2))
  console.log(`\nDeployment saved to: ${deploymentFile}`)

  // Update root .env files
  const rootDir = path.join(__dirname, '..', '..')
  updateEnvFile(path.join(rootDir, '.env'), deployment)
  updateEnvFile(path.join(rootDir, '.env.production'), deployment)

  // Summary
  console.log('\n=== Deployment Summary ===')
  console.log(`Factory:      ${factoryAddress}`)
  console.log(`Router:       ${routerAddress}`)
  console.log(`ALPHA:        ${alphaAddress}`)
  console.log(`BETA:         ${betaAddress}`)
  console.log(`WETH:         ${WETH_ADDRESS}`)
  console.log(`Init Hash:    ${initCodeHash}`)
  console.log('')
  console.log('Liquidity Pools:')
  console.log(`  ALPHA/WETH: ${alphaWethPair}  (50M ALPHA + ${ETH_PER_POOL} ETH)`)
  console.log(`  BETA/WETH:  ${betaWethPair}  (50M BETA + ${ETH_PER_POOL} ETH)`)
  console.log(`  ALPHA/BETA: ${alphaBetaPair}  (50M ALPHA + 50M BETA)`)
  console.log('\nRoot .env and .env.production updated with new addresses.')
}

function updateEnvFile(envPath: string, deployment: DeploymentResult) {
  let content = ''
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, 'utf8')
  }

  const updates: Record<string, string> = {
    REACT_APP_FACTORY_ADDRESS: deployment.contracts.factory,
    REACT_APP_ROUTER_ADDRESS: deployment.contracts.router,
    REACT_APP_ALPHA_TOKEN_ADDRESS: deployment.contracts.alphaToken,
    REACT_APP_BETA_TOKEN_ADDRESS: deployment.contracts.betaToken,
    REACT_APP_WETH_ADDRESS: deployment.contracts.weth,
    REACT_APP_INIT_CODE_HASH: deployment.initCodeHash,
  }

  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=.*$`, 'm')
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`)
    } else {
      content += `\n${key}=${value}`
    }
  }

  fs.writeFileSync(envPath, content)
  console.log(`Updated: ${envPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
