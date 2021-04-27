import {
  Droparea
} from "components/droparea"

describe("Droparea", () => {
  const file = new File([new ArrayBuffer(1)], "file.jpg")

  const createBubbledEvent = (type, props = {}) => {
    const event = new Event(type, {
      bubbles: true
    })
    Object.assign(event, props)
    return event
  }

  let container = null

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    jest.clearAllMocks()
  })

  afterEach(() => {
    container.remove()
    container = null
  })

  it("can be instantiated", () => {
    container.innerHTML = /* html */ `
            <ark-droparea></ark-droparea>
        `

    const droparea = container.querySelector("ark-droparea")
    expect(droparea).toBe(droparea.init())
  })

  it("drag files to zone highlights the drop area", () => {
    container.innerHTML = /* html */ `
            <ark-droparea></ark-droparea>
        `

    const droparea = container.querySelector("ark-droparea")
    const dropZone = droparea.dropZone
    const dragNode = dropZone

    dragNode.dispatchEvent(
      createBubbledEvent("dragover", {
        clientX: 0,
        clientY: 1
      })
    )
    expect(dropZone.classList["1"]).toBe("highlight")
  })

  it("drag files outside the zone unhighlight the drop area", () => {
    container.innerHTML = /* html */ `
            <ark-droparea></ark-droparea>
        `

    const droparea = container.querySelector("ark-droparea")
    const dropZone = droparea.dropZone

    dropZone.dispatchEvent(
      createBubbledEvent("dragleave", {
        clientX: 0,
        clientY: 1
      })
    )
    expect(dropZone.classList.length).toBe(1)
  })

  it("Allows dropping files to the component", () => {
    container.innerHTML = /* html */ `
            <ark-droparea></ark-droparea>
        `

    const droparea = container.querySelector("ark-droparea")
    const dropZone = droparea.querySelector(".ark-droparea__form")
    const myFile = new File(["image"], "Doggy.png", {
      type: "image/png",
    })
    const dropEvent = createBubbledEvent("drop", {
      clientX: 0,
      clientY: 1,
      dataTransfer: {
        files: [myFile]
      },
    })

    dropZone.dispatchEvent(dropEvent)
    expect(droparea.fileList[0].name).toEqual(myFile.name)
  })

  it("Returns the file list", () => {
    container.innerHTML = /* html */ `
            <ark-droparea></ark-droparea>
        `

    const droparea = container.querySelector("ark-droparea")
    const dropZone = droparea.querySelector(".ark-droparea__form")
    const myFile = new File(["image"], "Snoopy.png", {
      type: "image/png",
    })
    const myFile2 = new File(["image"], "Scooby.png", {
      type: "image/png",
    })

    const dropEvent = createBubbledEvent("drop", {
      clientX: 0,
      clientY: 1,
      dataTransfer: {
        files: [myFile, myFile2]
      },
    })

    dropZone.dispatchEvent(dropEvent)
    expect(droparea.getFiles.length).toEqual(droparea.fileList.length)
  })

  it("Can select files from input", () => {
    container.innerHTML = /* html */ `
            <ark-droparea></ark-droparea>
        `

    const droparea = container.querySelector("ark-droparea")
    const dropZone = droparea.querySelector(".ark-droparea__form")
    const input = droparea.querySelector(".ark-droparea__input")
    const myFile = new File(["image"], "Snoopy.png", {
      type: "image/png",
    })
    const changeEvent = createBubbledEvent("change", {})
    Object.defineProperty(changeEvent, "target", {
      value: {
        files: [file]
      }
    })
    input.dispatchEvent(changeEvent)

    expect(droparea.getFiles.length).toBeTruthy()
  })

})