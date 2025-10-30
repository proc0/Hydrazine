class View extends HTMLElement {
  model = new Model()

  connectedCallback() {
    this.addEventListener('load', ({ detail, target }) => {
      this.model.getItems(detail.cursor, detail.count, detail.resource).then(Page.render(target))
    })
  }

  constructor() {
    super()
  }

  initialize() {
    customElements.define('hz-page', Page)
    const page = document.createElement('hz-page')
    this.appendChild(page)
  }
}
