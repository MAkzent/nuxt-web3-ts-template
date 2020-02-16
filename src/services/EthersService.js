import {ethers} from 'ethers'

let provider = ethers.getDefaultProvider('rinkeby');

const abi = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "newMessage",
        "type": "string"
      }
    ],
    "name": "setMessage",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_message",
        "type": "string"
      }
    ],
    "name": "NewMessage",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getMessage",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];


export default class EthersService {
  constructor (provider = null, store, options = { dev: false }) {
    this.store = store
    this.provider = provider
    this.options = options
    this.web3 = {}
    this.defaultAccount = ''
  }

  eventListener() {
    console.log('listening...')
    let contract = new ethers.Contract("0x51445382c3b61ccfe9f4b228e518eadcd47ecf3e", abi, provider);

    contract.on("NewMessage", (oldValue, newValue, event) => {
      console.log('old and new', oldValue, newValue);
      console.log('event: ', event)
    });
  }

}

