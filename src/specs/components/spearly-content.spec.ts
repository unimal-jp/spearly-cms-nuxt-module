import { shallowMount, Wrapper } from '@vue/test-utils'
import SpearlyContent from '../../components/spearly-content.vue'

describe('SpearlyContent', () => {
  let wrapper: Wrapper<SpearlyContent>

  beforeEach(() => {
    wrapper = shallowMount(SpearlyContent, {
      propsData: {
        id: 'CONTENT_ID',
      },
    })
  })

  describe('initialized', () => {
    it('snapshot', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
