import { ethers } from 'hardhat'
import * as fs from 'fs'
import * as path from 'path'

async function main() {
  const UniswapV2Pair = await ethers.getContractFactory('UniswapV2Pair')
  const bytecode = UniswapV2Pair.bytecode
  const hash = ethers.keccak256(bytecode)

  console.log('=== UniswapV2Pair Init Code Hash ===')
  console.log(`Hash: ${hash}`)
  console.log('')

  // Check against the hash in UniswapV2Library.sol
  const libraryPath = path.join(__dirname, '..', 'contracts', 'periphery', 'libraries', 'UniswapV2Library.sol')
  const librarySource = fs.readFileSync(libraryPath, 'utf8')

  // Extract hex hash from the library (the init code hash constant)
  const hashMatch = librarySource.match(/hex'([a-f0-9]{64})'/)
  if (hashMatch) {
    const libraryHash = '0x' + hashMatch[1]
    console.log(`Library hash: ${libraryHash}`)

    if (hash === libraryHash) {
      console.log('MATCH - Library hash matches compiled bytecode hash')
    } else {
      console.log('MISMATCH - Library hash does NOT match compiled bytecode hash!')
      console.log('')
      console.log('You need to update UniswapV2Library.sol with the correct hash.')
      console.log(`Replace: ${libraryHash}`)
      console.log(`   With: ${hash}`)
    }
  } else {
    console.log('WARNING: Could not find init code hash in UniswapV2Library.sol')
  }

  // Also check .env if it exists
  const rootEnvPath = path.join(__dirname, '..', '..', '.env')
  if (fs.existsSync(rootEnvPath)) {
    const envContent = fs.readFileSync(rootEnvPath, 'utf8')
    const envMatch = envContent.match(/REACT_APP_INIT_CODE_HASH=(.+)/)
    if (envMatch) {
      const envHash = envMatch[1].trim()
      console.log('')
      console.log(`Root .env hash: ${envHash}`)
      if (hash === envHash) {
        console.log('MATCH - .env hash matches compiled bytecode hash')
      } else {
        console.log('MISMATCH - .env hash does NOT match compiled bytecode hash!')
      }
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
