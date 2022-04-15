import { bindQueriesFromParams } from '../../src/runtime/utils'
import { SpearlyGetParams } from '../../src/runtime/types'

describe('bindQueriesFromParams', () => {
  it('Convert object to URL Queries', () => {
    const obj: SpearlyGetParams = {
      limit: 50,
      offset: 50,
      order: 'asc',
    }
    expect(bindQueriesFromParams(obj)).toBe('?limit=50&offset=50&order=asc')
  })
})
