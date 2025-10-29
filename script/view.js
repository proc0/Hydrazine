class View extends HTMLElement {
  model = null
  page = null

  connectedCallback() {
    this.addEventListener('load', ({ detail, target }) => {
      this.model
        .getStuff(detail.cursor, detail.count, detail.resource)
        .then(this.page.render(target))
    })
    this.addEventListener('load-kids', ({ detail, target }) => {
      this.model
        .getStuff(detail.cursor, detail.count, detail.resource)
        .then(this.page.render(target))
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
