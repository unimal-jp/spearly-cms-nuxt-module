# @spearly/nuxt-module

This package allows you to easily implement Spearly in your nuxt project!

[![Spec Test](https://github.com/unimal-jp/spearly-cms-nuxt-module/actions/workflows/spec.yml/badge.svg)](https://github.com/unimal-jp/spearly-cms-nuxt-module/actions/workflows/spec.yml)

## If you are using nuxt3

Please see [nuxt3-version branch](https://github.com/unimal-jp/spearly-cms-nuxt-module/tree/nuxt3-version).

## Getting Started

### Install

```
// npm
$ npm i -S @spearly/nuxt-module@^1.0.0-next.3

// yarn
$ yarn add @spearly/nuxt-module@^1.0.0-next.3
```

#### 

### Setup

#### nuxt.config.ts
```ts
export default {
  ...
  modules: [['@spearly/nuxt-module', { apiKey: 'YOUR_API_KEY' }]]
}
```

## How to use

### Content List

```vue
<template>
  <spearly-content-list id="CONTENT_TYPE_ID">
    <template v-slot="item">
      <nuxt-link :to="`/${item.content.attributes.publicUid}`">
        {{ item.content.values.title }}
      </nuxt-link>
    </template>
  </spearly-content-list>
</template>
```

#### use Custom Components

- Make the wrapper its custom component: Specify a component name for `wrapper` prop.
- Make the items its custom component: Specify a component name for `item` prop.

```vue
<template>
  <spearly-content-list wrapper="Wrapper" item="ListItem" id="CONTENT_TYPE_ID">
      <template v-slot="item">
        <nuxt-link :to="`/${item.content.attributes.publicUid}`">
          {{ item.content.values.title }}
        </nuxt-link>
      </template>
    </spearly-content-list>
</template>
```

#### use Show Loading

Specify a component name for `loading` prop.

```vue
<template>
  <spearly-content-list loading="Loading" id="CONTENT_TYPE_ID">
      <template v-slot="item">
        <nuxt-link :to="`/${item.content.attributes.publicUid}`">
          {{ item.content.values.title }}
        </nuxt-link>
      </template>
    </spearly-content-list>
</template>
```

#### Advanced props

- `limit` (number, 10)
- `offset` (number, 0)
- `order` ('desc' | 'asc', 'desc')
- `order-by` ('latest' | 'popular' | string)
- `orders` ( { [fieldId: string]: 'desc' | 'asc' } )
- `filter-by` (string)
- `filter-value` (string | string[])
- `filter-ref` (string)
- `filters` ( { [fieldId: string]: string | string[] } )
- `filter-mode` ('or' | 'and')
- `range-to` (string)
- `range-from` (string)
- `session-id` (string)
- `pattern-name` ('a' | 'b')
- `wrapper` (string | Vue)
- `item` (string | Vue)
- `loading` (Vue)

#### pager slot

The `pager` slot is a slot for creating paginations.
Since the `pager slot has a `paging` scope, you can freely create paginations with it.

- `limit` (number) : The same number as the limit property for the component
- `offset` (number) : The same number as the offset property for the component
- `next` (number) : Indicates the number of offsets on the next page
- `matchingContentsCount` (number) : Indicates the total number of articles narrowed down by filters, etc
- `totalContentsCount` (number) : Indicates the total number of articles registered for the content type

```vue
<template>
  <spearly-content-list id="CONTENT_TYPE_ID">
      <template v-slot="item">
        <nuxt-link :to="`/${item.content.attributes.publicUid}`">
          {{ item.content.values.title }}
        </nuxt-link>
      </template>
      <template #pager="data">
        <button v-if="data.paging.offset > 0" @click="offset -= 10">Previous</button>
        <button v-if="data.paging.next > 0" @click="offset += 10">Next</button>
      </template>
    </spearly-content-list>
</template>
```

### Content

```vue
<template>
  <spearly-content id="CONTENT_PUBLIC_UID">
    <template v-slot="content">
      <header>
        <h1>{{ content.values.title }}</h1>
      </header>
      <div v-html="content.values.body" />
    </template>
  </spearly-content>
</template>
```

#### Advanced props

- `pattern-name` ('a' | 'b')

#### use Show Loading

Specify a component name for `loading` prop.

```vue
<template>
  <spearly-content loading="Loading" id="CONTENT_PUBLIC_UID">
    <template v-slot="content">
      <header>
        <h1>{{ content.values.title }}</h1>
      </header>
      <div v-html="content.values.body" />
    </template>
  </spearly-content>
</template>
```

#### show Preview

You can preview the draft content by specifying `preview-token` and `id`.

```vue
<template>
  <spearly-content :id="$route.query.content_id" :preview-token="$route.query.preview_token">
    <template v-slot="content">
      <header>
        <h1>{{ content.values.title }}</h1>
      </header>
      <div v-html="content.values.body" />
    </template>
  </spearly-content>
</template>
```

### Form

```vue
<template>
  <spearly-form id="FORM_ID" />
</template>
```

#### Advanced form

```vue
<template>
  <spearly-form id="FORM_ID">
    <template v-slot="form">
      <fieldset v-for="field in form.fields" :key="field.identifier">
        <label :for="['radio', 'checkbox'].includes(field.inputType) ? null : field.identifier">
          {{ field.name }}
          <i v-if="field.required">*</i>
        </label>

        <input
          :id="field.identifier"
          v-model="state.answers[field.identifier]"
          :required="field.required"
          :aria-describedby="field.description ? `${field.identifier}-description` : null"
          type="text"
        />
      </fieldset>
      ...
      <input v-model="answers._spearly_gotcha" type="text" style="position: absolute; width: 1px; height: 1px; overflow: hidden;" />
      <button @click="form.submit(answers)">Submit</button> // form.submit is the method to submit the spearly form.
    </template>
  </spearly-form>
</template>

<script lang="ts" setup>
const state = reactive({
  answers: {
    YOUR_FORM_FIELD_ID: '',
    ...,
    _spearly_gotcha: '',
  },
})
</script>
```

#### use Show Loading

Specify a component name for `loading` prop.

```vue
<template>
  <spearly-form loading="Loading" id="FORM_ID" />
</template>
```

### Provide data

The following two data are provide.

- `$spearly` : API Client for get content list, form submission, etc.
- `$spearlyAnalytics` : Used to send pageView (impressions) and conversions required for A/B Testing

### A/B Testing analytics

> **Warning**  
> A/B Testing does not support SSR and SSG, Only SPA can use this feature.  
> We are working on it now, so please wait for a while.

#### Impression

If you are using the SpearlyContent component, you do not need to do anything special. The component will send the impression for you.

If you wish to send your own, you can do so with the following code:

```js
const $spearlyAnalytics = inject('$spearlyAnalytics')
await $spearlyAnalytics.pageView({
  contentId: CONTENT_ID,
  patternName: 'a' or 'b',
})
```

#### Conversion

If you are using A/B testing, you can count conversions by using the conversion method as follows

```js
const $spearlyAnalytics = inject('$spearlyAnalytics')
const handleSubmit = async () => {
  await $spearlyAnalytics.conversion({
    contentId: CONTENT_ID,
    patternName: 'a' or 'b',
  })
}
```
