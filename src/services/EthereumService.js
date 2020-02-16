import Web3 from 'web3'
import Notify from 'bnc-notify'
import ERC721Abi from '~/assets/data/ethereum/ERC721Abi.json'
import { BLOCKNATIVE } from '~/assets/data/non_secret_keys.js'

export default class EthereumService {
  constructor (provider = null, store, options = { dev: false }) {
    this.store = store
    this.provider = provider
    this.options = options
    this.web3 = {}
    this.defaultAccount = ''
    this.getWeb3()
  }

  getWeb3 () {
    if (this.provider === null) {
      this.web3 = new Web3()
      return
    }

    if (this.provider.autoRefreshOnNetworkChange !== undefined) {
      this.options.dev &&
        console.info('[web3] Initialize with `window.ethereum` .')
      this.provider.autoRefreshOnNetworkChange = false
    } else {
      this.options.dev &&
        console.info('[web3] Initialize with `window.web3` .')
    }
    this.web3 = new Web3(this.provider)
  }

  get utils () {
    return this.web3.utils
  }

  get eth () {
    return this.web3.eth
  }

  get hasWallet () {
    return this.provider !== null
  }

  get account () {
    return this.defaultAccount || ''
  }

  async walletUnlocked () {
    if (!this.hasWallet) {
      throw new Error('[Error] There is no Ethereum wallet.')
    }
    const account = await this.getCurrentAccountAsync()
    return !!account
  }

  async init () {
    if (!this.hasWallet) {
      // todo: Supports wallet like Fortmatic
      throw new Error('[Error] There is no Ethereum wallet.')
    }

    if (!await this.walletUnlocked()) { return }

    if (this.provider.enable) {
      try {
        this.defaultAccount = await this.getCurrentAccountAsync()
        if (this.provider.on) {
          this.provider.on('accountsChanged', () => {
            this.options.dev && console.info('[web3] Account Changed.')
            typeof window !== 'undefined' && location.reload()
          })
          this.provider.on('networkChanged', () => {
            this.options.dev && console.info('[web3] Network Changed.')
            typeof window !== 'undefined' && location.reload()
          })
        } else {
          typeof window !== 'undefined' &&
            setInterval(async () => {
              const account = await this.getCurrentAccountAsync()
              if (account !== this.defaultAccount) {
                this.options.dev && console.info('[web3] Account Changed.')
                typeof window !== 'undefined' && location.reload()
              }
            }, 100)
        }
      } catch (e) {
        console.error(e)
        return
      }
    } else {
      this.defaultAccount = await this.getCurrentAccountAsync()
      typeof window !== 'undefined' &&
        setInterval(async () => {
          const account = await this.getCurrentAccountAsync()
          if (account !== this.defaultAccount) {
            this.options.dev && console.info('[web3] Account Changed.')
            typeof window !== 'undefined' && location.reload()
          }
        }, 100)
    }

    this.options.dev && console.info('[web3] Unlocked.')
  }

  async unlockWallet () {
    await this.provider.enable()
    await this.init()
    this.store.dispatch('nuxtClientInit') // find a cleaner way to seperate client init and wallet init
  }

  async getCurrentAccountAsync () {
    try {
      const accounts = await this.web3.eth.getAccounts()
      const account = accounts[0].toLowerCase()
      this.options.dev &&
        console.info(`[web3] Current account is ${account}.`)
      return account
    } catch (e) {
      return ''
    }
  }

  async getSignatureAsync (dataToSign) {
    const address = await this.getCurrentAccountAsync()
    const sig = await this.web3.eth.personal.sign(
      dataToSign,
      address,
      ''
    )
    return sig
  }

  getNetworkIdAsync () {
    return this.web3.eth.net.getId()
  }

  getERC721Contract (address) {
    return new this.web3.eth.Contract(ERC721Abi, address)
  }

  async getGasPriceInGwei () {
    let gasPriceInGwei = await this.web3.eth.getGasPrice()
    if (gasPriceInGwei < this.web3.utils.toWei('5', 'gwei')) {
      gasPriceInGwei = this.web3.utils.toWei('5', 'gwei')
    }
    return gasPriceInGwei
  }

  getNetworkSlug (netId) {
    switch (netId) {
      case 1:
        return 'mainnet'
      case 3:
        return 'ropsten'
      case 42:
        return 'kovan'
      case 4:
        return 'rinkeby'
      default:
        return ''
    }
  }

  // most standard ERC721 method implemented:
  async sendAsset (contractAddress, from, to, tokenId, networkId, callbackAfterSend = () => {}) {
    const notify = Notify({
      dappId: BLOCKNATIVE, // [String] The API key created by step one above
      networkId // [Integer] The Ethereum network ID your Dapp uses.
    })

    notify.config({
      mobilePosition: 'bottom'
    })

    const contract = await this.getERC721Contract(contractAddress)
    return contract.methods
      .safeTransferFrom(from, to, tokenId)
      .send({ from })
      .on('transactionHash', function (hash) {
        notify.hash(hash)
        callbackAfterSend()
      })
      .on('receipt', function (receipt) {
        console.info(receipt)
      })
  }

  // example for ERC721 method call
  async approveContract (contractAddress, converterAddress, fromAddress, networkId, callbackAfterSend = () => {}) {
    const notify = Notify({
      dappId: BLOCKNATIVE, // [String] The API key created by step one above
      networkId // [Integer] The Ethereum network ID your Dapp uses.
    })

    notify.config({
      mobilePosition: 'bottom'
    })

    const contract = await this.getERC721Contract(contractAddress)
    const gasPriceInGwei = await this.getGasPriceInGwei()
    return contract.methods
      .setApprovalForAll(converterAddress, true)
      .send({
        from: fromAddress,
        gasPrice: gasPriceInGwei,
        gasLimit: 300000
      })
      .on('transactionHash', function (hash) {
        notify.hash(hash)
        callbackAfterSend()
      })
      .on('receipt', function (receipt) {
        console.info(receipt)
      })
  }

  // most standard ERC721 method implemented:
  async eventListener () {
    console.log('listening...');
    var web3 = new Web3("https://shared-geth-rinkeby.nodes.deploy.radar.tech/?apikey=8f814d34c32fe7c41c2e908a8a2f210531fe0573685304a1");

    var myContract = new web3.eth.Contract(abi, '0x51445382c3b61ccfe9f4b228e518eadcd47ecf3e');

    myContract.getPastEvents(event => console.log('events: ', event))
    myContract.getMessage(event => console.log('message: ', event))
    console.log('WEB#: ', this.web3)
    myContract.events.NewMessage({
      fromBlock: 0
    }, function(error, event){ console.log('event', event); })
      .on("connected", function(subscriptionId){
        console.log(subscriptionId);
      })
      .on('data', function(event){
        console.log('data: ', event); // same results as the optional callback above
      })
      .on('changed', function(event){
        console.log('changed: ', event); // same results as the optional callback above
      })
      .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        console.log('error: ', event); // same results as the optional callback above
      });
  }
}
