import { Component } from '../../component'
import { getSlots } from '../../../utils'

export class Modal extends Component {
  init (context = {}) {
    this.title = context.title
    this.subtitle = context.subtitle

    // local variables
    this.slots = this.slots || getSlots(this)
    this.width = this.width || ''
    this.height = this.height || ''

    return super.init()
  }

  reflectedProperties () {
    return ['title', 'subtitle', 'width', 'height']
  }

  render () {
    this.innerHTML = /* html */ `
      <div class="ark-modal__content" ${this._getContentStyle()}>
        <div class="ark-modal__header">
          ${this._renderHeader()}
        </div>
        <div class="ark-modal__body" data-body></div>
        <div class="ark-modal__actions" data-actions></div>
      </div>

      <div data-scrim class="ark-modal__scrim"></div>
    `

    this._appendSlots()
    return super.render()
  }

  load () {
    if (!this._isBlockedScrim()) {
      this.scrim.addEventListener('click', _ => this.close())
    }

    this.querySelectorAll('[close]').forEach(
      button => button.addEventListener('click', _ => this.close())
    )
  }

  open () {
    this.setAttribute('show', '')
    this._onHiddenEvent()
  }

  close () {
    this.removeAttribute('show')
    this._onHiddenEvent()
  }

  toggle () {
    this.hasAttribute('show') ? this.close() : this.open()
  }

  /** @return {HTMLDivElement} */
  get scrim () {
    return this.querySelector('[data-scrim]')
  }

  _getContentStyle () {
    const width = this.width ? `width: ${this.width};` : ''
    const height = this.height ? `height: ${this.height};` : ''

    return `
      style="${width} ${height}"
    `
  }

  _appendSlots () {
    if (!Object.keys(this.slots || {}).length) return

    const general = this.slots.general || []
    const action = this.slots.action || []

    general.forEach(
      slot => this.querySelector('[data-body]').appendChild(slot)
    )

    action.forEach(
      slot => this.querySelector('[data-actions]').appendChild(slot)
    )
  }

  _renderHeader () {
    let header = ''

    if (this.title.length) {
      header += /* html */`
        <strong class="ark-card__title">${this.title}</strong>
      `
    }

    if (this.subtitle.length) {
      header += /* html */`
        <span class="ark-card__subtitle">${this.subtitle}</span>
      `
    }

    return header
  }

  _onHiddenEvent () {
    this.dispatchEvent(new CustomEvent('onHiddenModal', {
      bubbles: true,
      detail: {
        hidden: !this.hasAttribute('show')
      }
    }))
  }

  /** @return {boolean} */
  _isBlockedScrim () {
    return this.hasAttribute('block-scrim')
  }
}
customElements.define('ark-modal', Modal)
