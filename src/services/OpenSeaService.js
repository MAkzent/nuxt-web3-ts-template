const BASEURL = 'https://api.opensea.io/api/v1'
const RINKEBY_BASEURL = 'https://rinkeby-api.opensea.io/api/v1'

const CK_ADDRESS = '0x06012c8cf97bead5deae237070f9587f8e7a266d'
const CK_ADDRESS_RINKEBY = '0x16baf0de678e52367adc69fd067e5edd1d33e3bf'

export default class OpenSeaService {
  constructor (axios, _isDev) {
    this.axios = axios
  }

  baseUrl (networkId) {
    if (networkId === 1) { return BASEURL }
    if (networkId === 4) { return RINKEBY_BASEURL }
    return BASEURL
  }

  ckAddress (networkId) {
    if (networkId === 1) { return CK_ADDRESS }
    if (networkId === 4) { return CK_ADDRESS_RINKEBY }
    return CK_ADDRESS
  }

  async fetch (url) {
    let res = {}
    try {
      const { data } = await this.axios.get(url)
      res = data
    } catch (e) {
      console.error(e)
    }
    if (res.error) { return console.error('Error in OpenSea fetch: ', res.error) }
    return res
  }

  getAssetDetails (contractAddress, assetId, networkId) {
    return this.fetch(`${this.baseUrl(networkId)}/asset/${contractAddress}/${assetId}`)
  }

  getKittiesByAccount (contractAddress, networkId) {
    return this.fetch(`${this.baseUrl(networkId)}/assets?owner=${contractAddress}&asset_contract_address=${this.ckAddress(networkId)}`)
  }
}
