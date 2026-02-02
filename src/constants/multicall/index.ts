import { ChainId } from '../../sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.TEN_TESTNET]: '0x29A8E964a4e220e3438e39dDDd01B4A3305A7c54'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
