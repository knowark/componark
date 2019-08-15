/** @typedef {import('./checkbox').Checkbox} Checkbox */
import { Component } from '../../component'

export class CheckboxGroup extends Component {
	init (context) {
		this.label = context['label']

		// local variables
		this.defaultContent = this.defaultContent || this.innerHTML

		return super.init()
	}

	reflectedProperties () {
		return ['label']
	}

	render () {
		// this.checkboxList = this.selectAll('ark-checkbox')
		// this.selectAll('ark-checkbox').forEach(checkbox => checkbox.remove())

		this.innerHTML = /* html */ `
      <div class="ark-checkbox-group__label">
        <small data-checkbox-group-label>${this.label}</small>
      </div>
      <div>
        <div data-checkbox-list class="ark-checkbox-group__list"></div>
        <div class="ark-checkbox-group__alert">
          ${this.defaultContent}
        </div>
      </div>
    `

		this._renderCheckboxList()
		return super.render()
	}

	get value () {
		const values = []

		this.selectAll('ark-checkbox').forEach((
			/** @type {Checkbox} */ checkbox
		) => {
			if (checkbox.isChecked()) values.push(checkbox.value)
		})

		return values
	}

	// ---------------------------------------------------------------------------
	/** @param {Event} event */
	_change (event) {
		event.stopPropagation()
		this.dispatchEvent(
			new CustomEvent('alter', {
				detail: { value: this.value }
			})
		)
	}

	_renderCheckboxList () {
		const container = this.querySelector('[data-checkbox-list]')
		const checkboxList = this.selectAll('ark-checkbox')

		checkboxList.forEach(checkbox => {
			checkbox.setAttribute('listen', '')
			checkbox.setAttribute('on-alter', '_change')

			container.appendChild(checkbox)
			// checkbox.remove()
		})
	}
}
customElements.define('ark-checkbox-group', CheckboxGroup)
