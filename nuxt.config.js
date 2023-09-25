const baseURL = '/services'
//const baseURL = 'http://172.28.108.78:4025'
//const baseURL = 'http://localhost:2600'
//const baseURL = 'http://172.28.108.251:2600'
//const baseURL = 'http://172.28.108.78:4025'
//const baseURL = 'https://1297-202-137-15-253.ngrok.io'
//const baseURL2 = 'https://api-sidia2.bpjsketenagakerjaan.go.id'
//const baseURL2 = 'http://172.28.108.51:2601'
const baseURL2 = baseURL

export default {
  plugins: [
    '~/plugins/axios',
    '~/plugins/crypto',
    '~/plugins/syncfusion'
  ],
  env: {
    baseURL: baseURL,
    baseURL2: baseURL2,
    SIKD_SEC: '0f80e66as',
    serviceUrlEditor: 'https://sidia-testing.bpjsketenagakerjaan.go.id/sf/api/documenteditor/',
    serviceUrlEditorEjs: 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/'
  },

  ssr: false,
  target: 'server',
  head: {
    titleTemplate: 'SIDIA - BPJAMSOSTEK',
    title: '',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    script: [
              { src: 'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js'},
              { src: 'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js'},
            ],
    link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
  },
  css: ['~/assets/css/roboto.css','@mdi/font/css/materialdesignicons.min.css','~/assets/variables.scss'],
  components: true,
  // router: {
  //   trailingSlash: false
  // },
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/moment',
    // ['@nuxtjs/pwa', {      icon: false }],
  ],
  modules: [
    '@nuxtjs/axios',
    // '@nuxtjs/pwa',
    '@nuxtjs/gtm',
    '@nuxtjs/recaptcha',
    '@nuxtjs/sentry',
    'vue-sweetalert2/nuxt'
  ],
  axios: {
    baseURL
  },
  moment: {
    defaultLocale: 'id',
    locales: ['id'],
    defaultTimezone: 'etc/UTC'
  },
  gtm: {
    id: 'G-LTEVW85LL8',
    pageTracking: true,
    pageViewEventName: 'nuxtRoute',
    noscript: false
  },
  recaptcha: {
    hideBadge: true,
    siteKey: '6LfjonYaAAAAAIUdH0eJoncfHgP7VQ7lTzu3DRzl',
    version: 3
  },
  sentry: {
    dsn: 'https://6b582db2f3cf448ab033aa690dee732f@o1409459.ingest.sentry.io/6745938',
    disableServerSide: true,
    lazy: true,
    //publishRelease: true,
    tracing: true,
    config: {
      // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/
      tracesSampleRate: 0.3,
      vueOptions: {
        tracing: true,
        tracingOptions: {
          hooks: [ 'mount', 'update' ],
          timeout: 2000,
          trackComponents: true
        }
      },
      browserOptions: {}
    }
  },
  vuetify: {
    treeShake: false,
    defaultAssets: false,
    icons: {
      iconfont: 'mdi',
    },
    //customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false
    }
  },

  build: {
    defaultAssets: false,
    terser: {
      terserOptions: {
        compress: {
          // drop_console: true
        }
      }
    }
  },

  vue: {
    config: {
      // devtools: false,
      // productionSourceMap: false,
      productionTip: false
    }
  }
}
