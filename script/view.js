class View extends HTMLElement {
  model = null
  page = null

  connectedCallback() {
    this.addEventListener('topstories', (event) => {
      this.model.getItems('topstories', 3).then(event.detail.render)
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
