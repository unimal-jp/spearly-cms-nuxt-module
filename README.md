# @spearly/nuxt-module

[![Spec Test](https://github.com/unimal-jp/spearly-cms-nuxt-module/actions/workflows/spec.yml/badge.svg)](https://github.com/unimal-jp/spearly-cms-nuxt-module/actions/workflows/spec.yml)

## Getting Started

### Install

```
// npm
$ npm i -S @spearly/nuxt-module

// yarn
$ yarn add @spearly/nuxt-module
```

### Setup

#### nuxt.config.(j|t)s
```ts
export default {
  ...
  buildModules: ['@spearly/nuxt-module'],
  spearly: {
    options: {
      apiKey: 'SPEARLY_API_KEY',
    },
    mode: 'all',
  },
}
```

#### tsconfig.json
*Only if you use TypeScript.

```json
{
  "compilerOptions": {
    ...
    "types": ["@spearly/nuxt-module"]
  },
  ...
}
```

## How to use

### Content List

```vue
<template>
  <spearly-content-list id="CONTENT_TYPE_ID">
      <template v-slot="item">
        <nuxt-link :to="`/${item.content.publicUid}`">
          {{ item.content.fields.title.value }}
        </nuxt-link>
      </template>
    </spearly-content-list>
</template>

<script>
export default {}
</script>
```

#### Advanced props

- `limit` (number, 10)
- `offset` (number, 0)
- `order` ('desc' | 'asc', 'desc')
- `order_by` ('latest' | 'popular' | string)
- `filter_by` (string)
- `filter_value` (string)
- `filter_ref` (string)
- `range_to` (string)
- `range_from` (string)
- `wrapper` (string)
- `item` (string)

### Content

```vue
<template>
  <spearly-content id="CONTENT_PUBLIC_UID">
    <template v-slot="content">
      <header>
        <h1>{{ content.fields.title.value }}</h1>
      </header>
      <div v-html="content.fields.body.value" />
    </template>
  </spearly-content>
</template>

<script>
export default {}
</script>
```

### Form

```vue
<template>
  <spearly-form id="FORM_ID" />
</template>

<script>
export default {}
</script>
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
          v-model="answers[field.identifier]"
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

<script>
export default {
  data() {
    return {
      answers: {
        YOUR_FORM_FIELD_ID: '',
        ...,
        _spearly_gotcha: '',
      }
    }
  }
}
</script>
```
