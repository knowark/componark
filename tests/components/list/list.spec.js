import '../../../src/components/list'

describe('List', () => {
  it('can be instantiated', () => {
    const list = document.createElement('ark-list')
    expect(list).toBeTruthy()
  })

  it('can be rendered without content', () => {
    const list = document.createElement('ark-list')
    list.connectedCallback()
    expect(list).toBeTruthy()
  })
})