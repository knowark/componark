import { Component } from 'base/component'

export class LocationDemo extends Component {
  init (context) {
    return super.init(context)
  }

  render () {
    this.innerHTML = /* html */ `${this.styles}
      <div>
        <ark-button background="primary" listen on-click="getCurrentPosition">
          Current position
        </ark-button>
        <span data-position></span>
      </div>
      <div class="location-container">
        <ark-location></ark-location>
        <ark-map token="${this.token}"></ark-map>
      </div>
    `

    this.location['start']()
    return super.render()
  }

  load () {
    this.addEventListener('onCurrentPosition', (
			/** @type {CustomEvent} */ event
    ) => {
      event.stopImmediatePropagation()
      const coords = event.detail.currentPosition.coords
      this.map['addMarker'](coords.latitude, coords.longitude)
    })

    return super.load()
  }

  disconnectedCallback () {
    this.location['stop']()
  }

  async getCurrentPosition () {
    const span = this.querySelector('[data-position]')
    span.innerHTML = ''

    this.location['stop']()
    const position = await this.location['getCurrentPosition']()
    this.location['start']()

    span.innerHTML = `
      Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}
    `
  }

  get location () {
    return this.select('ark-location')
  }

  get map () {
    return this.select('ark-map')
  }

  get token () {
    return 'pk.' +
      'eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.' +
      'zA2W0IkI0c6KaAhJfk9bWg'
  }

  get styles () {
    return /* html */ `
      <style>
        demo-location .location-container{
          display: block;
          width: 100%;
          height: 100%;
        }
      </style>
    `
  }
}
Component.define('demo-location', LocationDemo)
