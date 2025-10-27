class Page extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.dispatchEvent(
      new CustomEvent('load', {
        bubbles: true,
        detail: { endpoint: 'topstories', render: this.render(this) },
      })
    )
  }

  render(parent) {
    return function (items) {
      items.forEach((item) => {
        parent.appendChild(this.renderItem(item))
      })
    }.bind(this)
  }

  renderItem(item) {
    const details = document.createElement('details')
    const summary = document.createElement('summary')
    const section = document.createElement('section')

    if (item.title) {
      const title = document.createElement('h1')
      title.textContent = item.title
      summary.append(title)
    } else {
      details.setAttribute('open', '')
    }

    if (item.text) {
      const comment = document.createElement('p')
      comment.innerHTML = item.text
      section.append(comment)
    }

    details.append(summary)
    details.append(section)

    details.addEventListener('click', (event) => {
      event.stopImmediatePropagation()
      if (details.open) {
        details.dispatchEvent(
          new CustomEvent('load-kids', {
            bubbles: true,
            detail: { item, render: this.render(details) },
          })
        )
      }
    })
    return details
  }
}
