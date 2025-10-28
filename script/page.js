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
        const post = this.renderItem(item)
        parent.appendChild(post)

        if (item.kids?.length) {
          const moreButton = document.createElement('button')
          moreButton.textContent = 'More'
          moreButton.addEventListener('click', (event) => {
            post.dispatchEvent(
              new CustomEvent('load-kids', {
                bubbles: true,
                detail: { item, render: this.render(post) },
              })
            )
          })
          post.append(moreButton)
        }
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
      const subtitle = document.createElement('span')
      const commentDate = new Date(item.time)
      subtitle.textContent = `${item.by} ${commentDate.toLocaleString()}`
      summary.append(subtitle)
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
      if (!details.open) {
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
