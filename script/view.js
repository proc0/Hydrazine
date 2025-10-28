class View extends HTMLElement {
  model = null
  page = null

  connectedCallback() {
    this.addEventListener('load', ({ detail }) => {
      this.model.getItems(detail.endpoint, detail.cursor, detail.count).then(detail.render)
    })
    this.addEventListener('load-kids', ({ detail }) => {
      this.model.getKids(detail.item, detail.cursor, detail.count).then(detail.render)
    })
  }

  constructor(model, page) {
    super()
    this.model = model
    this.page = page
  }

  //   renderItems(items) {
  //     const ul = document.createElement('ul')

  //     items.forEach((item) => {
  //       const li = document.createElement('li')
  //       li.textContent = item.title
  //       ul.appendChild(li)
  //     })

  //     this.appendChild(ul)
  //   }
}
