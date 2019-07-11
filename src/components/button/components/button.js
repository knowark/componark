import { Component } from '../../component'

export class Button extends Component {
  init (context) {
    return super.init(context)
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.innerHTML = /* html */`
        <${this._getType()} ${this._getAttributes()}>
          ${this.innerHTML}
        </${this._getType()}>
    `
    this._removeAttribute()
    return super.render()
  }

  _getAttributes () {
    this._isFab()
    const attributes = Array.from(this.attributes)

    return attributes.map((attribute) => {
      var attr = `${attribute.name}`
      if (attribute.value) attr += `=${attribute.value}`
      return attr
    }).join(' ')
  }

  _isFab () {
    if (this.hasAttribute('fab')) {
      if (!this.hasAttribute('horizontal')) {
        this.setAttribute('horizontal', 'end')
      }
      if (!this.hasAttribute('vertical')) {
        this.setAttribute('vertical', 'end')
      }
    }
  }

  _getType () {
    return this.hasAttribute('href') ? 'a' : 'button'
  }

  _removeAttribute () {
    while (this.attributes.length > 0) {
      this.removeAttribute(this.attributes[0].name)
    }
  }
}
customElements.define('ark-button', Button)
