import { SpearlyApiClient } from '@unimal-jp/spearly-js-sdk'

declare module 'vue/types/vue' {
  interface Vue {
    $spearly: SpearlyApiClient
  }
}

declare module '@nuxt/vue-app' {
  interface Context {
    $spearly: SpearlyApiClient
  }
  interface NuxtAppOptions {
    $spearly: SpearlyApiClient
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $spearly: SpearlyApiClient
  }

  interface Context {
    $spearly: SpearlyApiClient
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $spearly: SpearlyApiClient
  }
}
