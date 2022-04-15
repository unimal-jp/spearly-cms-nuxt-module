import { SpearlyFormAnswer, ServerSpearlyFormAnswer } from '../../src/runtime/types'

export const spearlyFormAnswer: SpearlyFormAnswer = {
  formVersionId: 1,
  formPublicUid: 'form',
  data: {
    ipAddress: '192.168.0.0',
    userAgent: 'ua',
  },
  createdAt: new Date('2022-04-01T10:00:00.000+09:00'),
}

export const serverSpearlyFormAnswer: ServerSpearlyFormAnswer = {
  ...spearlyFormAnswer,
  createdAt: '2022-04-01T10:00:00.000+09:00',
}
