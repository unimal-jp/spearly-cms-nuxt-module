<template>
  <div class="spearly-content-list">
    <template v-if="loading && !isLoaded">
      <component :is="loading" />
    </template>
    <component :is="wrapper" v-else>
      <component :is="item" v-for="content in contents" :key="content.attributes.publicUid">
        <slot :content="content" />
      </component>
    </component>

    <slot name="pager" :paging="paging" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { GetParams, Content } from '@spearly/sdk-js'

export type Props = {
  id: string
  order?: string
  orderBy?: string
  wrapper?: string
  item?: string
  loading?: string
} & Omit<GetParams, 'order' | 'orderBy' | 'orderDirection'>

export type Data = {
  contents: Content[]
  isLoaded: boolean
  next: number
  matchingContentsCount: number
  totalContentsCount: number
}

export type Computed = {
  paging: {
    limit?: number
    offset?: number
    next: number
    matchingContentsCount: number
    totalContentsCount: number
  }
}

export default Vue.extend<Data, Computed, unknown, Props>({
  props: {
    id: { type: String, required: true },
    limit: { type: Number },
    offset: { type: Number },
    order: { type: String },
    orderBy: { type: String },
    orders: { type: Object as PropType<GetParams['orders']> },
    filterBy: { type: String },
    filterValue: { type: [String, Array] as PropType<GetParams['filterValue']> },
    filterRef: { type: String },
    filterMode: { type: String as PropType<GetParams['filterMode']> },
    filters: { type: Object as PropType<GetParams['filters']> },
    rangeFrom: { type: Date },
    rangeTo: { type: Date },
    wrapper: { type: [String], default: 'div' },
    item: { type: [String], default: 'div' },
    loading: { type: [String] },
  },
  data() {
    return {
      contents: [],
      isLoaded: false,
      next: 0,
      matchingContentsCount: 0,
      totalContentsCount: 0,
    }
  },
  async fetch() {
    const params: GetParams = {}
    if (this.limit) params.limit = this.limit
    if (this.offset) params.offset = this.offset
    if (this.order && ['asc', 'desc'].includes(this.order)) params.order = this.order as 'desc' | 'asc'
    if (this.orderBy) params.orderBy = this.orderBy
    if (this.orders) params.orders = this.orders
    if (this.filterBy) params.filterBy = this.filterBy
    if (this.filterValue) params.filterValue = this.filterValue
    if (this.filterRef) params.filterRef = this.filterRef
    if (this.filterMode) params.filterMode = this.filterMode
    if (this.filters) params.filters = this.filters
    if (this.rangeFrom) params.rangeFrom = this.rangeFrom
    if (this.rangeTo) params.rangeTo = this.rangeTo
    const res = await this.$spearly.getList(this.id, Object.keys(params).length ? params : undefined)
    this.contents = res.data
    this.isLoaded = true
    this.next = res.next
    this.matchingContentsCount = res.matchingContentsCount
    this.totalContentsCount = res.totalContentsCount
  },
  computed: {
    paging() {
      return {
        limit: this.limit,
        offset: this.offset,
        next: this.next,
        matchingContentsCount: this.matchingContentsCount,
        totalContentsCount: this.totalContentsCount,
      }
    },
  },
  watch: {
    limit() {
      this.$fetch()
    },
    offset() {
      this.$fetch()
    },
    order() {
      this.$fetch()
    },
    orderBy() {
      this.$fetch()
    },
    filterBy() {
      this.$fetch()
    },
    filterValue() {
      this.$fetch()
    },
    filterRef() {
      this.$fetch()
    },
    rangeFrom() {
      this.$fetch()
    },
    rangeTo() {
      this.$fetch()
    },
  },
  beforeDestroy() {
    this.isLoaded = false
  },
})
</script>
