import { useSpearlyAnalytics } from './use-spearly-analytics'
import { mapSpearlyContent, mapSpearlyForm, mapSpearlyFormAnswer, mapSpearlyList } from '../map'
import { toListParams, toContentParams, recursiveToCamels } from '../utils'
import type {
  ServerSpearlyContent,
  ServerSpearlyForm,
  ServerSpearlyFormAnswer,
  ServerSpearlyList,
  SpearlyContent,
  SpearlyForm,
  SpearlyFormAnswer,
  SpearlyGetParams,
  SpearlyGetContentParams,
  SpearlyList,
} from '../types'

export type UseSpearlyCMS = {
  getSpearlyList: (contentTypeId: string, params: SpearlyGetParams) => Promise<SpearlyList>
  getSpearlyContent: (contentTypeId: string, contentId: string) => Promise<SpearlyContent>
  getContentPreview: (contentTypeId: string, contentId: string, previewToken: string) => Promise<SpearlyContent>
  getFormLatest: (publicUid: string) => Promise<SpearlyForm>
  postFormAnswers: (
    formVersionId: number,
    fields: { [key: string]: unknown } & { _spearly_gotcha: string }
  ) => Promise<SpearlyFormAnswer>
}

export const useSpearlyCMS = (apiKey: string): UseSpearlyCMS => {
  const baseURL = 'https://api.spearly.com'
  const baseHeaders = {
    Accept: 'application/vnd.spearly.v2+json',
    Authorization: `Bearer ${apiKey}`,
  }

  const { distinctId } = useSpearlyAnalytics()

  const getRequest = async <T>(endpoint: string, queries = ''): Promise<T> => {
    try {
      const response = await $fetch<T>(`${baseURL}${endpoint}${queries}`, {
        headers: baseHeaders,
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return recursiveToCamels(response as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.data) throw error.data
      return Promise.reject(new Error(error))
    }
  }

  const postRequest = async <T>(endpoint: string, params: { [key: string]: unknown }): Promise<T> => {
    try {
      const response = await $fetch<T>(`${baseURL}${endpoint}`, {
        method: 'POST',
        body: params,
        headers: { ...baseHeaders, 'Content-Type': 'application/json' },
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return recursiveToCamels(response as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.data) throw error.data
      return Promise.reject(new Error(error))
    }
  }

  const getSpearlyList = async (contentTypeId: string, params: SpearlyGetParams = {}) => {
    params.distinctId = params.distinctId || distinctId.value
    const queries = toListParams(params)
    const response = await getRequest<ServerSpearlyList>(`/content_types/${contentTypeId}/contents`, queries)
    return mapSpearlyList(response)
  }

  const getSpearlyContent = async (contentTypeId: string, contentId: string, params: SpearlyGetContentParams = {}) => {
    params.distinctId = params.distinctId || distinctId.value
    const queries = toContentParams(params)
    const response = await getRequest<{ data: ServerSpearlyContent }>(
      `/content_types/${contentTypeId}/contents/${contentId}`,
      queries
    )
    return mapSpearlyContent(response.data)
  }

  const getContentPreview = async (contentTypeId: string, contentId: string, previewToken: string) => {
    const response = await getRequest<{ data: ServerSpearlyContent }>(
      `/content_types/${contentTypeId}/contents/${contentId}`,
      `?preview_token=${previewToken}`
    )
    return mapSpearlyContent(response.data)
  }

  const getFormLatest = async (publicUid: string) => {
    const response = await getRequest<{ form: ServerSpearlyForm }>(`/forms/${publicUid}/latest`)
    return mapSpearlyForm(response.form)
  }

  const postFormAnswers = async (
    formVersionId: number,
    fields: { [key: string]: unknown } & { _spearly_gotcha: string }
  ) => {
    if (!('_spearly_gotcha' in fields)) throw new Error('Include "_spearly_gotcha" in the fields.')
    const { _spearly_gotcha, confirmation_email, ...paramFields } = fields

    const response = await postRequest<{ answer: ServerSpearlyFormAnswer }>('/form_answers', {
      form_version_id: formVersionId,
      fields: paramFields,
      _spearly_gotcha,
      confirmation_email,
    })

    return mapSpearlyFormAnswer(response.answer)
  }

  return {
    getSpearlyList,
    getSpearlyContent,
    getContentPreview,
    getFormLatest,
    postFormAnswers,
  }
}
