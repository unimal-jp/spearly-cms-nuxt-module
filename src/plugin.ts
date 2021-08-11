import { Plugin } from '@nuxt/types'
import { SpearlyApiClient } from 'spearly-js-sdk'

const plugin: Plugin = function (_, inject) {
  const opt = JSON.parse('<%= serialize(options) %>')
  const apiClient = new SpearlyApiClient('www.spearly.com', 'v1', opt.options.apiKey)

  inject('spearly', apiClient)
}

export default plugin
