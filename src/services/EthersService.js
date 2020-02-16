import { ethers } from 'ethers'
import DragonKittyABI from '../assets/data/ethereum/DragonKittyAbi.json'

// const provider = ethers.getDefaultProvider('rinkeby')
const provider = new ethers.providers.JsonRpcProvider('https://shared-geth-rinkeby.nodes.deploy.radar.tech/?apikey=8f814d34c32fe7c41c2e908a8a2f210531fe0573685304a1');
// const provider = new ethers.providers.JsonRpcProvider('https://shared-parity-mainnet.nodes.deploy.radar.tech/?apikey=7d9c7347814ae1a0630063de2a5df8f8d9be7d6a487dc7ad');


export default class EthersService {
  constructor (provider = null, store, options = { dev: false }) {
    this.store = store
    this.provider = provider
    this.options = options
    this.web3 = {}
    this.defaultAccount = ''
  }

  async eventListener () {
    console.log('listening...')
    return new ethers.Contract('0xa4CEEB325423c662Cd41Ae653C00acD73E9b85Dc', DragonKittyABI, provider)

  }
}
