import { mapSpearlyContent } from '../../src/runtime/map'
import { spearlyContent, serverSpearlyContent } from '../mocks'

describe('mapSpearlyContent', () => {
  it('Server spearly content data to client spearly content data.', () => {
    expect(mapSpearlyContent(serverSpearlyContent)).toEqual(spearlyContent)
  })
})
