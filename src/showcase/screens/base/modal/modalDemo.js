import { Component } from 'base/component'

export class ModalDemo extends Component {
  init (context) {
    return super.init(context)
  }

  render () {
    this.content = /* html */ `${this.styles}
      <div>
        <h1>This is a modal.</h1>
        <ark-button btn-open>open</ark-button>
        <ark-button btn-toggle>toggle</ark-button>
      </div>

      <ark-modal title="My Title" subtitle="My Subtitle"
        horizontal="center" vertical="center"
        width="80vw" height="40vh">

        <div style="margin: 1rem;">
          <div>
            <p>Contenido Párrafo A-1</p>
            <p>Contenido Párrafo A-2</p>
            <p>Contenido Párrafo A-3</p>
          </div>

          <div>
            <p>Contenido Párrafo A-4</p>
            <p>Contenido Párrafo A-5</p>
            <p>Contenido Párrafo A-6</p>
          </div>

          <div>
            <p>Contenido Párrafo A-7</p>
            <p>Contenido Párrafo A-8</p>
            <p>Contenido Párrafo A-9</p>
          </div>

          <div>
            <p>Contenido Párrafo B-1</p>
            <p>Contenido Párrafo B-2</p>
            <p>Contenido Párrafo B-3</p>
          </div>

          <div>
            <p>Contenido Párrafo B-4</p>
            <p>Contenido Párrafo B-5</p>
            <p>Contenido Párrafo B-6</p>
          </div>

          <div>
            <p>Contenido Párrafo B-7</p>
            <p>Contenido Párrafo B-8</p>
            <p>Contenido Párrafo B-9</p>
          </div>

          <div>
            <p>Contenido Párrafo C-1</p>
            <p>Contenido Párrafo C-2</p>
            <p>Contenido Párrafo C-3</p>
          </div>

          <div>
            <p>Contenido Párrafo C-4</p>
            <p>Contenido Párrafo C-5</p>
            <p>Contenido Párrafo C-6</p>
          </div>

          <div>
            <p>Contenido Párrafo C-7</p>
            <p>Contenido Párrafo C-8</p>
            <p>Contenido Párrafo C-9</p>
          </div>
        </div>

        <ark-button slot="action">Aceptar</ark-button>
        <ark-button slot="action" close>Cerrar</ark-button>
      </ark-modal>

      <!-- DOCUMENTATION -->

      <div>
        <!--<h3>ark-button</h3>-->
        <hr />
        <h3>Attributes:</h3>
        <p>Modal show: </p>
          <ul>
            <li>onHiddenModal:<span data-hidden> hidden: false</span></li>
          </ul>

        <p>Size of a new modal window:</p>
        <ul>
          <li>360px [default]</li>
          <li>lg => 960px</li>
        </ul>
      </div>
    `

    return super.render()
  }

  load () {
    this.addEventListener('onHiddenModal',
      (/** @type {CustomEvent} */ event) => {
        event.stopImmediatePropagation()
        this.select('[data-hidden]').innerHTML = /* html */`
        hidden: ${event.detail.hidden}
      `
      })

    const open = this.querySelector('[btn-open]')
    open.addEventListener('click', _ => this.modal['open']())

    const toggle = this.querySelector('[btn-toggle]')
    toggle.addEventListener('click', _ => this.modal['toggle']())

    return super.load()
  }

  get modal () {
    return this.select('ark-modal')
  }

  get styles () {
    return /* html */ `
      <style>
        demo-modal ark-modal p{
          margin: 0;
        }
        ark-button[btn-open]{
          background:var(--primary);
          color:var(--light);
        }
        ark-button[btn-toggle]{
          background:var(--secondary);
          color:var(--primary);
        }
      </style>
    `
  }
}
Component.define('demo-modal', ModalDemo)
