import { SpearlyContent, ServerSpearlyContent } from '../../src/runtime/types'

export const spearlyContent: SpearlyContent = {
  attributes: {
    contentAlias: 'alias',
    createdAt: new Date('2022-02-01T20:01:00.000+09:00'),
    fields: {
      data: [
        {
          id: '1',
          type: 'field',
          attributes: {
            identifier: 'title',
            inputType: 'text',
            value: 'text',
          },
        },
        {
          id: '2',
          type: 'field',
          attributes: {
            identifier: 'date',
            inputType: 'calendar',
            value: new Date('2022-02-01T20:01:00.000+09:00'),
          },
        },
      ],
    },
    nextContent: null,
    previousContent: null,
    publicUid: 'content',
    publishedAt: new Date('2022-02-01T20:01:00.000+09:00'),
    updatedAt: new Date('2022-02-01T20:01:00.000+09:00'),
  },
  id: 'spearly-content',
  type: 'content',
  values: {
    title: 'text',
    date: new Date('2022-02-01T20:01:00.000+09:00'),
  },
}

export const serverSpearlyContent: ServerSpearlyContent = {
  attributes: {
    contentAlias: 'alias',
    createdAt: '2022-02-01T20:01:00.000+09:00',
    fields: {
      data: [
        {
          id: '1',
          type: 'field',
          attributes: {
            identifier: 'title',
            inputType: 'text',
            value: 'text',
          },
        },
        {
          id: '2',
          type: 'field',
          attributes: {
            identifier: 'date',
            inputType: 'calendar',
            value: '2022-02-01T20:01:00.000+09:00',
          },
        },
      ],
    },
    nextContent: null,
    previousContent: null,
    publicUid: 'content',
    publishedAt: '2022-02-01T20:01:00.000+09:00',
    updatedAt: '2022-02-01T20:01:00.000+09:00',
  },
  id: 'spearly-content',
  type: 'content',
  values: {
    title: 'text',
    date: '2022-02-01T20:01:00.000+09:00',
  },
}
