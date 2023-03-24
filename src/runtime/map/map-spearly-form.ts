import { SpearlyForm, ServerSpearlyForm } from '../types'

export const mapSpearlyForm = (form: ServerSpearlyForm): SpearlyForm => {
  const {
    confirmationEmailEnabled,
    confirmationEmailName,
    confirmationEmailDescription,
    confirmationScreenBeforeSubmitEnabled,
    backButtonLabel,
    submitButtonLabel,
    ...others
  } = form

  return {
    ...others,
    startedAt: form.startedAt ? new Date(form.startedAt) : null,
    endedAt: form.endedAt ? new Date(form.endedAt) : null,
    createdAt: new Date(form.createdAt),
    confirmationEmail: {
      enabled: confirmationEmailEnabled,
      name: confirmationEmailName,
      description: confirmationEmailDescription,
    },
    confirmationScreen: {
      enabled: confirmationScreenBeforeSubmitEnabled,
      backButtonLabel: backButtonLabel || '',
      submitButtonLabel: submitButtonLabel || '',
    },
  }
}
