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
    items.forEach((item) => {
      this.appendChild(this.renderItem(item))
    })
  }

  renderItem(item) {
    const details = document.createElement('details')
    const summary = document.createElement('summary')
    const section = document.createElement('section')
    const title = document.createElement('h1')

    title.textContent = item.title
    section.textContent = 'comments'

    summary.append(title)
    details.append(summary)
    details.append(section)

    return details
  }
}
