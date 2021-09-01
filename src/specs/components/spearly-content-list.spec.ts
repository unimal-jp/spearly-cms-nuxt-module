import { shallowMount, Wrapper } from '@vue/test-utils'
import SpearlyContentList from '../../components/spearly-content-list.vue'

describe('SpearlyContentList', () => {
  let wrapper: Wrapper<SpearlyContentList>

  beforeEach(() => {
    wrapper = shallowMount(SpearlyContentList, {
      propsData: { id: 'CONTENT_TYPE_ID' },
    })
  })

  describe('initialized', () => {
    it('snapshot', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
