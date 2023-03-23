import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import { SpearlyContentList, SpearlyContent, SpearlyForm } from './components'
import { SpearlyApiClient, Content, Form, GetParams } from '@spearly/sdk-js'

export type ListData = {
  contents: Content[]
}

export type ContentData = {
  content: {
    createdAt: Date | null
    updatedAt: Date | null
    publishedAt: Date | null
  } & Omit<Content, 'createdAt' | 'updatedAt' | 'publishedAt'>
}

export type FormData = {
  form: {
    createdAt: Date | null
  } & Omit<Form, 'createdAt'>
}

export type Props = {
  id: string
}

export type ListProps = { order?: string; orderBy?: string } & Omit<GetParams, 'order' | 'orderBy' | 'orderDirection'> &
  Props

const plugin: Plugin = function (_, inject) {
  const opt = JSON.parse('<%= serialize(options) %>')
  const apiClient = new SpearlyApiClient(opt.options.apiKey)

  Vue.component<ListData, { $spearly: SpearlyApiClient }, unknown, ListProps>(
    // eslint-disable-next-line vue/component-definition-name-casing
    'spearly-content-list',
    SpearlyContentList
  )

  Vue.component<ContentData, unknown, { $spearly: SpearlyApiClient }, Props>(
    // eslint-disable-next-line vue/component-definition-name-casing
    'spearly-content',
    SpearlyContent
  )

  Vue.component<
    FormData,
    unknown,
    { $spearly: SpearlyApiClient; submit: (fields: { [key: string]: unknown } & { _spearly_gotcha: string }) => void },
    Props
  >(
    // eslint-disable-next-line vue/component-definition-name-casing
    'spearly-form',
    SpearlyForm
  )

  inject('spearly', apiClient)
}

export default plugin
