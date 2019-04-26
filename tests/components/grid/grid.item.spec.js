import '../../../src/components/grid'

describe('Icon', () => {
  it('can be instantiated', () => {
    const grid = document.createElement('ark-grid-item')
    expect(grid).toBeTruthy()

    var init = grid.init()
    expect(grid === init).toBeTruthy()
  })

  it('can be rendered without content', function () {
    const grid = document.createElement('ark-grid-item')
    grid.connectedCallback()
  })
})
