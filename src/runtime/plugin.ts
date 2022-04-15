import { defineNuxtPlugin } from '#app'
import { plugin } from './plugins'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(plugin, { apiKey: nuxtApp.payload.config.public.spearly.apiKey })
})
