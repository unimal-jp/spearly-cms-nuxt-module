import type { SpearlyApiClient, SpearlyAnalytics } from '@spearly/sdk-js'

declare module 'vue/types/vue' {
  interface Vue {
    $spearly: SpearlyApiClient
    $spearlyAnalytics: SpearlyAnalytics
  }
}

declare module '@nuxt/vue-app' {
  interface Context {
    $spearly: SpearlyApiClient
    $spearlyAnalytics: SpearlyAnalytics
  }
  interface NuxtAppOptions {
    $spearly: SpearlyApiClient
    $spearlyAnalytics: SpearlyAnalytics
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $spearly: SpearlyApiClient
    $spearlyAnalytics: SpearlyAnalytics
  }

  interface Context {
    $spearly: SpearlyApiClient
    $spearlyAnalytics: SpearlyAnalytics
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $spearly: SpearlyApiClient
    $spearlyAnalytics: SpearlyAnalytics
  }
}
