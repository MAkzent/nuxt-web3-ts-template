import { Plugin } from '@nuxt/types'
import OpenSeaService from '~/services/OpenSeaService'
import ThreeBoxService from '~/services/ThreeBoxService'

declare module 'vue/types/vue' {
  interface Vue {
    $openSeaService: OpenSeaService,
    $threeBoxService: ThreeBoxService,

  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $openSeaService: OpenSeaService,
    $threeBoxService: ThreeBoxService,
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $openSeaService: OpenSeaService,
    $threeBoxService: ThreeBoxService,
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
  inject('openSeaService', openSeaService)
  inject('threeBoxService', threeBoxService)
}

export default servicesPlugin
