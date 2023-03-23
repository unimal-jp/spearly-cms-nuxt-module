<template>
  <div>
    <template v-if="loading && !isLoaded">
      <component :is="loading" />
    </template>
    <template v-else>
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
              このフォームの受付期間は
              {{ form.startedAt ? formattedDate(form.startedAt) : '' }}〜
              {{ form.endedAt ? formattedDate(form.endedAt) : '' }}
              です。
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
              <p v-if="field.inputType !== 'file'" class="spearly-form-answer-confirm">
                {{ answers[field.identifier] }}
              </p>
              <p v-else class="spearly-form-answer-confirm">
                {{ files[field.identifier] }}
              </p>
            </template>
            <template v-else-if="['text', 'number', 'email', 'tel', 'url'].includes(field.inputType)">
              <input
                :id="field.identifier"
                v-model="answers[field.identifier]"
                :required="field.required"
                :disabled="!isActive"
                :aria-invalid="!!getErrorMessage(field.identifier)"
                :aria-describedby="field.description ? `${field.identifier}-description` : null"
                :type="field.inputType"
              />
            </template>
            <template v-else-if="field.inputType === 'text_area'">
              <textarea
                :id="field.identifier"
                v-model="answers[field.identifier]"
                :require="field.required"
                :disabled="!isActive"
                :aria-invalid="!!getErrorMessage(field.identifier)"
                :aria-describedby="field.description ? `${field.identifier}-description` : null"
              />
            </template>
            <template v-else-if="field.inputType === 'radio' && field.data">
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
            <template v-else-if="field.inputType === 'checkbox' && field.data">
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
            <template v-else-if="field.inputType === 'file'">
              <label class="spearly-form-file">
                <input
                  :name="field.identifier"
                  :required="field.required"
                  :accept="
                    field.data && field.data.allowedExtensions
                      ? field.data.allowedExtensions.map((extension) => `.${extension}`).join(',')
                      : ''
                  "
                  type="file"
                  @change="onChangeFile($event, field.identifier)"
                />
              </label>
            </template>

            <p v-if="field.description" :id="`${field.identifier}-description`" class="spearly-form-field-description">
              {{ field.description }}
            </p>

            <p
              v-if="getErrorMessage(field.identifier)"
              :id="`spearly-form-field-${field.identifier}-error`"
              role="alert"
              aria-live="assertive"
              class="spearly-form-field-error"
            >
              {{ getErrorMessage(field.identifier) }}
            </p>
          </fieldset>

          <input
            v-model="answers._spearly_gotcha"
            type="text"
            name="_spearly_gotcha"
            tabindex="-1"
            style="position: absolute; width: 1px; height: 1px; opacity: 0; overflow: hidden"
          />

          <p v-if="!isActive" class="spearly-form-outside">
            <span>このフォームは現在受付期間外です。</span>
          </p>

          <p v-if="validateErrors.length" class="spearly-form-error">
            <span>入力されていない項目があります。</span>
          </p>

          <button :disabled="!isActive" class="spearly-form-submit" @click="onClick">
            <span>{{ form.confirmationScreen.enabled ? form.confirmationScreen.submitButtonLabel : '送信' }}</span>
          </button>

          <button v-if="confirm" class="spearly-form-back" @click="confirm = false">
            <span>{{ form.confirmationScreen.backButtonLabel }}</span>
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
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from '@spearly/sdk-js'

export type Props = {
  id: string
  loading?: string
  noValidate: boolean
}

export type Data = {
  form: {
    createdAt: Date | null
  } & Omit<Form, 'createdAt'>
  answers: { [key: string]: string | string[]; _spearly_gotcha: string }
  files: { [key: string]: string }
  validateErrors: { identifier: string; message: string }[]
  error: boolean
  confirm: boolean
  submitted: boolean
  isLoaded: boolean
}

export default Vue.extend<
  Data,
  {
    setAnswersObj: () => void
    formattedDate: (date: Date) => string
    getErrorMessage: (identifier: string) => string
    validate: () => void
    submit: (fields: { [key: string]: unknown } & { _spearly_gotcha: string }) => Promise<void>
    onChangeFile: (event: Event, identifier: string) => void
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
    loading: { type: String },
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
        confirmationEmail: {
          enabled: false,
          name: '',
          description: '',
        },
        confirmationScreen: {
          enabled: false,
          backButtonLabel: '',
          submitButtonLabel: '',
        },
      },
      answers: {
        _spearly_gotcha: '',
      },
      files: {},
      validateErrors: [],
      error: false,
      confirm: false,
      submitted: false,
      isLoaded: false,
    }
  },
  async fetch() {
    const res = await this.$spearly.getFormLatest((this as any).id)
    console.log(res)
    this.form = res
    this.isLoaded = true
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
  beforeDestroy() {
    this.isLoaded = false
  },
  methods: {
    setAnswersObj() {
      if (this.$scopedSlots.default) return
      this.form.fields.forEach((field) => {
        this.answers[field.identifier] = field.inputType === 'checkbox' && field.data?.options?.length ? [] : ''
        if (field.inputType === 'file') {
          this.files[field.identifier] = ''
        }
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
    getErrorMessage(identifier) {
      return this.validateErrors.find((error) => error.identifier === identifier)?.message || ''
    },
    validate() {
      if ((this as any).noValidate) return

      this.validateErrors = []

      const requiredFields = this.form.fields.filter((field) => field.required).map((field) => field.identifier)
      const numberFields = this.form.fields
        .filter((field) => field.inputType === 'number')
        .map((field) => field.identifier)
      const emailFields = this.form.fields
        .filter((field) => field.inputType === 'email')
        .map((field) => field.identifier)
      const telFields = this.form.fields.filter((field) => field.inputType === 'tel').map((field) => field.identifier)
      const urlFields = this.form.fields.filter((field) => field.inputType === 'url').map((field) => field.identifier)

      requiredFields.forEach((identifier) => {
        if (Array.isArray(this.answers[identifier]) && !this.answers[identifier].length) {
          this.validateErrors.push({ identifier, message: '選択してください。' })
          return
        }

        if (!this.answers[identifier]) {
          this.validateErrors.push({ identifier, message: '入力してください。' })
        }
      })

      numberFields.forEach((identifier) => {
        if (this.answers[identifier] && !/^[\-\+0-9]+$/.test(this.answers[identifier] as string)) {
          this.validateErrors.push({ identifier, message: '数字を入力してください。' })
        }
      })

      emailFields.forEach((identifier) => {
        if (this.answers[identifier] && !/^[\w\-._]+@[\w\-._]+\.[A-Za-z]+$/.test(this.answers[identifier] as string)) {
          this.validateErrors.push({ identifier, message: 'メールアドレスの形式で入力してください。' })
        }
      })

      telFields.forEach((identifier) => {
        if (this.answers[identifier] && !/^[0-9\-]+$/.test(this.answers[identifier] as string)) {
          this.validateErrors.push({ identifier, message: '電話番号を入力してください。' })
        }
      })

      urlFields.forEach((identifier) => {
        if (
          this.answers[identifier] &&
          !/^https?:\/\/[\w!?/+\-_~;.,*&@#$%()'[\]]+?\..*?$/.test(this.answers[identifier] as string)
        ) {
          this.validateErrors.push({ identifier, message: 'URLを入力してください。' })
        }
      })
    },
    onChangeFile(event, identifier) {
      const fileReader = new FileReader()
      const files = (event.target as HTMLInputElement).files

      if (!files) return
      if (!files.length) {
        this.answers[identifier] = ''
        this.files[identifier] = ''
        return
      }

      fileReader.onload = () => {
        this.answers[identifier] = fileReader.result as string
        this.files[identifier] = files[0].name
      }

      fileReader.readAsDataURL(files[0])
    },
    onClick() {
      if (!this.confirm) {
        this.validate()
        if (this.validateErrors.length) return
        if (this.form.confirmationScreen.enabled) {
          this.confirm = true
          return
        }
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
