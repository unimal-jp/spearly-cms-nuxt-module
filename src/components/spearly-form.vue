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

        <p v-if="form.startedAt || form.endedAt" class="spearly-form-period">
          <span>
            このフォームの受付期間は{{ formattedDate(form.startedAt) }}〜{{ formattedDate(form.endedAt) }}です。
          </span>
        </p>

        <p v-if="error" class="spearly-form-error">
          <span>フォームを送信できませんでした。内容をご確認の上、再度お試しください。</span>
        </p>

        <fieldset v-for="field in form.fields" :key="field.identifier">
          <label :for="['radio', 'checkbox'].includes(field.inputType) ? null : field.identifier">
            {{ field.name }}
            <i v-if="field.required">*</i>
          </label>

          <template v-if="confirm">
            <p class="spearly-form-answer-confirm">
              {{
                Array.isArray(answers[field.identifier])
                  ? answers[field.identifier].join(', ')
                  : answers[field.identifier]
              }}
            </p>
          </template>
          <template v-else-if="field.inputType === 'text'">
            <input
              :id="field.identifier"
              v-model="answers[field.identifier]"
              :required="field.required"
              :disabled="!isActive"
              :aria-describedby="field.description ? `${field.identifier}-description` : null"
              type="text"
            />
          </template>
          <template v-else-if="field.inputType === 'text_area'">
            <textarea
              :id="field.identifier"
              v-model="answers[field.identifier]"
              :require="field.required"
              :disabled="!isActive"
              :aria-describedby="field.description ? `${field.identifier}-description` : null"
            />
          </template>
          <template v-else-if="field.inputType === 'radio'">
            <label v-for="(option, i) in field.data.options" :key="i" class="spearly-form-radio">
              <input
                v-model="answers[field.identifier]"
                :name="field.identifier"
                :value="option"
                type="radio"
                :required="field.required"
                :disabled="!isActive"
                :aria-describedby="field.description ? `${field.identifier}-description` : null"
              />
              <span>{{ option }}</span>
            </label>
          </template>
          <template v-else-if="field.inputType === 'checkbox'">
            <label v-for="(option, i) in field.data.options" :key="i" class="spearly-form-checkbox">
              <input
                v-model="answers[field.identifier]"
                :name="field.identifier"
                :value="option"
                type="checkbox"
                :required="field.required"
                :disabled="!isActive"
                :aria-describedby="field.description ? `${field.identifier}-description` : null"
              />
              <span>{{ option }}</span>
            </label>
          </template>

          <input
            v-model="answers._spearly_gotcha"
            type="text"
            name="_spearly_gotcha"
            tabindex="-1"
            style="position: absolute; width: 1px; height: 1px; opacity: 0; overflow: hidden"
          />

          <p v-if="field.description" :id="`${field.identifier}-description`" class="spearly-form-field-description">
            {{ field.description }}
          </p>
        </fieldset>

        <p v-if="!isActive" class="spearly-form-outside">
          <span>このフォームは現在受付期間外です。</span>
        </p>

        <p v-if="validateError" class="spearly-form-error">
          <span>入力されていない項目があります。</span>
        </p>

        <button :disabled="!isActive" class="spearly-form-submit" @click="onClick">
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
import { Form } from '@spearly/sdk-js'

export type Props = {
  id: string
  noValidate: boolean
}

export type Data = {
  form: {
    createdAt: Date | null
  } & Omit<Form, 'createdAt'>
  answers: { [key: string]: string | string[]; _spearly_gotcha: string }
  error: boolean
  validateError: boolean
  confirm: boolean
  submitted: boolean
}

export default Vue.extend<
  Data,
  {
    setAnswersObj: () => void
    formattedDate: (date: Date) => string
    validate: () => boolean
    submit: (fields: { [key: string]: unknown } & { _spearly_gotcha: string }) => Promise<void>
    onClick: () => void
  },
  {
    now: number
    identifiers: string[]
    isActive: boolean
  },
  Props
>({
  props: {
    id: { type: String, required: true },
    noValidate: { type: Boolean },
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
      answers: {
        _spearly_gotcha: '',
      },
      error: false,
      validateError: false,
      confirm: false,
      submitted: false,
    }
  },
  async fetch() {
    const res = await this.$spearly.getFormLatest(this.id)
    this.form = res
  },
  computed: {
    now() {
      return new Date().getTime()
    },
    identifiers(): string[] {
      return this.form.fields.map((field) => field.identifier)
    },
    isActive() {
      if (!this.form.startedAt && !this.form.endedAt) return true
      if (this.form.startedAt && this.form.startedAt.getTime() > this.now) return false
      if (this.form.endedAt && this.form.endedAt.getTime() < this.now) return false

      return true
    },
  },
  watch: {
    'form.fields'() {
      this.setAnswersObj()
    },
  },
  mounted() {
    this.setAnswersObj()
  },
  methods: {
    setAnswersObj() {
      if (this.$scopedSlots.default) return
      this.form.fields.forEach((field) => {
        this.answers[field.identifier] = field.inputType === 'checkbox' && field.data?.options.length ? [] : ''
      })
    },
    formattedDate(date) {
      if (!date) return ''
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      const h = String(date.getHours()).padStart(2, '0')
      const mi = String(date.getMinutes()).padStart(2, '0')
      return `${y}/${m}/${d} ${h}:${mi}`
    },
    validate() {
      const requiredFieldIds: string[] = this.form.fields
        .filter((field) => field.required)
        .map((field) => field.identifier)
      return requiredFieldIds.every((identifier) => {
        return !!this.answers[identifier]
      })
    },
    onClick() {
      if (!this.confirm) {
        if (!this.validate()) {
          this.validateError = true
          return
        }
        this.validateError = false
        this.confirm = true
        return
      }
      this.submit(this.answers)
    },
    async submit(fields: { [key: string]: unknown } & { _spearly_gotcha: string }) {
      try {
        await this.$spearly.postFormAnswers(this.form.id, fields)
        this.identifiers.forEach((identifier) => {
          this.answers[identifier] =
            this.form.fields.find((field) => field.identifier === identifier)?.inputType === 'checkbox' ? [] : ''
        })
        if (typeof location !== 'undefined' && this.form.callbackUrl) {
          location.href = this.form.callbackUrl
        } else {
          this.submitted = true
        }
      } catch {
        this.error = true
        this.confirm = false
      }
    },
  },
})
</script>
