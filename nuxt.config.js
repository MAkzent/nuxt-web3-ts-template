const env = require('dotenv').config()

module.exports = {
  env: {
    ...env.parsed,
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },
  head: {
    title: 'Die Kitty Dai',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Die Kitty Dai - Let your Kitties join the raid squad to win some Dai.'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Montserrat:600|Roboto|Roboto+Mono&display=swap'
      }
    ]
  },
  loading: { color: '#101113' },
  css: [
    '~/assets/styles/main.scss'
    ],
  plugins: [
    { src: '@/plugins/axios' },
    { src: '@/plugins/vue-lazyload' },
    { src: '@/plugins/ethereum' },
    { src: '@/plugins/services' },
    { src: '@/plugins/util' },
    { src: '@/plugins/nuxt-client-init.client' }
  ],
  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    'vue-scrollto/nuxt',
    'cookie-universal-nuxt'
  ],
  axios: {
    common: {
      'Content-Type': 'application/json'
    }
  },
  build: {
    /*
     ** You can extend webpack config here
     */
    // extend(config, ctx) {
    // }
    babel: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
      ]
    }
  },
  buildModules: [
      ['@nuxt/typescript-build', {
        typeCheck: {
          memoryLimit: 4096,
          workers: 2
        }
      }]
  ],
  srcDir: 'src/',
  // server: {
  //   host: process.env.HOST || '0.0.0.0',
  //   port: process.env.PORT || 3000
  // },
  styleResources: {
    scss: ['~/assets/styles/_variables.scss']
  },
  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
    vueI18nLoader: true,
    parsePages: false
  },
  router: {
    linkActiveClass: 'active-link'
  }
}
