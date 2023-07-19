import type { AnalyticsMetricRequest } from './analytics-metric-request'

export type AnalyticsPostParams = {
  patternName: AnalyticsMetricRequest['patternName']
  contentId: AnalyticsMetricRequest['contentId']
  expires?: AnalyticsMetricRequest['sessionIdExpiresIn']
}
