<template>
  <div>
    <template v-if="loading && !state.isLoaded">
      <component :is="loading" />
    </template>
    <template v-else>
      <slot v-if="state.content.id" v-bind="state.content" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, reactive } from 'vue'
import { useNuxtApp } from '#app'
import { SpearlyContentState } from './types'

const app = useNuxtApp()
const props = defineProps({
  id: { type: String, required: true },
  previewToken: { type: String },
  loading: { type: [String, Object] },
})

const state = reactive<SpearlyContentState>({
  content: {
    attributes: {
      contentAlias: '',
      createdAt: null,
      fields: {
        data: [],
      },
      nextContent: null,
      previousContent: null,
      publicUid: '',
      publishedAt: null,
      updatedAt: null,
    },
    id: '',
    type: 'content',
    values: {},
  },
  isLoaded: false,
})

const fetchContent = async () => {
  state.isLoaded = false

  try {
    if (!props.previewToken) {
      state.content = await app.vueApp._context.provides.$spearly.getSpearlyContent(props.id)
    } else {
      state.content = await app.vueApp._context.provides.$spearly.getSpearlyContent(props.id, props.previewToken)
    }
  } catch (error) {
    console.error(error)
  } finally {
    state.isLoaded = true
  }
}

await fetchContent()

onBeforeUnmount(() => {
  state.isLoaded = false
})
</script>
