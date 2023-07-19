import type { Plugin } from 'vue'
import { useSpearlyCMS, useSpearlyAnalytics } from '../composables'
import { SpearlyNuxtModuleOptions } from '../../types'

export const plugin: Plugin = {
  install(app, options: SpearlyNuxtModuleOptions) {
    const spearlyCMSComposable = useSpearlyCMS(options.apiKey)
    const spearlyAnalyticsComposable = useSpearlyAnalytics()

    app.provide('$spearly', spearlyCMSComposable)
    app.provide('$spearlyAnalytics', spearlyAnalyticsComposable)

    app.config.globalProperties.$spearly = spearlyCMSComposable
    app.config.globalProperties.$spearlyAnalytics = spearlyAnalyticsComposable
  },
}
