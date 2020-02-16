import { Plugin } from '@nuxt/types'
import OpenSeaService from '~/services/OpenSeaService'
import ThreeBoxService from '~/services/ThreeBoxService'
import APIService from '~/services/APIService'

declare module 'vue/types/vue' {
  interface Vue {
    $openSeaService: OpenSeaService,
    $threeBoxService: ThreeBoxService,
    $apiService: APIService,
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $openSeaService: OpenSeaService,
    $threeBoxService: ThreeBoxService,
    $apiService: APIService
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $openSeaService: OpenSeaService,
    $threeBoxService: ThreeBoxService,
    $apiService: APIService
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
  const apiService = new APIService(
    app.$axios,
    isDev
  )

  inject('openSeaService', openSeaService)
  inject('threeBoxService', threeBoxService)
  inject('apiService', apiService)
}

export default servicesPlugin
