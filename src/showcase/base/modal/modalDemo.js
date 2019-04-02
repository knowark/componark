export class modalDemo extends HTMLElement {
  init (context) {
    this.type = context['type'] || 'ark'
    return this
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.innerHTML = /* html */`
      <div mobile><p>mobile (360px).</p></div>
      <div tablet><p>tablet (768px).</p></div>
      <div desktop><p>desktop (960px).</p></div>
      ${this._setupContent()}
    `
    this._setupFrame('[mobile]', '360px')
    this._setupFrame('[tablet]', '768px')
    this._setupFrame('[desktop]', '960px')

    this._listen(this)
  }

  _setupFrame (selector, width) {
    const content = this._setupContent()
    const frame = document.createElement('iframe')
    frame.setAttribute('src', `/${this.type}.html`)
    frame.setAttribute('frameborder', '1')
    frame.setAttribute('width', width)
    frame.setAttribute('height', '640px')
    frame.onload = () => {
      const frameBody = frame.contentDocument.querySelector('body')
      const app = frameBody.querySelector('app-showcase-ark')
      const main = document.createElement('main')
      main.innerHTML = content

      this._listen(main)

      app.parentNode.removeChild(app)
      frameBody.prepend(main)
    }

    this.querySelector(selector).appendChild(frame)
  }

  _listen (main) {
    const open = main.querySelector('[btn-open]')
    open.addEventListener('click', _ => {
      main.querySelector('ark-modal').open()
    })

    const toggle = main.querySelector('[btn-toggle]')
    toggle.addEventListener('click', _ => {
      main.querySelector('ark-modal').toggle()
    })
  }

  _setupContent () {
    return /* html */`
      <div>
        <p>This is a modal.</p>
        <button btn-open>open</button>
        <button btn-toggle>toggle</button>
      </div>
      <ark-modal lg>
        <span slot="title">My title</span>
        <span slot="subtitle">My subtitle</span>

        <div>
          <p>Contenido Parrafo 1</p>
          <p>Contenido Parrafo 2</p>
          <p>Contenido Parrafo 3</p>
        </div>

        <div>
          <p>Contenido2 Parrafo 1</p>
          <p>Contenido2 Parrafo 2</p>
          <p>Contenido2 Parrafo 3</p>
        </div>

        <ark-button slot="action">Aceptar</ark-button>
        <ark-button slot="action" close>Cerrar</ark-button>
      </ark-modal>

      <!-- DOCUMENTATION -->

      <div>
        <h3>ark-button</h3>
        <small>Attributes:</small>
        <hr />
        <p>Size of a new modal window</p>
        <ul>
          <li>360px [default]</li>
          <li>lg => 960px</li>
        </ul>
      </div>
    `
  }
}
customElements.define('demo-modal', modalDemo)