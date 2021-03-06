 import { Component } from 'base/component'

class MockComponent extends Component {
  init(context = {}) {
    this.context = context
    this.data = {}
    this.dependency = undefined
    return super.init()
  }

  reflectedProperties() { return ['code'] }

  erroringHandler (event) {
    throw new Error('Something went wrong!')
  }

  async asyncErroringHandler (event) {
    const callback = async () => { 
      throw new Error('Something went async wrong!') }
    await callback()
  }

  render() {
    this.dependency = this.resolve('Dependency')
    return super.render()
  }
}
Component.define('mock-component', MockComponent)


describe('Component', () => {
  let container = null
  let component = null
  beforeEach(() => {
    container = document.createElement('div')
    container.innerHTML = `<mock-component code="XYZ123"></mock-component>`
    component = container.querySelector('mock-component')
    document.body.append(container)
  })

  afterEach(() => {
    container.remove()
    container = null
    component = null
  })

  it('can be instantiated', () => {
    expect(component).toBeTruthy()
  })

  it('has an stable public api', () => {
    expect(typeof component.constructor.define).toEqual('function')
    expect(typeof component.init).toEqual('function')
    expect(typeof component.reflectedProperties).toEqual('function')
    expect(typeof component.connectedCallback).toEqual('function')
    expect(typeof component.render).toEqual('function')
    expect(typeof component.load).toEqual('function')
    expect(typeof component.select).toEqual('function')
    expect(typeof component.selectAll).toEqual('function')
    expect(typeof component.emit).toEqual('function')
    expect(typeof component.content).toBeDefined()
  })

  it('has an init method through which state is set', () => {
    const response = component.init({attribute: 'value'})
    expect(response).toBe(component)
  })

  it('can set its content via a property', () => {
    component.content = `<p>Hello World</p>`
    const paragraph = component.querySelector('p')
    expect(component.content).toBe(`<p>Hello World</p>`)
    expect(paragraph.outerHTML).toBe(`<p>Hello World</p>`)
  })

  it('can have some of its attributes reflected as properties', () => {
    expect(component.code).toBe('XYZ123')
  })

  it('sets its tag name as class when rendered', () => {
    component.render()
    expect(component.className).toEqual('mock-component')
  })

  it('emits custom events', () => {
    let detail = null
    const handler = (event) => {detail = event.detail}
    component.addEventListener('fire', handler)

    component.emit('fire', {location: 'indoors'})

    expect(detail).toEqual({location: 'indoors'})
  })

  it('updates the component when connected', () => {
    const spy = jest.spyOn(component, 'update')

    component.connectedCallback()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('calls render and load on update', async () => {
    const renderSpy = jest.spyOn(component, 'render')
    const loadSpy = jest.spyOn(component, 'load')

    await component.update()

    expect(renderSpy).toHaveBeenCalledTimes(1)
    expect(loadSpy).toHaveBeenCalledTimes(1)
  })

  it('catches and re-raises update errors', async () => {
    expect.assertions(1)
    const renderSpy = jest.spyOn(component, 'render')
    const loadSpy = jest.spyOn(component, 'load')

    const consoleError = console.error;
    console.error = jest.fn();

    component.load = async () => { throw new Error('Load Error!') }

    try {
      await component.update()
    } catch (error) {
      expect(error.message).toEqual('Load Error!')
    }

    console.error = consoleError
  })

  it('selects the children matching a selector', () => {
    container.innerHTML = `
    <mock-component>
      <div class="blue"></div>
      <div class="red"></div>
      <div class="red"></div>
    </mock-component>
    `
    const component = container.querySelector('mock-component')

    const blue = component.select('.blue')
    expect(blue.tagName).toEqual('DIV')

    const red = component.selectAll('.red')
    expect(red.length).toEqual(2)
  })

  it('retrieves its slots through the slots method', () => {
    container.innerHTML = `
    <mock-component>
      <div slot="header" class="header"></div>
      <div class="body"></div>
      <div class="aside"></div>
      <div slot="footer" class="footer"></div>
    </mock-component>
    `
    const component = container.querySelector('mock-component')

    expect(component.slots()).toEqual({
      header: [component.select('.header')],
      general: [component.select('.body'), component.select('.aside')],
      footer: [component.select('.footer')]
    })
  })
  
  it('binds its properties to children events', async () => {
    container.innerHTML = `
    <mock-component>
      <input type="text" listen on-input="{{ data.value = data }}"></input>
    </mock-component>
    `

    const component = container.querySelector('mock-component')
    const input = component.select('input')


    input.dispatchEvent(new InputEvent('input',  {bubbles: true, data: 'E'}))

    expect(component.data.value).toEqual('E')
  })

  it('binds to the detail.value event property by default', async () => {
    container.innerHTML = `
    <mock-component>
      <input type="text" listen on-alter="{{ data.value }}"></input>
    </mock-component>
    `

    const component = container.querySelector('mock-component')
    const input = component.select('input')

    input.dispatchEvent(
      new CustomEvent('alter',  {bubbles: true, detail: 'A'}))

    expect(component.data.value).toEqual('A')
  })

  it('emits an error event on declared listeners', async () => {
    container.innerHTML = `
    <mock-component>
      <input type="text" listen on-alter="erroringHandler"></input>
    </mock-component>
    `

    const component = container.querySelector('mock-component')

    let errorEvent = {}
    component.addEventListener('error', (event) => errorEvent = event)

    const input = component.select('input')

    input.dispatchEvent(
      new CustomEvent('alter',  { bubbles: true, detail: 'I will error!' }))

    expect(errorEvent.detail.message).toEqual('Something went wrong!')
  })

  it('emits an error event on declared async listeners', async () => {
    container.innerHTML = `
    <mock-component>
      <input type="text" listen on-alter="asyncErroringHandler"></input>
    </mock-component>
    `

    const component = container.querySelector('mock-component')

    let errorEvent = {}
    component.addEventListener('error', (event) => errorEvent = event)

    const input = component.select('input')

    input.dispatchEvent(
      new CustomEvent('alter',  { bubbles: true, detail: 'I will error!' }))

    // Sleep
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(errorEvent.detail.message).toEqual('Something went async wrong!')
  })

  it('updates with a given initialization context', async () => {
    container.innerHTML = `
    <mock-component></mock-component>
    `
    const component = container.querySelector('mock-component')

    const context = {data: 'context'}

    await component.update(context)

    expect(component.context).toBe(context)
  })

  it('resolves its resource dependencies using events propagation', () => {
    document.addEventListener('resolve', (event) => {
      const resource = event.detail.resource
      event.detail[resource] = 'RESOLVED_DEPENDENCY'
    })
    container.innerHTML = `
    <mock-component></mock-component>
    `
    const component = container.querySelector('mock-component')

    expect(component.dependency).toEqual('RESOLVED_DEPENDENCY')
  })
})
