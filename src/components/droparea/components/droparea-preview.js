import { Component } from '../../../base/component'
import { Droparea } from './droparea'
// @ts-ignore
const tag = 'ark-droparea-preview'

export class DropareaPreview extends Component {
  init(context = {}) {
    return super.init()
  }

  render() {
    this.content = /* html */ `
         <ul data-preview-list class="ark-droparea-preview__list drag-sort-enable"></ul>
        `
    return super.render()
  }

  previewFile(file) {
    const blobUrl = URL.createObjectURL(file)
    const fileType = file.type.split('/')[0]
    const previewZone = this.select('[data-preview-list]')
    const picture = document.createElement('li')
    picture.className = 'ark-droparea-preview__frame'
    const removeButton = document.createElement('button')
    removeButton.innerText = '⨯'
    removeButton.className = 'ark-droparea__remove'

    if (fileType != 'image') {
      picture.innerHTML = `<p>${file.name}</p>`
      picture.setAttribute('data', `${blobUrl}`)
    } else {
      picture.style.backgroundImage = `url('${blobUrl}')`
    }

    removeButton.addEventListener('click', this.removeFile.bind(this, file))
    picture.appendChild(removeButton)
    previewZone.appendChild(picture)
    this.toggleVisibility()

    if (!this.droparea.hasAttribute('single')) {
      picture.setAttribute('index', this.fileIndex(file))
      this.enableDragSort('drag-sort-enable')
    }
  }

  toggleVisibility() {
    const previewZone = this.select('[data-preview-list]')
    this.files.length !== 0
      ? (previewZone.style.visibility = 'visible')
      : (previewZone.style.visibility = 'hidden')
  }

  /* DragSort Functionality */

  enableDragSort(listClass) {
    const sortableLists = this.getElementsByClassName(listClass)
    Array.prototype.map.call(sortableLists, (list) => {
      this.enableDragList(list)
    })
  }

  enableDragList(list) {
    Array.prototype.map.call(list.children, (item) => {
      this.enableDragItem(item)
    })
  }

  enableDragItem(item) {
    item.setAttribute('draggable', true)
    item.addEventListener('drag', this.handleDrag.bind(this, item))
    item.addEventListener('dragend', this.handleDrop, false)
  }

  /* istanbul ignore next */
  handleDrag(item, event) {
    const selectedItem = item,
      list = selectedItem.parentNode,
      x = event.clientX,
      y = event.clientY

    selectedItem.classList.add('drag-sort-active')
    let swapItem =
      document.elementFromPoint(x, y) === null
        ? selectedItem
        : document.elementFromPoint(x, y)
    if (list === swapItem.parentNode) {
      swapItem =
        swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling
      list.insertBefore(selectedItem, swapItem)
    }
  }

  handleDrop(item) {
    const droparea = item.target.closest('ark-droparea')
    droparea.preview.createNewFileList()
    item.target.classList.remove('drag-sort-active')
    droparea.preview.dispatchAlterEvent()
  }
  /*----------------------------------------------------*/

  dispatchAlterEvent() {
    this.emit('alter', this.files)
  }

  createNewFileList() {
    const nodeList = this.querySelectorAll('li')
    const newList = []
    nodeList.forEach((item, index) => {
      newList.push(this.droparea.fileList[item.getAttribute('index')])
      item.setAttribute('index', index)
    })
    this.droparea.fileList = newList
  }

  fileExists(file) {
    const present = this.files.some((item) => item.name === file.name)
    return present
  }

  removeFile(file, event) {
    let element = event.target
    const fileIndex = this.droparea.fileList.indexOf(file)
    this.droparea.fileList.splice(fileIndex, 1)
    element.parentNode.remove()
    this.selectAll('li').forEach((item, index) =>
      item.setAttribute('index', index)
    )
    this.toggleVisibility()
    this.dispatchAlterEvent()
  }

  fileIndex(file) {
    return this.droparea.fileList.indexOf(file)
  }

  get droparea() {
    return this.parentNode
  }

  get files() {
    return this.droparea.fileList
  }
}

Component.define(tag, DropareaPreview)
