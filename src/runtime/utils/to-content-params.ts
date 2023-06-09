import type { SpearlyGetContentParams } from '../types'

export const toContentParams = (params: SpearlyGetContentParams) => {
  let queries = '?'

  if (params.distinctId) {
    queries += `distinct_id=${params.distinctId}&`
  }

  if (params.patternName) {
    queries += `pattern_name=${params.patternName}&`
  }

  return queries.slice(0, -1)
}
