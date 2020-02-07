import { Plugin } from '@nuxt/types'
import EthereumService from '~/services/EthereumService'

declare module 'vue/types/vue' {
  interface Vue {
    $ethereumService: EthereumService
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $ethereumService: EthereumService
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $ethereumService: EthereumService
  }
}

declare global {
  interface Window {
    ethereum?: any
    web3?: any
  }
}

const ethereumPlugin: Plugin = ({ isDev, store }, inject) => {
  let ethereumService
  if (process.browser && window.ethereum) {
    ethereumService = new EthereumService(window.ethereum, store, { dev: isDev })
    ethereumService.init()
  } else if (process.browser && window.web3) {
    ethereumService = new EthereumService(window.web3.currentProvider, store, { dev: isDev })
  } else {
    ethereumService = new EthereumService(null, store, { dev: isDev })
  }
  inject('ethereumService', ethereumService)
}

export default ethereumPlugin
