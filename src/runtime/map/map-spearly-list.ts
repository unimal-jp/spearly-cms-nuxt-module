import { SpearlyList, ServerSpearlyList } from '../types'
import { mapSpearlyContent } from './map-spearly-content'

export const mapSpearlyList = (list: ServerSpearlyList): SpearlyList => {
  return {
    ...list,
    data: list.data.map((content) => mapSpearlyContent(content)),
  }
}
