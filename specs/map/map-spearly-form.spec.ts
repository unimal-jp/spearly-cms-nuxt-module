import { mapSpearlyForm } from '../../src/runtime/map'
import { spearlyForm, serverSpearlyForm } from '../mocks'

describe('mapSpearlyForm', () => {
  it('Server spearly form data to client spearly form data.', () => {
    expect(mapSpearlyForm(serverSpearlyForm)).toEqual(spearlyForm)
  })
})
