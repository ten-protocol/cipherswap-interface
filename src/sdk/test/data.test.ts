import { ChainId, WETH, Token, Fetcher } from '../'

// TODO: replace the provider in these tests
describe.skip('data', () => {
  it('Token', async () => {
    const token = await Fetcher.fetchTokenData(ChainId.CARDONA, '0x7422ab95742858e21b9F6299fF66B24FB2a478FD') // DAI
    expect(token.decimals).toEqual(18)
  })

  it('Pair', async () => {
    const token = new Token(ChainId.CARDONA, '0x7422ab95742858e21b9F6299fF66B24FB2a478FD', 18) // DAI
    const pair = await Fetcher.fetchPairData(WETH[ChainId.CARDONA], token)
    expect(pair.liquidityToken.address).toEqual('0x52f7b0dA42bB5824148Ea1044aFE3A525Abc93eD')
  })
})
