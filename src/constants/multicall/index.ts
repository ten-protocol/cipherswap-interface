import { ChainId } from '../../sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.CARDONA]: '0x470C4C77848c7C2927c2b03256d4b38c95e4EAAb'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
