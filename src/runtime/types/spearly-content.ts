import { SpearlyFieldTypeAll } from './spearly-field-type'

export type SpearlyContent = {
  attributes: {
    contentAlias: string
    patternName: 'a' | 'b'
    createdAt: Date
    fields: {
      data: SpearlyFieldTypeAll[]
    }
    nextContent: SpearlyContent | null
    previousContent: SpearlyContent | null
    publicUid: string
    publishedAt: Date
    updatedAt: Date
  }
  id: string
  type: 'content'
  values: {
    [key: string]: unknown
  }
}

export type ServerSpearlyContent = {
  attributes: {
    createdAt: string
    publishedAt: string
    updatedAt: string
  } & Omit<SpearlyContent['attributes'], 'createdAt' | 'publishedAt' | 'updatedAt'>
} & Omit<SpearlyContent, 'attributes'>
