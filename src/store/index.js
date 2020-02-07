export const state = () => ({
  ownAddress: [],
  ownProfile: {},
  networkId: 1
})

export const mutations = {
  setOwnAddress (state, address) {
    state.ownAddress = address
  },
  setOwnProfile (state, profile) {
    state.ownProfile = profile
  },
  setNetworkId (state, networkId) {
    state.networkId = networkId
  }
}

export const actions = {
  nuxtServerInit () {
  },

  async nuxtClientInit ({ commit }, _context) {
    if (this.$ethereumService.hasWallet && await this.$ethereumService.walletUnlocked()) {
      const address = await this.$ethereumService.getCurrentAccountAsync()
      const ownProfile = await this.$threeBoxService.getUserProfile(address)
      const networkId = await this.$ethereumService.getNetworkIdAsync()

      commit('setOwnAddress', address)
      commit('setOwnProfile', ownProfile)
      commit('setNetworkId', networkId)
    }
  }

}
