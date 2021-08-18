<template>
  <div>
    <template v-if="$scopedSlots.default">
      <slot v-bind="form" :submit="submit" />
    </template>
    <template v-else>
      <div v-if="!submitted" class="spearly-form">
        <h1 class="spearly-form-name">
          {{ form.name }}
        </h1>
        <p class="spearly-form-description">
          {{ form.description }}
        </p>

        <fieldset v-for="field in form.fields" :key="field.identifier">
          <label :for="['radio', 'checkbox'].includes(field.inputType) ? null : field.identifier">
            {{ field.name }}
            <i v-if="field.required">*</i>
          </label>

          <template v-if="confirm">
            <p class="spearly-form-answer-confirm">
              {{ answer[field.identifier] }}
            </p>
          </template>
          <template v-else-if="field.inputType === 'text'">
            <input
              :id="field.identifier"
              v-model="answer[field.identifier]"
              :required="field.required"
              :aria-describedby="field.description ? `${field.identifier}-description` : null"
              type="text"
            />
          </template>
          <template v-else-if="field.inputType === 'text_area'">
            <textarea
              :id="field.identifier"
              v-model="answer[field.identifier]"
              :require="field.required"
              :aria-describedby="field.description ? `${field.identifier}-description` : null"
            />
          </template>
          <template v-else-if="field.inputType === 'radio'">
            <label v-for="(option, i) in field.data.options" :key="i">
              <input
                v-model="answer[field.identifier]"
                :value="option"
                type="radio"
                :required="required"
                :aria-describedby="field.description ? `${field.identifier}-description` : null"
              />
              <span>{{ option }}</span>
            </label>
          </template>
          <template v-else-if="field.inputType === 'checkbox'">
            <label v-for="(option, i) in field.data.options" :key="i">
              <input
                v-model="answer[field.identifier]"
                :value="option"
                type="checkbox"
                :required="required"
                :aria-describedby="field.description ? `${field.identifier}-description` : null"
              />
              <span>{{ option }}</span>
            </label>
          </template>

          <input
            v-model="answer._spearly_gotcha"
            type="text"
            name="_spearly_gotcha"
            tabindex="-1"
            style="position: absolute; width: 1px; height: 1px; opacity: 0; overflow: hidden"
          />

          <p v-if="field.description" :id="`${field.identifier}-description`" class="spearly-form-field-description">
            {{ field.description }}
          </p>
        </fieldset>

        <button class="spearly-form-submit" @click="onClick">
          <span>送信</span>
        </button>

        <button v-if="confirm" class="spearly-form-back" @click="confirm = false">
          <span>戻る</span>
        </button>
      </div>
      <div v-else class="spearly-form-thanks">
        <h1 class="spearly-form-thanks-title">
          <span>{{ form.name }}を送信しました。</span>
        </h1>
        <p v-if="form.thankYouMessage" class="spearly-form-thanks-message">
          {{ form.thankYouMessage }}
        </p>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from '@unimal-jp/spearly-sdk-js'

export type Props = {
  id: string
}

export type Data = {
  form: {
    createdAt: Date | null
  } & Omit<Form, 'createdAt'>
  answer: { [key: string]: string; _spearly_gotcha: string }
  confirm: boolean
  submitted: boolean
}

export default Vue.extend<
  Data,
  { submit: (fields: { [key: string]: unknown } & { _spearly_gotcha: string }) => Promise<void>; onClick: () => void },
  { identifiers: string[] },
  Props
>({
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      form: {
        id: 0,
        publicUid: '',
        identifier: '',
        name: '',
        description: '',
        thankYouMessage: '',
        fields: [],
        callbackUrl: '',
        startedAt: null,
        endedAt: null,
        createdAt: null,
      },
      answer: {
        _spearly_gotcha: '',
      },
      confirm: false,
      submitted: false,
    }
  },
  async fetch() {
    const res = await this.$spearly.getFormLatest(this.id)
    this.form = res
  },
  computed: {
    identifiers(): string[] {
      return this.form.fields.map((field) => field.identifier)
    },
  },
  created() {
    if (!this.$scopedSlots.default) {
      this.identifiers.forEach((identifier) => {
        this.answer[identifier] = ''
      })
    }
  },
  methods: {
    onClick() {
      if (!this.confirm) {
        this.confirm = true
        return
      }
      this.submit(this.answer)
    },
    async submit(fields: { [key: string]: unknown } & { _spearly_gotcha: string }) {
      await this.$spearly.postFormAnswers(this.form.id, fields)
      this.identifiers.forEach((identifier) => {
        this.answer[identifier] = ''
      })
      if (typeof location !== 'undefined' && this.form.callbackUrl) {
        location.href = this.form.callbackUrl
      } else {
        this.submitted = true
      }
    },
  },
})
</script>
