import { shallowMount, Wrapper, Slots } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import SpearlyForm from '../../components/spearly-form.vue'
import { createFormMock } from './_mocks'

type Props = {
  id: string
  noValidate: boolean
}

const defaultProps = { id: 'form', noValidate: false }

const filledAnswers = {
  _spearly_gotcha: '',
  text: 'text',
  number: '',
  email: '',
  tel: '',
  url: '',
  textArea: 'text',
  radio: '',
  checkbox: [],
}

const createWrapper = (
  slots: Slots = {},
  propsData: Props = defaultProps,
  successed = true,
  now = new Date().getTime()
): Wrapper<any> => {
  return shallowMount(SpearlyForm, {
    propsData,
    slots,
    computed: {
      now() {
        return now
      },
    },
    mocks: {
      $spearly: {
        postFormAnswers: jest.fn().mockReturnValue(successed ? Promise.resolve() : Promise.reject()),
      },
    },
  })
}

describe('SpearlyForm', () => {
  let wrapper: Wrapper<any>

  describe('Snapshot', () => {
    it('Basic', () => {
      wrapper = createWrapper()
      wrapper.setData({ form: createFormMock() })
      wrapper.vm.$nextTick(() => {
        expect(wrapper.element).toMatchSnapshot()
      })
    })

    it('A case using slot', () => {
      wrapper = createWrapper({
        default: {
          template: '<p>slot</p>',
        },
      })
      wrapper.setData({ form: createFormMock() })
      wrapper.vm.$nextTick(() => {
        expect(wrapper.element).toMatchSnapshot()
      })
    })
  })

  describe('Initialized', () => {
    it('Object for answer is provided.', () => {
      wrapper = createWrapper()
      wrapper.setData({ form: createFormMock() })
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$data.answers).toEqual({
          _spearly_gotcha: '',
          text: '',
          number: '',
          email: '',
          tel: '',
          url: '',
          textArea: '',
          radio: '',
          checkbox: [],
        })
      })
    })
  })

  describe('Setting the form period', () => {
    it('If startedAt or endedAt is set, display a message.', () => {
      wrapper = createWrapper()
      wrapper.setData({
        form: createFormMock(new Date('2021-08-01 10:00:00'), new Date('2021-08-31 23:00:00')),
      })
      wrapper.vm.$nextTick(() => {
        const messageEl = wrapper.find('.spearly-form-period')
        expect(messageEl).toBeTruthy()
        expect(messageEl.text()).toBe('このフォームの受付期間は2021/08/01 10:00〜2021/08/31 23:00です。')
      })
    })

    it("If it's outside the acceptance period, you won't be able to operate anything.", () => {
      wrapper = createWrapper(undefined, defaultProps, true, new Date('2021-07-01').getTime())
      wrapper.setData({
        form: createFormMock(new Date('2021-08-01 10:00:00'), new Date('2021-08-31 23:00:00')),
      })
      wrapper.vm.$nextTick(() => {
        expect(wrapper.find('input[type="text"]').attributes().disabled).toBe('disabled')
        expect(wrapper.find('.spearly-form-submit').attributes().disabled).toBe('disabled')
      })
    })

    it('It can be operated normally within the acceptance period.', () => {
      wrapper = createWrapper(undefined, defaultProps, true, new Date('2021-08-10').getTime())
      wrapper.setData({
        form: createFormMock(new Date('2021-08-01 10:00:00'), new Date('2021-08-31 23:00:00')),
      })
      wrapper.vm.$nextTick(() => {
        expect(wrapper.find('input[type="text"]').attributes().disabled).toBeUndefined()
        expect(wrapper.find('.spearly-form-submit').attributes().disabled).toBeUndefined()
      })
    })
  })

  describe('Processing the Send Button', () => {
    describe('form validation', () => {
      it('If required is set and there are unentered fields, make it an error.', () => {
        wrapper = createWrapper()
        wrapper.setData({ form: createFormMock() })
        wrapper.vm.$nextTick(() => {
          wrapper.find('.spearly-form-submit').trigger('click')
          wrapper.vm.$nextTick(() => {
            const errorEl = wrapper.find('.spearly-form-error')
            expect(errorEl.text()).toBe('入力されていない項目があります。')
          })
        })
      })
    })

    it('If there are no errors, display confirm.', () => {
      wrapper = createWrapper()
      wrapper.setData({ form: createFormMock() })
      wrapper.vm.$nextTick(() => {
        wrapper.setData({
          answers: filledAnswers,
        })
        wrapper.find('.spearly-form-submit').trigger('click')
        wrapper.vm.$nextTick(() => {
          expect(wrapper.find('.spearly-form-answer-confirm')).toBeTruthy()
        })
      })
    })

    it('If you click on confirm, the form will be submitted.', () => {
      wrapper = createWrapper()
      wrapper.setData({ form: createFormMock() })
      const submitMock = jest.spyOn(wrapper.vm, 'submit' as any)

      wrapper.vm.$nextTick(() => {
        wrapper.setData({
          answers: filledAnswers,
          confirm: true,
        })
        wrapper.find('.spearly-form-submit').trigger('click')
        expect(submitMock).toHaveBeenCalledWith(filledAnswers)
      })
    })
  })

  describe('Processing the Form submit', () => {
    describe('successed', () => {
      beforeEach(() => {
        wrapper = createWrapper(undefined, defaultProps, true)
        wrapper.setData({ form: createFormMock() })
      })

      it('Reset all answers', async () => {
        wrapper.setData({
          answers: filledAnswers,
          confirm: true,
        })
        wrapper.find('.spearly-form-submit').trigger('click')
        await flushPromises()
        expect((wrapper.vm as any).answers).toEqual({
          _spearly_gotcha: '',
          text: '',
          number: '',
          email: '',
          tel: '',
          url: '',
          textArea: '',
          radio: '',
          checkbox: [],
        })
      })

      it('Screen transition if callback is set.', async () => {
        global.window = Object.create(window)
        Object.defineProperty(window, 'location', {
          value: {
            href: '',
          },
        })

        wrapper.setData({
          form: Object.assign({}, createFormMock(), { callbackUrl: 'https://example.com' }),
          answers: filledAnswers,
          confirm: true,
        })
        wrapper.find('.spearly-form-submit').trigger('click')
        await flushPromises()
        expect(global.window.location.href).toBe('https://example.com')
      })

      it('Otherwise, display the default screen.', async () => {
        wrapper.setData({
          answers: filledAnswers,
          confirm: true,
        })
        wrapper.find('.spearly-form-submit').trigger('click')
        await flushPromises()
        expect(wrapper.find('.spearly-form-thanks')).toBeTruthy()
        expect(wrapper.find('.spearly-form-thanks-title').text()).toBe('Form Nameを送信しました。')
        expect(wrapper.find('.spearly-form-thanks-message').text()).toBe('Thank You Messaage.')
      })
    })

    describe('failed', () => {
      beforeEach(() => {
        wrapper = createWrapper(undefined, defaultProps, false)
        wrapper.setData({ form: createFormMock() })
      })

      it('Return to the input screen.', async () => {
        wrapper.setData({
          answers: filledAnswers,
          confirm: true,
        })
        wrapper.find('.spearly-form-submit').trigger('click')
        await flushPromises()
        wrapper.vm.$nextTick(() => {
          expect(wrapper.find('input[type="text"]')).toBeTruthy()
          expect((wrapper.vm as any).confirm).toBe(false)
        })
      })

      it('Display errors.', async () => {
        wrapper.setData({
          answers: filledAnswers,
          confirm: true,
        })
        wrapper.find('.spearly-form-submit').trigger('click')
        await flushPromises()
        expect(wrapper.find('.spearly-form-error')).toBeTruthy()
      })
    })
  })
})
