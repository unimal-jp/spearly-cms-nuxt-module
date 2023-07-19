import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import Cookies from 'js-cookie'
import type { AnalyticsMetricRequest, AnalyticsPostParams } from '../types'

export const useSpearlyAnalytics = (domain = 'analytics.spearly.com') => {
  const distinctId = ref('')
  const sessionId = ref('')
  const baseURL = `https://${domain}`

  const pageView = async (params: AnalyticsPostParams) => {
    setDistinctId()
    setSessionId()

    await postMetric({
      name: 'impressions',
      contentId: params.contentId,
      patternName: params.patternName,
      value: 1,
      distinctId: distinctId.value,
      sessionId: sessionId.value,
      sessionIdExpiresIn: params.expires || 1800,
    })
  }

  const conversion = async (params: AnalyticsPostParams) => {
    setDistinctId()

    await postMetric({
      name: 'conversions',
      contentId: params.contentId,
      patternName: params.patternName,
      value: 1,
      distinctId: distinctId.value,
    })
  }

  const postMetric = async (data: AnalyticsMetricRequest) => {
    return await $fetch(`${baseURL}/metrics`, {
      method: 'POST',
      body: {
        metric: {
          name: data.name,
          properties: {
            resource_type: 'content',
            resource_id: data.contentId,
            pattern_name: data.patternName,
            value: data.value,
            distinct_id: data.distinctId,
            session_id: data.sessionId,
            session_id_expires_in: data.sessionIdExpiresIn,
          },
        },
      },
    })
  }

  const setDistinctId = () => {
    const id = getCookie('spearly_distinct_id') || uuidv4()
    const idExpires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).getTime()
    setCookie('spearly_distinct_id', id, idExpires)
    distinctId.value = id
    return id
  }

  const setSessionId = (expires = 1800) => {
    const id = getCookie('spearly_session_id') || uuidv4()
    const idExpires = new Date(Date.now() + expires * 1000).getTime()
    setCookie('spearly_session_id', id, idExpires)
    sessionId.value = id
    return id
  }

  const getCookie = (name: string) => {
    return Cookies.get(name)
  }

  const setCookie = (name: string, body: string, expires: number) => {
    Cookies.set(name, body, {
      expires,
      path: '/',
    })
  }

  setDistinctId()
  setSessionId()

  return {
    distinctId: computed(() => distinctId.value),
    sessionId: computed(() => sessionId.value),
    pageView,
    conversion,
  }
}
