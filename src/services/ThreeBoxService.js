import { getProfile } from '3box/lib/api'

// currently only work with mainnet

export default class ThreeBoxService {
  constructor (axios, _isDev) {
    this.axios = axios
  }

  async getUserProfile (userAddress) {
    let profile = {}
    try {
      profile = await getProfile(userAddress, {})
    } catch (e) {
      console.error('Error fetching threebox profile: ', e)
    }
    return profile
  }
}
