window.onload = function () {
  const client = new Client()
  const store = new Store()
  const model = new Model(store, client)
  customElements.define('hz-page', Page)
  customElements.define('hz-view', View)
  const page = document.createElement('hz-page')
  const view = document.createElement('hz-view')
  view.model = model
  view.page = page
  view.appendChild(page)
  document.querySelector('main').appendChild(view)
  // const view = new View(model, page)
}
