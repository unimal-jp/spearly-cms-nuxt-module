import { defineNuxtModule, createResolver, addPlugin, addComponent } from '@nuxt/kit'
import { SpearlyNuxtModuleOptions } from './types'

export * from './runtime/composables'

export default defineNuxtModule<SpearlyNuxtModuleOptions>({
  meta: {
    name: '@spearly/nuxt-module',
    configKey: 'spearlyNuxtModule',
  },
  async setup(options, nuxt) {
    nuxt.options.runtimeConfig.public.spearly = {
      apiKey: options.apiKey,
    }

    const resolver = createResolver(import.meta.url)

    addPlugin({ src: resolver.resolve('runtime/plugin.mjs') })

    await Promise.all([
      addComponent({
        name: 'spearly-content-list',
        filePath: resolver.resolve('runtime/components/spearly-content-list/index.vue'),
      }),
      addComponent({
        name: 'spearly-content',
        filePath: resolver.resolve('runtime/components/spearly-content/index.vue'),
      }),
      addComponent({
        name: 'spearly-form',
        filePath: resolver.resolve('runtime/components/spearly-form/index.vue'),
      }),
    ])
  },
})
