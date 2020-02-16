import Web3 from 'web3'
import Notify from 'bnc-notify'
import ERC721Abi from '~/assets/data/ethereum/ERC721Abi.json'
import DragonKittyAbi from '~/assets/data/ethereum/DragonKittyABI.json'
import KittyCoreAbi from '~/assets/data/ethereum/KittyCoreAbi.json'
import { BLOCKNATIVE } from '~/assets/data/non_secret_keys.js'

const DRAGONKITTY_MAIN = '0x64b1Bcc75436BBcbBB5AF0A1fF8337Cc73c4e25d'
const DRAGONKITTY_RINKEBY = '0xa4CEEB325423c662Cd41Ae653C00acD73E9b85Dc'

const CK_ADDRESS = '0x06012c8cf97bead5deae237070f9587f8e7a266d'
const CK_ADDRESS_RINKEBY = '0x16baf0de678e52367adc69fd067e5edd1d33e3bf'

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

  getDragonKittyContract (networkId) {
    const contractAddress = networkId === 1 ? DRAGONKITTY_MAIN : DRAGONKITTY_RINKEBY
    return new this.web3.eth.Contract(DragonKittyAbi, contractAddress)
  }

  getKittyCoreContract (networkId) {
    const contractAddress = networkId === 1 ? CK_ADDRESS : CK_ADDRESS_RINKEBY
    return new this.web3.eth.Contract(KittyCoreAbi, contractAddress)
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
  async enterRaid (from, tokenId, networkId, bonus, callbackAfterSend = () => {}) {
    const CHAI_BONUS = 5000000000000000
    const DAIQUIRI_BONUS = 20000000000000000
    const DAISAKE_BONUS = 35000000000000000

    const notify = Notify({
      dappId: BLOCKNATIVE, // [String] The API key created by step one above
      networkId // [Integer] The Ethereum network ID your Dapp uses.
    })

    notify.config({
      mobilePosition: 'top'
    })
    const { chai, daiquiri, daisake } = bonus
    const totalValue = Number(chai) * CHAI_BONUS + Number(daiquiri) * DAIQUIRI_BONUS + Number(daisake) * DAISAKE_BONUS
    const contract = await this.getDragonKittyContract(networkId)
    return contract.methods
      .sacrifice(tokenId, chai, daiquiri, daisake, 0)
      .send({
        from,
        value: totalValue // remove in production
      })
      .on('transactionHash', function (hash) {
        notify.hash(hash)
      })
      .on('receipt', function (receipt) {
        console.info(receipt)
        callbackAfterSend()
      })
  }

  async getCurrentBoss (networkId) {
    const contract = await this.getDragonKittyContract(networkId)
    return contract.methods.currentBoss().call()
  }

  async getIsKittyApproved (kittyId, networkId) {
    const dragonContract = networkId === 1 ? DRAGONKITTY_MAIN : DRAGONKITTY_RINKEBY
    const contract = await this.getKittyCoreContract(networkId)
    const approvedAddress = await contract.methods.kittyIndexToApproved(kittyId).call()
    return dragonContract.toLowerCase() === approvedAddress.toLowerCase()
  }

  // example for ERC721 method call
  async approveContract (kittyId, fromAddress, networkId) {
    const dragonKittyContract = networkId === 1 ? DRAGONKITTY_MAIN : DRAGONKITTY_RINKEBY
    const notify = Notify({
      dappId: BLOCKNATIVE, // [String] The API key created by step one above
      networkId // [Integer] The Ethereum network ID your Dapp uses.
    })

    notify.config({
      mobilePosition: 'top'
    })

    const contract = await this.getKittyCoreContract(networkId)
    const gasPriceInGwei = await this.getGasPriceInGwei()
    return contract.methods
      .approve(dragonKittyContract, kittyId)
      .send({
        from: fromAddress,
        gasPrice: gasPriceInGwei,
        gasLimit: 300000
      })
      .on('transactionHash', function (hash) {
        notify.hash(hash)
      })
  }
}
