export class SidebarTitle extends HTMLElement {
  connectedCallback () {
    this.render()
  }

  render () {
    this.innerHTML = /* html */`
      <h3>${this.innerHTML}</h3>
    `
  }
}
customElements.define('ark-sidebar-title', SidebarTitle)