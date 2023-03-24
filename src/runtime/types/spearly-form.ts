import { SpearlyFormField } from './spearly-form-field'

export type SpearlyForm = {
  callbackUrl: string
  createdAt: Date
  description: string
  endedAt: Date | null
  fields: SpearlyFormField[]
  id: number
  identifier: string
  name: string
  publicUid: string
  startedAt: Date | null
  thankYouMessage: string
  confirmationEmail: {
    enabled: boolean
    name: string
    description: string
  }
  confirmationScreen: {
    enabled: boolean
    backButtonLabel: string
    submitButtonLabel: string
  }
}

export type ServerSpearlyForm = {
  startedAt: string | null
  endedAt: string | null
  createdAt: string
  confirmationEmailEnabled: boolean
  confirmationEmailName: string
  confirmationEmailDescription: string
  confirmationScreenBeforeSubmitEnabled: boolean
  backButtonLabel: string | null
  submitButtonLabel: string | null
} & Omit<SpearlyForm, 'startedAt' | 'endedAt' | 'createdAt' | 'confirmationEmail' | 'confirmationScreen'>
