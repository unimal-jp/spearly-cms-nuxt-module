import { mapSpearlyList } from '../../src/runtime/map'
import { spearlyList, serverSpearlyList } from '../mocks'

describe('mapSpearlyList', () => {
  it('Server spearly list data to client spearly list data.', () => {
    expect(mapSpearlyList(serverSpearlyList)).toEqual(spearlyList)
  })
})
