<template>
  <div>
    <template v-if="loading && !isLoaded">
      <component :is="loading" />
    </template>
    <template v-else>
      <slot v-if="content.id" v-bind="content" />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Content } from '@spearly/sdk-js'

export type Props = {
  id: string
  previewToken?: string
  loading?: string
}

export type Data = {
  content: {
    attributes: {
      createdAt: Date | null
      updatedAt: Date | null
      publishedAt: Date | null
    } & Omit<Content['attributes'], 'createdAt' | 'updatedAt' | 'publishedAt'>
  } & Omit<Content, 'attributes'>
  isLoaded: boolean
}

export default Vue.extend<Data, unknown, unknown, Props>({
  props: {
    id: { type: String, required: true },
    loading: { type: String },
    previewToken: { type: String },
  },
  data() {
    return {
      content: {
        attributes: {
          publicUid: '',
          createdAt: null,
          updatedAt: null,
          publishedAt: null,
          contentAlias: '',
          fields: {
            data: [],
          },
          nextContent: null,
          previousContent: null,
        },
        id: '',
        type: 'content',
        values: {},
      },
      isLoaded: false,
    }
  },
  async fetch() {
    if (!this.$props.previewToken) {
      const res = await this.$spearly.getContent(this.$props.id)
      this.content = res
      this.isLoaded = true
    } else {
      const res = await this.$spearly.getContentPreview(this.$props.id, this.$props.previewToken)
      this.content = res
      this.isLoaded = true
    }
  },
  destroyed() {
    this.isLoaded = false
  },
})
</script>
