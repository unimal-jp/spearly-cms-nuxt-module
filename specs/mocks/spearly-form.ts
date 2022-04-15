import { SpearlyForm, ServerSpearlyForm } from '../../src/runtime/types'

export const spearlyForm: SpearlyForm = {
  callbackUrl: '/',
  createdAt: new Date('2022-01-31T20:01:00.000+09:00'),
  description: 'Form description.',
  endedAt: new Date('2022-05-31T20:01:00.000+09:00'),
  fields: [
    {
      description: 'Field description.',
      identifier: 'field-1',
      inputType: 'text',
      name: 'Field 1',
      order: 0,
      required: true,
    },
    {
      data: {
        options: ['item1', 'item2'],
      },
      description: 'Field description 2.',
      identifier: 'field-2',
      inputType: 'checkbox',
      name: 'Field 2',
      order: 1,
      required: false,
    },
  ],
  id: 1,
  identifier: 'contact',
  name: 'Contact Form',
  publicUid: 'uid',
  startedAt: new Date('2022-03-01T00:00:00.000+09:00'),
  thankYouMessage: 'Thank you.',
}

export const serverSpearlyForm: ServerSpearlyForm = {
  ...spearlyForm,
  createdAt: '2022-01-31T20:01:00.000+09:00',
  endedAt: '2022-05-31T20:01:00.000+09:00',
  startedAt: '2022-03-01T00:00:00.000+09:00',
}
