import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import { SpearlyApiClient, Content, Form, GetParams } from '@unimal-jp/spearly-sdk-js'

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
  const apiClient = new SpearlyApiClient('www.spearly.com', 'v1', opt.options.apiKey)

  Vue.component<ListData, unknown, { $spearly: SpearlyApiClient }, ListProps>(
    // eslint-disable-next-line vue/component-definition-name-casing
    'spearly-content-list',
    {
      props: {
        id: { type: String, required: true },
        limit: { type: Number },
        offset: { type: Number },
        order: { type: String },
        orderBy: { type: String },
        filterBy: { type: String },
        filterValue: { type: String },
        filterRef: { type: String },
        rangeFrom: { type: Date },
        rangeTo: { type: Date },
      },
      data() {
        return {
          contents: [],
        }
      },
      async fetch() {
        const params: GetParams = {}
        if (this.limit) params.limit = this.limit
        if (this.offset) params.offset = this.offset
        if (this.order && ['asc', 'desc'].includes(this.order)) params.order = this.order as 'desc' | 'asc'
        if (this.orderBy && ['latest', 'popular'].includes(this.orderBy)) {
          params.orderBy = this.orderBy as 'latest' | 'popular'
        }
        if (this.filterBy) params.filterBy = this.filterBy
        if (this.filterValue) params.filterValue = this.filterValue
        if (this.filterRef) params.filterRef = this.filterRef
        if (this.rangeFrom) params.rangeFrom = this.rangeFrom
        if (this.rangeTo) params.rangeTo = this.rangeTo
        const res = await this.$spearly.getList(this.id, Object.keys(params).length ? params : undefined)
        this.contents = res.contents
      },
      render(createElement) {
        return createElement(
          'div',
          this.contents.map((content) => {
            return createElement('div', [this.$scopedSlots.default ? this.$scopedSlots.default({ content }) : null])
          })
        )
      },
    }
  )

  Vue.component<ContentData, unknown, { $spearly: SpearlyApiClient }, Props>(
    // eslint-disable-next-line vue/component-definition-name-casing
    'spearly-content',
    {
      props: {
        id: { type: String, required: true },
      },
      data() {
        return {
          content: {
            publicUid: '',
            createdAt: null,
            updatedAt: null,
            publishedAt: null,
            contentAlias: '',
            fields: {},
          },
        }
      },
      async fetch() {
        const res = await this.$spearly.getContent(this.id)
        this.content = res
      },
      render(createElement) {
        return createElement('div', [
          this.$scopedSlots.default && this.content.publicUid
            ? this.$scopedSlots.default({ ...this.$data.content })
            : null,
        ])
      },
    }
  )

  Vue.component<
    FormData,
    unknown,
    { $spearly: SpearlyApiClient; submit: (fields: { [key: string]: unknown } & { _spearly_gotcha: string }) => void },
    Props
  >(
    // eslint-disable-next-line vue/component-definition-name-casing
    'spearly-form',
    {
      props: {
        id: { type: String, required: true },
      },
      data() {
        return {
          form: {
            id: 0,
            publicUid: '',
            identifier: '',
            name: '',
            description: '',
            thankYouMessage: '',
            fields: [],
            callbackUrl: '',
            startedAt: null,
            endedAt: null,
            createdAt: null,
          },
        }
      },
      async fetch() {
        const res = await this.$spearly.getFormLatest(this.id)
        this.form = res
      },
      methods: {
        async submit(fields: { [key: string]: unknown } & { _spearly_gotcha: string }) {
          await this.$spearly.postFormAnswers(this.form.id, fields)
          if (typeof window !== 'undefined') {
            window.alert(this.form.thankYouMessage)
          }
        },
      },
      render(createElement) {
        return createElement('div', [
          this.$scopedSlots.default ? this.$scopedSlots.default({ ...this.$data.form, submit: this.submit }) : null,
        ])
      },
    }
  )

  inject('spearly', apiClient)
}

export default plugin
