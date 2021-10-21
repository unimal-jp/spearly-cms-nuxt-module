<template>
  <component :is="wrapper">
    <component :is="item" v-for="content in contents" :key="content.publicUid">
      <slot :content="content" />
    </component>
  </component>
</template>

<script lang="ts">
import Vue from 'vue'
import { GetParams, Content } from '@spearly/sdk-js'

export type Props = {
  id: string
  order?: string
  orderBy?: string
  wrapper?: string | Vue
  item?: string | Vue
} & Omit<GetParams, 'order' | 'orderBy' | 'orderDirection'>
export type Data = { contents: Content[] }

export default Vue.extend<Data, unknown, unknown, Props>({
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
    wrapper: { type: String, default: 'div' },
    item: { type: String, default: 'div' },
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
    if (this.orderBy) params.orderBy = this.orderBy
    if (this.filterBy) params.filterBy = this.filterBy
    if (this.filterValue) params.filterValue = this.filterValue
    if (this.filterRef) params.filterRef = this.filterRef
    if (this.rangeFrom) params.rangeFrom = this.rangeFrom
    if (this.rangeTo) params.rangeTo = this.rangeTo
    const res = await this.$spearly.getList(this.id, Object.keys(params).length ? params : undefined)
    this.contents = res.contents
  },
})
</script>
