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
import { onBeforeUnmount, reactive, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import { useSpearlyAnalytics } from '../../composables'
import type { PropType } from 'vue'
import type { SpearlyContentState } from './types'
import type { SpearlyGetContentParams } from '../../types'

const app = useNuxtApp()
const props = defineProps({
  id: { type: String, required: true },
  patternName: { type: String as PropType<'a' | 'b'> },
  previewToken: { type: String },
  loading: { type: [String, Object] },
})

const analytics = useSpearlyAnalytics()

const state = reactive<SpearlyContentState>({
  content: {
    attributes: {
      contentAlias: '',
      createdAt: null,
      patternName: 'a',
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
      const params: SpearlyGetContentParams = {}
      if (props.patternName) params.patternName = props.patternName
      state.content = await app.vueApp._context.provides.$spearly.getSpearlyContent(props.id, params)
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

onMounted(() => {
  if (props.previewToken) return
  analytics.pageView({
    contentId: state.content.id,
    patternName: state.content.attributes.patternName,
  })
})

onBeforeUnmount(() => {
  state.isLoaded = false
})
</script>
