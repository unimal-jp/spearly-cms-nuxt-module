<template>
  <div>
    <template v-if="loading && !state.isLoaded">
      <component :is="loading" />
    </template>
    <template v-else>
      <slot v-bind="state.form" :submit="submit">
        <div v-if="!state.submitted" class="spearly-form">
          <h1 class="spearly-form-name">
            {{ state.form.name }}
          </h1>
          <p class="spearly-form-description">
            {{ state.form.description }}
          </p>

          <p v-if="state.form.startedAt || state.form.endedAt" class="spearly-form-period">
            <span>
              このフォームの受付期間は{{ formattedDate(state.form.startedAt) }}〜{{
                formattedDate(state.form.endedAt)
              }}です。
            </span>
          </p>

          <p v-if="state.error" class="spearly-form-error">
            <span>フォームを送信できませんでした。内容をご確認の上、再度お試しください。</span>
          </p>

          <fieldset v-for="field in state.form.fields" :key="field.identifier">
            <label :for="['radio', 'checkbox'].includes(field.inputType) ? null : field.identifier">
              {{ field.name }}
              <i v-if="field.required">*</i>
            </label>

            <template v-if="state.confirm">
              <p v-if="field.inputType !== 'file'" class="spearly-form-answer-confirm">
                {{
                  Array.isArray(state.answers[field.identifier])
                    ? (state.answers[field.identifier] as string[]).join(', ')
                    : state.answers[field.identifier]
                }}
              </p>
              <p v-else class="spearly-form-answer-confirm">
                {{ state.files[field.identifier] }}
              </p>
            </template>
            <template v-else-if="['text', 'number', 'email', 'tel', 'url'].includes(field.inputType)">
              <input
                :id="field.identifier"
                :value="state.answers[field.identifier]"
                :required="field.required"
                :disabled="!isActive"
                :aria-invalid="!!state.errors.get(field.identifier)"
                :aria-describedby="field.description ? `${field.identifier}-description` : null"
                :type="field.inputType"
                @input="onInput(field.identifier, $event)"
              />
            </template>
            <template v-else-if="field.inputType === 'text_area'">
              <textarea
                :id="field.identifier"
                v-model="state.answers[field.identifier]"
                :require="field.required"
                :disabled="!isActive"
                :aria-invalid="!!state.errors.get(field.identifier)"
                :aria-describedby="field.description ? `${field.identifier}-description` : null"
              />
            </template>
            <template v-else-if="field.inputType === 'radio'">
              <label v-for="(option, i) in field.data.options" :key="i" class="spearly-form-radio">
                <input
                  v-model="state.answers[field.identifier]"
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
                  v-model="(state.answers[field.identifier] as any[])"
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
                  :accept="field.data.allowedExtensions.map((extension) => `.${extension}`).join(',')"
                  type="file"
                  @change="onChangeFile($event, field.identifier)"
                />
              </label>
            </template>

            <p v-if="field.description" :id="`${field.identifier}-description`" class="spearly-form-field-description">
              {{ field.description }}
            </p>

            <p
              v-if="state.errors.get(field.identifier)"
              :id="`spearly-form-field-${field.identifier}-error`"
              role="alert"
              aria-live="assertive"
              class="spearly-form-field-error"
            >
              {{ state.errors.get(field.identifier) }}
            </p>
          </fieldset>

          <input
            v-model="state.answers._spearly_gotcha"
            type="text"
            name="_spearly_gotcha"
            tabindex="-1"
            style="position: absolute; width: 1px; height: 1px; opacity: 0; overflow: hidden"
          />

          <p v-if="!isActive" class="spearly-form-outside">
            <span>このフォームは現在受付期間外です。</span>
          </p>

          <p v-if="hasError" class="spearly-form-error">
            <span>入力されていない項目があります。</span>
          </p>

          <button :disabled="!isActive" class="spearly-form-submit" @click="onClick">
            <span>{{
              state.form.confirmationScreen.enabled ? state.form.confirmationScreen.submitButtonLabel : '送信'
            }}</span>
          </button>

          <button v-if="state.confirm" class="spearly-form-back" @click="state.confirm = false">
            <span>{{ state.form.confirmationScreen.backButtonLabel }}</span>
          </button>
        </div>
        <div v-else class="spearly-form-thanks">
          <h1 class="spearly-form-thanks-title">
            <span>{{ state.form.name }}を送信しました。</span>
          </h1>
          <p v-if="state.form.thankYouMessage" class="spearly-form-thanks-message">
            {{ state.form.thankYouMessage }}
          </p>
        </div>
      </slot>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, watch, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import { SpearlyFormState } from './types'

const nuxtApp = useNuxtApp()

const props = defineProps({
  id: { type: String, required: true },
  loading: { type: [String, Object] },
  noValidate: { type: Boolean },
})

const state = reactive<SpearlyFormState>({
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
    confirmationScreen: {
      enabled: false,
      backButtonLabel: '',
      submitButtonLabel: '',
    },
    confirmationEmail: {
      enabled: false,
      name: '',
      description: '',
    },
  },
  answers: {
    _spearly_gotcha: '',
    confirmation_email: '',
  },
  files: {},
  errors: new Map(),
  error: false,
  validateError: false,
  confirm: false,
  submitted: false,
  isLoaded: false,
})

watch(state.form.fields, () => {
  setAnswersObj()
})

const now = computed(() => new Date().getTime())
const identifiers = computed(() => state.form.fields.map((field) => field.identifier))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isActive = computed(() => {
  if (!state.form.startedAt && !state.form.endedAt) return true
  if (state.form.startedAt && state.form.startedAt.getTime() > now.value) return false
  if (state.form.endedAt && state.form.endedAt.getTime() < now.value) return false
  return true
})

const fetchFormLatest = async () => {
  try {
    const res = await nuxtApp.vueApp._context.provides.$spearly.getFormLatest(props.id)
    state.form = res

    if (
      res.confirmationEmail.enabled &&
      !state.form.fields.find((field) => field.identifier === 'confirmation_email')
    ) {
      state.form.fields.unshift({
        identifier: 'confirmation_email',
        name: res.confirmationEmail.name,
        inputType: 'email',
        description: res.confirmationEmail.description,
        order: 0,
        required: true,
        validationRegex: '',
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    state.isLoaded = true
  }
}

const setAnswersObj = () => {
  state.form.fields.forEach((field) => {
    state.answers[field.identifier] = field.inputType === 'checkbox' && field.data?.options.length ? [] : ''

    if (field.inputType === 'file') {
      state.files[field.identifier] = ''
    }
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formattedDate = (date: Date) => {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const mi = String(date.getMinutes()).padStart(2, '0')
  return `${y}/${m}/${d} ${h}:${mi}`
}

const validate = () => {
  state.errors.clear()

  const requiredFields = state.form.fields.filter((field) => field.required).map((field) => field.identifier)
  const numberFields = state.form.fields
    .filter((field) => field.inputType === 'number')
    .map((field) => field.identifier)
  const emailFields = state.form.fields.filter((field) => field.inputType === 'email').map((field) => field.identifier)
  const telFields = state.form.fields.filter((field) => field.inputType === 'tel').map((field) => field.identifier)
  const urlFields = state.form.fields.filter((field) => field.inputType === 'url').map((field) => field.identifier)

  requiredFields.forEach((identifier) => {
    if (Array.isArray(state.answers[identifier]) && !state.answers.length) {
      state.errors.set(identifier, '選択してください。')
      return
    }
    if (!state.answers[identifier]) {
      state.errors.set(identifier, '入力してください。')
    }
  })

  numberFields.forEach((identifier) => {
    if (state.answers[identifier] && !/^[\-\+0-9]+$/.test(state.answers[identifier] as string)) {
      state.errors.set(identifier, '数字を入力してください。')
    }
  })

  emailFields.forEach((identifier) => {
    if (state.answers[identifier] && !/^[\w\-._]+@[\w\-._]+\.[A-Za-z]+$/.test(state.answers[identifier] as string)) {
      state.errors.set(identifier, 'メールアドレスの形式で入力してください。')
    }
  })

  telFields.forEach((identifier) => {
    const field = state.form.fields.find((field) => field.identifier === identifier)
    if (!field.validationRegex) return

    const regex = new RegExp(field.validationRegex)

    if (state.answers[identifier] && !regex.test(state.answers[identifier] as string)) {
      const format = field.validationRegex === '^[+]?\\d+$' ? 'ハイフンなし' : '半角数字とハイフン'
      state.errors.set(identifier, `電話番号（${format}）を入力してください。`)
    }
  })

  urlFields.forEach((identifier) => {
    if (
      state.answers[identifier] &&
      !/^https?:\/\/[\w!?/+\-_~;.,*&@#$%()'[\]]+?\..*?$/.test(state.answers[identifier] as string)
    ) {
      state.errors.set(identifier, 'URLを入力してください。')
    }
  })
}

const hasError = computed(() => {
  return !!state.errors.size
})

const submit = async (fields: { [key: string]: unknown } & { _spearly_gotcha: string }) => {
  try {
    await nuxtApp.vueApp._context.provides.$spearly.postFormAnswers(state.form.id, fields)

    identifiers.value.forEach((identifier) => {
      state.answers[identifier] =
        state.form.fields.find((field) => field.identifier === identifier)?.inputType === 'checkbox' ? [] : ''
    })

    if (typeof location !== 'undefined' && state.form.callbackUrl) {
      location.href = state.form.callbackUrl
    } else {
      state.submitted = true
    }
  } catch {
    state.error = true
    state.confirm = false
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onClick = () => {
  if (!state.confirm) {
    validate()
    if (hasError.value) return

    if (state.form.confirmationScreen.enabled) {
      state.confirm = true
      return
    }
  }
  submit(state.answers)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onInput = (identifier: string, event: Event) => {
  if (!event.target || !(event.target instanceof HTMLInputElement)) return
  state.answers[identifier] = event.target.value
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onChangeFile = (event: Event, identifier: string) => {
  const fileReader = new FileReader()
  const files = (event.target as HTMLInputElement).files

  if (!files) return
  if (!files.length) {
    state.answers[identifier] = ''
    state.files[identifier] = ''
    return
  }

  fileReader.onload = () => {
    state.answers[identifier] = fileReader.result as string
    state.files[identifier] = files[0].name
  }

  fileReader.readAsDataURL(files[0])
}

onMounted(() => {
  setAnswersObj()
})

await fetchFormLatest()
</script>
