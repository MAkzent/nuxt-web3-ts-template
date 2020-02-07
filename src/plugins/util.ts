import Util from '~/assets/scripts/Util'

declare module 'vue/types/vue' {
  interface Vue {
    $util: Util
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $util: Util
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $util: Util
  }
}

export default (_ctx, inject) => {
  inject('util', new Util())
}
