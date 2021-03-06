import { Component } from 'base/component'
import { uuid } from 'base/utils'

export class SignatureDemo extends Component {
  init (context) {
    return super.init(context)
  }

  render () {
    this.innerHTML = /* html */ `${this.styles}
      <div class="signature-container">
        <ark-signature listen on-signature:dirty="_onDirty"
           width="300px" height="300px">
        </ark-signature>
      </div>
      <div>
        <ark-button background="primary" listen on-click="_onSave">
          Guardar
        </ark-button>
        <ark-button background="primary" listen on-click="_onClear">
          Borra
        </ark-button>
        <ark-button background="primary" listen on-click="_onShowImage">
          Mostrar imagen
        </ark-button>
        <img data-img/>
        <hr/>
        <p>Dirty: <strong data-dirty></strong></p>
      </div>
    `
    return super.render()
  }

  load () {
    this.dirty.innerText = String(this.signature['dirty'])
    return super.load()
  }

  /** @param {CustomEvent} event */
  _onDirty (event) {
    event.stopImmediatePropagation()
    this.dirty.innerText = String(this.signature['dirty'])
  }

  _onShowImage () {
    this.img.src = this.signature['dataURL'](300, 300)
  }

  _onSave () {
    const src = this.signature['dataURL']()
    const fileName = uuid()
    const link = document.createElement('a')
    link.download = fileName + '.jpg'
    link.href = src
    link.click()
  }

  _onClear () {
    this.signature['clear']()
  }

  get signature () {
    return this.select('ark-signature')
  }

  /** @returns {HTMLElement} */
  get dirty () {
    return /** @type {HTMLElement} */ (this.querySelector('[data-dirty]'))
  }

  /** @returns {HTMLImageElement} */
  get img () {
    return /** @type {HTMLImageElement} */ (this.querySelector('[data-img]'))
  }

  get styles () {
    return /* html */ `
      <style>
        .signature-container{
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          flex-direction: column;
        }

        .signature-container ark-signature{
          border: 1px solid;
        }
      </style>
    `
  }
}
Component.define('demo-signature', SignatureDemo)
