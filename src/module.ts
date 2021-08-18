import path from 'path'
import { Module } from '@nuxt/types'

export type ModuleConfig = {
  apiKey: string
}

export type ModuleOptions = {
  fileName?: string
  mode?: 'all' | 'server' | 'client'
  options: ModuleConfig
}

export type Package = {
  name: string
  version: string
  description: string
  main: string
  license: string
}

export interface SpearlyModule<T> extends Module<T> {
  meta: Package
}

const spearlyModule: SpearlyModule<ModuleOptions> = function (this, moduleOptions) {
  const options = { ...this.options.spearly, ...moduleOptions }
  this.addPlugin({
    src: path.resolve(__dirname, './plugin.js'),
    options,
  })
}
spearlyModule.meta = require('../../package.json')

export default spearlyModule
