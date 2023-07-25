import { SpearlyFormFieldType } from './spearly-form-field-type'

export type SpearlyFormField = {
  data?: {
    options?: string[]
    allowedExtensions?: ('jpg' | 'png' | 'pdf')[]
  }
  description: string
  identifier: string
  inputType: SpearlyFormFieldType
  name: string
  order: number
  required: boolean
  validationRegex: string
}
