import { mapSpearlyFormAnswer } from '../../src/runtime/map'
import { spearlyFormAnswer, serverSpearlyFormAnswer } from '../mocks'

describe('mapSpearlyFormAnswer', () => {
  it('Server spearly form answer to client spearly form answer.', () => {
    expect(mapSpearlyFormAnswer(serverSpearlyFormAnswer)).toEqual(spearlyFormAnswer)
  })
})
