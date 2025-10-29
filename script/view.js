class View extends HTMLElement {
  model = null
  page = null

  connectedCallback() {
    this.addEventListener('load', ({ detail, target }) => {
      this.model
        .getItems(detail.cursor, detail.count, detail.resource)
        .then(this.page.render(target))
    })
  }

  constructor(model, page) {
    super()
    this.model = model
    this.page = page
  }
}
