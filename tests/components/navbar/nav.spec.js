/** @typedef {import('../../../src/components').Nav} Nav */
import '../../../src/components/navbar'

describe('Nav', () => {
  it('can be instantiated', () => {
    const nav = /** @type {Nav} */(document.createElement('ark-nav'))
    expect(nav).toBeTruthy()

    var init = nav.init({})
    expect(nav === init).toBeTruthy()
  })

  it('can be rendered with content', function () {
    const nav = /** @type {Nav} */(document.createElement('ark-nav'))
    nav.innerHTML = /* HTML */`
      <span>mySpan</span>
    `
    nav.connectedCallback()
    const navElement = nav.querySelector('span')
    expect(navElement.textContent).toEqual('mySpan')
  })
})
