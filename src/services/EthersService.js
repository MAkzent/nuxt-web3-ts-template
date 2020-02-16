import {ethers} from 'ethers'

let provider = ethers.getDefaultProvider('rinkeby');
import DragonKittyABI from '../assets/data/ethereum/DragonKittyABI.json'

export default class EthersService {
  constructor (provider = null, store, options = { dev: false }) {
    this.store = store
    this.provider = provider
    this.options = options
    this.web3 = {}
    this.defaultAccount = ''
  }

  async eventListener() {
    console.log('listening...')
    let contract = new ethers.Contract("0xa3C921e049a05B2D1a7f47F1c72B5695E504f8cf", DragonKittyABI, provider);

    // contract.on("NewMessage", (oldValue, newValue, event) => {
    //   console.log('old and new', oldValue, newValue);
    //   console.log('event: ', event)
    // });

    const boss = await contract.currentBoss()
    console.log('boss: ', boss)
  }

}

