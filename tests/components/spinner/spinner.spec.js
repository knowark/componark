import { Spinner } from '../../../src/components/spinner'

describe('Spinner', () => {
  let container = null

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    container = null
  })

  it('can be instantiated', () => {
    container.innerHTML = /* html */ `
      <ark-spinner></ark-spinner>
    `
    const spinner = container.querySelector('ark-spinner')

    expect(spinner).toBeTruthy
    expect(spinner).toBe(spinner.init())
  })

  it('Different types of spinner can be used', () => {
    container.innerHTML = /* html */ `
      <ark-spinner type="chase"></ark-spinner>
      <ark-spinner type="rect"></ark-spinner>
      <ark-spinner type="loader"></ark-spinner>
      <ark-spinner type="bounce"></ark-spinner>
    `
    const spinner = container.querySelector('ark-spinner')
    const loader = spinner.loader

    expect(spinner.loader).toBeCalled
  })
})
