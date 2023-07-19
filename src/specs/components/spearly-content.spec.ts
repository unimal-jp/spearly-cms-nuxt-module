import { shallowMount, Wrapper } from '@vue/test-utils'
import SpearlyContent from '../../components/spearly-content.vue'

describe('SpearlyContent', () => {
  let wrapper: Wrapper<SpearlyContent>
  let pageViewMock: jest.Mock

  beforeEach(() => {
    pageViewMock = jest.fn()
    wrapper = shallowMount(SpearlyContent, {
      propsData: {
        id: 'CONTENT_ID',
      },
      mocks: {
        $spearlyAnalytics: {
          pageView: pageViewMock,
        },
      },
    })
  })

  describe('initialized', () => {
    it('snapshot', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('analytics', () => {
    it('send a pageView', () => {
      expect(pageViewMock).toHaveBeenCalledWith({
        contentId: 'CONTENT_ID',
        patternName: 'a',
      })
    })
  })
})
