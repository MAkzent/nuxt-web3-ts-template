import { Plugin } from '@nuxt/types'
import OpenSeaService from '~/services/OpenSeaService'
import ThreeBoxService from '~/services/ThreeBoxService'
import EthersService from '~/services/EthersService'

declare module 'vue/types/vue' {
  interface Vue {
    $openSeaService: OpenSeaService,
    $threeBoxService: ThreeBoxService,
    $ethersService: EthersService,
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $openSeaService: OpenSeaService,
    $threeBoxService: ThreeBoxService,
    $ethersService: EthersService,

  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $openSeaService: OpenSeaService,
    $threeBoxService: ThreeBoxService,
    $ethersService: EthersService,

  }
}

const servicesPlugin: Plugin = ({ app, isDev }, inject) => {
  const openSeaService = new OpenSeaService(
    app.$axios,
    isDev
  )
  const threeBoxService = new ThreeBoxService(
    app.$axios,
    isDev
  )
  const ethersService = new EthersService(
    app.$axios,
    isDev
  )

  inject('openSeaService', openSeaService)
  inject('threeBoxService', threeBoxService)
  inject('ethersService', ethersService)
}

export default servicesPlugin
