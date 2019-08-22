/**
 * @typedef {import('./drag').DragZone} DragZone
 * @typedef {import('./drop').DropZone} DropZone
 * */
import { Component } from '../../component'
import { isValidLevel } from './utils'
import { uuidv4 } from '../../../utils'

export class Zone extends Component {
	init (context) {
		this.rows = context['rows'] || this.rows || 0
		this.cols = context['cols'] || this.cols || 0

		this.id = uuidv4()

		/** @type {HTMLElement} */
		const parent = /** @type {unknown} */ (window.document)
		this.parent = /** @type {HTMLElement} */ (parent)

		return super.init()
	}

	reflectedProperties () {
		return ['rows', 'cols']
	}

	render () {
		return super.render()
	}

	load () {
		// ------------------------------------------------------------------------
		// dragstart
		// ------------------------------------------------------------------------
		this.addEventListener('dragstart', this.onDragstart.bind(this))

		// ------------------------------------------------------------------------
		// zone:drop
		// ------------------------------------------------------------------------
		this.selectAll('ark-zone-drop').forEach(drop => {
			drop.addEventListener('zone:drop', this.onZoneDrop.bind(this))
		})

		// ------------------------------------------------------------------------
		// zone:selected
		// ------------------------------------------------------------------------
		this.parent.addEventListener(
			'zone:selected', this.onZoneSelected.bind(this)
		)

		// ------------------------------------------------------------------------
		// click
		// ------------------------------------------------------------------------
		this.addEventListener('click', this.onClick.bind(this))

		// ------------------------------------------------------------------------
		this._assignPosition()
		return super.load()
	}

	cloneDrag (drag) {
		const clone = /** @type {DragZone} */ (drag.cloneNode(true))
		clone.id = uuidv4()
		return clone
	}

	clearSelected () {
		this.selectAll('ark-zone-drag[selected]').forEach((
			/** @type {DragZone} */ selectedDrag
		) => {
			selectedDrag.selected = false
		})
	}

	// ---------------------------------------------------------------------------
	/**
   * @param {DropZone} drop
   * @param {DragZone[]} drags
   * @param {DragZone} dragstart
   * @param {boolean?} copy
   * */
	zoneDrop (drop, drags, dragstart, copy = false) {
		if (dragstart && drop) {
			const changePosition = this._getChangePosition(dragstart, drop)

			let isValid = true

			drags.forEach(drag => {
				const absolutePosition = this._getAbsolutePosition(
					drag,
					changePosition
				)

				const dropDestination = this._selectDrop(
					absolutePosition.x,
					absolutePosition.y
				)

				if (
					dropDestination === null ||
            !isValidLevel(dropDestination, drag)
				) {
					isValid = false
				}
			})

			drags.forEach(drag => {
				let targetDrag = drag
				if (isValid) {
					const absolutePosition = this._getAbsolutePosition(
						drag,
						changePosition
					)

					const dropDestination = this._selectDrop(
						absolutePosition.x,
						absolutePosition.y
					)

					if (copy) {
						targetDrag = this.cloneDrag(drag)
						drag.draggableEnd()
					}

					dropDestination.appendChild(targetDrag)
					dropDestination.updateDragPosition()
				}
				targetDrag.draggableEnd()
			})
		}
	}

	// ---------------------------------------------------------------------------
	/** @param {event} event */
	onDragstart (event) {
		event.stopImmediatePropagation()
		const dataTransfer = []

		this.selectAll('ark-zone-drag[selected]').forEach((
			/** @type {DragZone} */ selectedDrag
		) => {
			const isDragstart = event.target === selectedDrag
			dataTransfer.push(selectedDrag.generateDataTransfer(isDragstart))
			selectedDrag.draggableStart()
		})

		event['dataTransfer'].clearData()
		event['dataTransfer'].setData(JSON.stringify(dataTransfer), '')
	}

	/** @param {event} event */
	onClick (event) {
		this.dispatchEvent(
			new CustomEvent('zone:selected', {
				bubbles: true,
				detail: {
					zoneId: this.id
				}
			})
		)
	}

	/** @param {event} event */
	onZoneDrop (event) {
		event.stopImmediatePropagation()

		const drop = /** @type {DropZone} */ (
			event['detail'] ? event['detail'].drop : null
		)

		const drags = /** @type {DragZone[]} */ (
			event['detail'] ? event['detail'].drags : []
		)

		const dragstart = /** @type {DragZone} */ (
			event['detail'] ? event['detail'].dragstart : null
		)

		const copy = event['detail'] ? event['detail'].copy : false

		this.zoneDrop(drop, drags, dragstart, copy)
	}

	/** @param {event} event */
	onZoneSelected (event) {
		const zoneId = event['detail'] ? event['detail'].zoneId : null
		if (this.id !== zoneId) this.clearSelected()
	}

	// ---------------------------------------------------------------------------
	_assignPosition () {
		const drops = /** @type {DropZone[]} */ this.selectAll('ark-zone-drop')

		if (drops.length) {
			if (parseInt(this.rows)) {
				let index = 0
				for (let row = 0; row < parseInt(this.rows); row++) {
					for (let col = 0; col < parseInt(this.cols); col++) {
						const drop = /** @type {DropZone} */ (drops[index])
						this._setPosition(drop, String(row), String(col))
						index++
					}
				}
			} else {
				drops.forEach((/** @type {DropZone} */ drop, index) => {
					this._setPosition(drop, String(0), String(index))
				})
			}
		}
	}

	/**
   * @param {DropZone} drop @param {String} x @param {String} y
   * */
	_setPosition (drop, x, y) {
		drop.setAttribute('x', x)
		drop.setAttribute('y', y)
	}

	/** @return {DropZone} */
	_selectDrop (x, y) {
		return /** @type {DropZone} */ (this.select(
			`ark-zone-drop[x='${x}'][y='${y}']`
		))
	}

	/** @param {DragZone} start @param {DropZone | Object} end */
	_getChangePosition (start, end) {
		return {
			x: parseInt(end.x) - parseInt(start.x),
			y: parseInt(end.y) - parseInt(start.y)
		}
	}

	/** @param {DragZone} drag @param {Object} changePosition */
	_getAbsolutePosition (drag, changePosition) {
		return {
			x: parseInt(drag.x) + parseInt(changePosition.x),
			y: parseInt(drag.y) + parseInt(changePosition.y)
		}
	}
}
customElements.define('ark-zone', Zone)