# CipherSwap

A decentralized exchange built on [TEN Protocol](https://ten.xyz) - the encrypted Ethereum L2.

## Development

### Install Dependencies

```bash
yarn
```

### Configure Environment

1. Copy `.env` to `.env.local`
2. Get a TEN Gateway token from [https://testnet.ten.xyz](https://testnet.ten.xyz)
3. Update `.env.local`:

```bash
REACT_APP_CHAIN_ID="8443"
REACT_APP_NETWORK_URL="https://testnet.ten.xyz/v1/?token=YOUR_TEN_GATEWAY_TOKEN"
REACT_APP_FACTORY_ADDRESS=0x38b8773E1B048fbBb4f4620b2861db8703aBE7b9
REACT_APP_ROUTER_ADDRESS=0x9cF6C659F173916f4928420E72DE53E667DbDf73
REACT_APP_MULTICALL_ADDRESS=0x29A8E964a4e220e3438e39dDDd01B4A3305A7c54
REACT_APP_INIT_CODE_HASH=0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f
REACT_APP_ALPHA_TOKEN_ADDRESS=0x910c2a26649063a37fc507EC827fF7f6784133a1
REACT_APP_BETA_TOKEN_ADDRESS=0xD3C60e71391b8F481222546c80F046a73AA4611f
REACT_APP_WETH_ADDRESS=0x0000000000000000000000000000000000000001
```

### Run

```bash
yarn start
```

## Deployed Contracts (TEN Testnet)

| Contract    | Address                                        |
| ----------- | ---------------------------------------------- |
| Factory     | `0x38b8773E1B048fbBb4f4620b2861db8703aBE7b9` |
| Router      | `0x9cF6C659F173916f4928420E72DE53E667DbDf73` |
| Multicall   | `0x29A8E964a4e220e3438e39dDDd01B4A3305A7c54` |
| ALPHA Token | `0x910c2a26649063a37fc507EC827fF7f6784133a1` |
| BETA Token  | `0xD3C60e71391b8F481222546c80F046a73AA4611f` |

## Network Details

- **Network**: TEN Testnet
- **Chain ID**: 8443
- **RPC**: `https://testnet.ten.xyz/v1/?token=YOUR_TOKEN`
- **Block Explorer**: [https://testnet.tenscan.io](https://testnet.tenscan.io)
