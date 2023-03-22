import { SpearlyList, ServerSpearlyList } from '../../src/runtime/types'
import { spearlyContent, serverSpearlyContent } from './spearly-content'

export const spearlyList: SpearlyList = {
  data: [spearlyContent],
  limit: 10,
  offset: 10,
  totalContentsCount: 100,
  matchingContentsCount: 30,
  next: 11,
}

export const serverSpearlyList: ServerSpearlyList = {
  data: [serverSpearlyContent],
  limit: 10,
  offset: 10,
  totalContentsCount: 100,
  matchingContentsCount: 30,
  next: 11,
}
