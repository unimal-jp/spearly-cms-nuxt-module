<template>
  <div class="spearly-content-list">
    <template v-if="loading && !state.isLoaded">
      <component :is="loading" />
    </template>
    <component :is="wrapper" v-else>
      <component :is="item" v-for="content in state.contents" :key="content.attributes.publicUid">
        <slot :content="content" />
      </component>
    </component>

    <slot name="pager" :paging="paging" />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, reactive, computed, watch } from 'vue'
import { useNuxtApp } from '#app'
import { SpearlyContentListState } from './types'

const app = useNuxtApp()
const props = defineProps({
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
  wrapper: { type: [String, Object], default: 'div' },
  item: { type: [String, Object], default: 'div' },
  loading: { type: [String, Object] },
})
const state = reactive<SpearlyContentListState>({
  contents: [],
  isLoaded: false,
  next: 0,
  matchingContentsCount: 0,
  totalContentsCount: 0,
})

const paging = computed(() => ({
  limit: props.limit,
  offset: props.offset,
  next: state.next,
  matchingContentsCount: state.matchingContentsCount,
  totalContentsCount: state.totalContentsCount,
}))

const fetchContentList = async () => {
  state.isLoaded = false

  try {
    const { id, ...params } = props
    const { data, next, matchingContentsCount, totalContentsCount } =
      await app.vueApp._context.provides.$spearly.getSpearlyList(id, params)
    state.contents = data
    state.next = next
    state.matchingContentsCount = matchingContentsCount
    state.totalContentsCount = totalContentsCount
  } catch (error) {
    console.error(error)
  } finally {
    state.isLoaded = true
  }
}

onBeforeUnmount(() => {
  state.isLoaded = false
})

await fetchContentList()

watch(
  () => props.limit,
  async () => {
    await fetchContentList()
  }
)

watch(
  () => props.offset,
  async () => {
    await fetchContentList()
  }
)

watch(
  () => props.order,
  async () => {
    await fetchContentList()
  }
)

watch(
  () => props.orderBy,
  async () => {
    await fetchContentList()
  }
)

watch(
  () => props.filterBy,
  async () => {
    await fetchContentList()
  }
)

watch(
  () => props.filterValue,
  async () => {
    await fetchContentList()
  }
)

watch(
  () => props.filterRef,
  async () => {
    await fetchContentList()
  }
)

watch(
  () => props.rangeFrom,
  async () => {
    await fetchContentList()
  }
)

watch(
  () => props.rangeTo,
  async () => {
    await fetchContentList()
  }
)
</script>
