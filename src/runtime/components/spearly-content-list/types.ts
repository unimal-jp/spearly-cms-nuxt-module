import { SpearlyContent } from '../../types'

export type SpearlyContentListState = {
  contents: SpearlyContent[]
  isLoaded: boolean
  next: number
  matchingContentsCount: number
  totalContentsCount: number
}
