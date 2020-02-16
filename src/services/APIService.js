export default class APIService {
  constructor (axios, _isDev) {
    this.axios = axios
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

  getRaidStats (bossId) {
    return this.fetch(`/api/boss/${bossId}`)
  }
}
