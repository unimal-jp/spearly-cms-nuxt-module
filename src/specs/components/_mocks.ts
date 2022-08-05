import { List, Content, Form } from '@spearly/sdk-js'

export const createContentMock = (index = 0): Content => ({
  attributes: {
    publicUid: `content_${index}`,
    createdAt: new Date('2021-08-01'),
    updatedAt: new Date('2021-08-01'),
    publishedAt: new Date('2021-08-01'),
    nextContent: null,
    previousContent: null,
    contentAlias: `content_${index}`,
    fields: {
      data: [
        {
          attributes: {
            identifier: 'test',
            inputType: 'text',
            value: `text ${index}`,
          },
          id: '1',
          type: 'field',
        },
      ],
    },
  },
  id: '1',
  type: 'content',
  values: {
    test: `text ${index}`,
  },
})

export const createContentListMock = (length = 10): List => ({
  totalContentsCount: 100,
  matchingContentsCount: 90,
  limit: length,
  offset: 0,
  next: length,
  data: Array(length).map((_, i) => createContentMock(i)),
})

export const createFormMock = (startedAt: Date | null = null, endedAt: Date | null = null): Form => ({
  id: 1,
  publicUid: '1',
  identifier: 'form_1',
  name: 'Form Name',
  description: 'Form description.',
  thankYouMessage: 'Thank You Messaage.',
  fields: [
    {
      identifier: 'text',
      name: 'Text',
      description: 'Text description.',
      inputType: 'text',
      order: 0,
      required: true,
    },
    {
      identifier: 'number',
      name: 'Number',
      description: 'Number description.',
      inputType: 'number',
      order: 1,
      required: true,
    },
    {
      identifier: 'email',
      name: 'Email',
      description: 'Email description.',
      inputType: 'email',
      order: 2,
      required: true,
    },
    {
      identifier: 'tel',
      name: 'TEL',
      description: 'TEL description.',
      inputType: 'tel',
      order: 3,
      required: true,
    },
    {
      identifier: 'url',
      name: 'URL',
      description: 'URL description.',
      inputType: 'url',
      order: 4,
      required: true,
    },
    {
      identifier: 'textArea',
      name: 'Textarea',
      description: 'Textarea description.',
      inputType: 'text_area',
      order: 5,
      required: true,
    },
    {
      identifier: 'radio',
      name: 'Radio',
      description: 'Radio description.',
      inputType: 'radio',
      order: 6,
      required: false,
      data: {
        options: ['r1', 'r2'],
      },
    },
    {
      identifier: 'checkbox',
      name: 'Checkbox',
      description: 'Checkbox description.',
      inputType: 'checkbox',
      order: 7,
      required: false,
      data: {
        options: ['c1', 'c2', 'c3'],
      },
    },
  ],
  callbackUrl: '',
  startedAt: startedAt,
  endedAt: endedAt,
  createdAt: new Date('2021-08-01'),
})
