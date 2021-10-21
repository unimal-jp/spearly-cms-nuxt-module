<template>
  <div>
    <template v-if="content.publicUid">
      <slot v-bind="content" />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Content } from '@spearly/sdk-js'

export type Props = {
  id: string
}

export type Data = {
  content: {
    createdAt: Date | null
    updatedAt: Date | null
    publishedAt: Date | null
  } & Omit<Content, 'createdAt' | 'updatedAt' | 'publishedAt'>
}

export default Vue.extend<Data, unknown, unknown, Props>({
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
      this.$scopedSlots.default && this.content.publicUid ? this.$scopedSlots.default({ ...this.$data.content }) : null,
    ])
  },
})
</script>
