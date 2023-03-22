import type { Plugin } from 'vue'
import { useSpearlyCMS } from '../composables'
import { SpearlyNuxtModuleOptions } from '../../types'

export const plugin: Plugin = {
  install(app, options: SpearlyNuxtModuleOptions) {
    const composable = useSpearlyCMS(options.apiKey)
    app.provide('$spearly', composable)
    app.config.globalProperties.$spearly = composable
  },
}
