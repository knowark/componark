import { Component } from '../../../base/component'

export class Form extends Component {
  constructor () {
    super()
    this.defaultContent = this.defaultContent || this.innerHTML
  }

  init (context = {}) {
    this.defaultValues = context['values'] || {}
    return super.init()
  }

  render () {
    this.innerHTML = /* html */ `
      ${this.defaultContent}
    `

    Object.keys(this.defaultValues).forEach(key => {
      this.setItemValue(key, this.defaultValues[key])
    })

    return super.render()
  }

  setItemValue (key, value) {
    const item = this.getItem(key)
    if (!item) { return }
    item['value'] = value
  }

  getItemValue (key) {
    const item = this.getItem(key)
    if (!item) { return }
    return item['value']
  }

  get values () {
    const data = {}

    this.items.forEach(
      item => data[item.getAttribute('form-item')] = item['value']
    )

    return data
  }

  get items () {
    return this.selectAll('[form-item]')
  }

  getItem (key) {
    return this.select(`[form-item="${key}"]`)
  }
}
Component.define('ark-form', Form)
