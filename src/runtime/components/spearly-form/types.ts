import { SpearlyForm } from '../../types'

export type SpearlyFormState = {
  form: { createdAt: Date | null } & Omit<SpearlyForm, 'createdAt'>
  answers: { [key: string]: string | string[]; _spearly_gotcha: string }
  files: { [key: string]: string }
  errors: Map<string, string>
  error: boolean
  validateError: boolean
  confirm: boolean
  submitted: boolean
  isLoaded: boolean
}
