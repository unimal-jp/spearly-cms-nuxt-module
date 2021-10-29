<template>
  <div>
    <template v-if="loading && !isLoaded">
      <component :is="loading" />
    </template>
    <template v-else>
      <slot v-if="content.publicUid" v-bind="content" />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Content } from '@spearly/sdk-js'

export type Props = {
  id: string
  loading?: string
}

export type Data = {
  content: {
    createdAt: Date | null
    updatedAt: Date | null
    publishedAt: Date | null
  } & Omit<Content, 'createdAt' | 'updatedAt' | 'publishedAt'>
  isLoaded: boolean
}

export default Vue.extend<Data, unknown, unknown, Props>({
  props: {
    id: { type: String, required: true },
    loading: { type: [String] },
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
      isLoaded: false,
    }
  },
  async fetch() {
    const res = await this.$spearly.getContent(this.id)
    this.content = res
    this.isLoaded = true
  },
  destroyed() {
    this.isLoaded = false
  },
})
</script>
