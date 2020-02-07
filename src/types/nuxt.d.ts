import { NuxtApp } from '@nuxt/types/app/index'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

export interface Context {
  $axios: NuxtAxiosInstance
}

export interface NuxtLoading extends NuxtApp {
  $loading: any
}

declare module 'web3'
