class Page extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.dispatchEvent(
      new CustomEvent('load', {
        bubbles: true,
        detail: { endpoint: 'topstories', render: this.render.bind(this) },
      })
    )
  }

  render(items) {
    const ul = document.createElement('ul')

    items.forEach((item) => {
      const li = document.createElement('li')
      li.textContent = item.title
      ul.appendChild(li)
    })

    this.appendChild(ul)
  }
}
