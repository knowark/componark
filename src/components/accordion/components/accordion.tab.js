import { Component } from "../../../base/component"

const tag = "ark-accordion-tab"
export class AccordionTab extends Component {
  constructor() {
    super()
    this.defaultContent = this.defaultContent || this.innerHTML
  }

  /** @param {Object} context */
  init(context = {}) {
    this.binding = "accordion-tab-listen"
    this.header = context.header
    return super.init(context)
  }

  reflectedProperties() {
    return ["header", "index"]
  }

  render() {
    this.content = this.header
      ? /* html */ `
      <div class="ark-accordion-tab__header">
        <small data-accordion-tab-header>${this.header}</small>
      </div>
      <div class="ark-accordion-tab__content">
        ${this.defaultContent}
      </div>
    `
      : ""
    this.tabContent = this.querySelector(".ark-accordion-tab__content")
    return super.render()
  }

  async load() {
    this.tabContent && this.tabContent.addEventListener("click", (event) => {
      event.stopImmediatePropagation()
    })
  }

  open() {
    this.setAttribute("active", "true")
  }

  close() {
    this.removeAttribute("active")
  }

  toggle() {
    this.hasAttribute("active") ? this.close() : this.open()
  }
}
Component.define(tag, AccordionTab)
