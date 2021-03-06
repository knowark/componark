import { Component } from '../../../base/component'
import { styles } from '../styles'

const tag = 'ark-sidebar'
export class Sidebar extends Component {
  init(context = {}) {
    this.binding = 'sidebar-listen'
    this.side = context.side || this.side || 'left'
    return super.init(context)
  }

  reflectedProperties() {
    return ['opened', 'side']
  }

  render() {
    const slots = this.slots()

    this.content = /* html */ `
      <div side="${this.side}" class="ark-sidebar__menu">
        <div class="ark-sidebar__header"></div>
        <div class="ark-sidebar__body"></div>
        <div class="ark-sidebar__footer"></div>
      </div>
      <div class="ark-sidebar__scrim" sidebar-listen on-click="close"></div>
    `

    this._renderSlot(slots, 'header', '.ark-sidebar__header')
    this._renderSlot(slots, 'general', '.ark-sidebar__body')
    this._renderSlot(slots, 'footer', '.ark-sidebar__footer')

    return super.render()
  }

  open() {
    this.setAttribute('opened', '')
    document.querySelector('body').style.overflow = 'hidden'
  }

  close() {
    this.removeAttribute('opened')
    document.querySelector('body').style.overflow = 'auto'
  }

  toggle() {
    this.toggleAttribute('opened')
  }

  _renderSlot(slots, key, selector) {
    const elements = slots[key] || []
    for (const element of elements) {
      this.select(selector).append(element)
    }
  }
}
Component.define(tag, Sidebar, styles)
