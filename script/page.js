class Page extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.dispatchEvent(
      new CustomEvent('load', {
        bubbles: true,
        detail: { cursor: 0, count: 3, resource: Resource.Top },
      })
    )
  }

  static onLoadMore({ target }) {
    const post = target.parentElement
    const loadButton = post.querySelector('& > button')
    const numChildPosts = post.querySelectorAll('& > details')?.length || 0
    const itemId = post.getAttribute('id')
    const numItemKids = Number(post.getAttribute('data-kids'))
    const numKidsToFetch = numItemKids - numChildPosts
    const remaining = numKidsToFetch > 0 ? numKidsToFetch : 0
    post.setAttribute('data-kids', remaining)

    if (remaining === 0 && loadButton) {
      loadButton.remove()
    }

    post.dispatchEvent(
      new CustomEvent('load', {
        bubbles: true,
        detail: {
          cursor: numChildPosts === 0 ? 0 : numChildPosts - 1,
          count: 3,
          resource: Number(itemId),
        },
      })
    )
  }

  static onExpand(event) {
    event.stopImmediatePropagation()
    const details = event.currentTarget
    const moreButton = details.querySelector('& > button')
    if (!details.open && !details.querySelectorAll('& > details')?.length && moreButton) {
      moreButton.click()
    }
  }

  static render(parent) {
    return (items) => {
      const moreButton = parent.querySelector('& > button')

      items.forEach((item) => {
        const post = Page.renderItem(item)
        if (moreButton) {
          parent.insertBefore(post, moreButton)
        } else {
          parent.append(post)
        }
      })
    }
  }

  static renderItem(item) {
    const details = document.createElement('details')
    const summary = document.createElement('summary')
    const section = document.createElement('section')

    details.setAttribute('id', item.id)
    details.setAttribute('data-kids', item.kids?.length || 0)

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
      const comment = document.createElement('div')
      comment.innerHTML = item.text
      section.append(comment)
    }

    details.append(summary)
    details.append(section)

    if (item.kids?.length > 0) {
      const moreButton = document.createElement('button')
      moreButton.textContent = 'Comments'
      details.append(moreButton)

      moreButton.addEventListener('click', Page.onLoadMore)
      details.addEventListener('click', Page.onExpand)
    }

    return details
  }
}
