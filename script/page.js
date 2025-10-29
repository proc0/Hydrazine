class Page extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.dispatchEvent(
      new CustomEvent('load', {
        bubbles: true,
        detail: { cursor: 0, count: 3, resource: 'topstories' },
      })
    )
  }

  render(parent) {
    return (items) => {
      const moreButton = parent.querySelector('& > button')

      items.forEach((item) => {
        const post = this.renderItem(item)
        if (moreButton) {
          parent.insertBefore(post, moreButton)
        } else {
          parent.append(post)
        }
      })
    }
  }

  renderItem(item) {
    const details = document.createElement('details')
    const summary = document.createElement('summary')
    const section = document.createElement('section')

    details.setAttribute('id', item.id)

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

    let moreButton
    if (item.kids?.length > 0) {
      details.querySelector('& > button')?.remove()
      moreButton = document.createElement('button')
      moreButton.textContent = 'Comments'
      moreButton.addEventListener('click', (event) => {
        const totalKids = details.querySelectorAll('& > details')?.length || 0
        details.dispatchEvent(
          new CustomEvent('load', {
            bubbles: true,
            detail: {
              cursor: totalKids === 0 ? 0 : totalKids - 1,
              count: 3,
              resource: item,
            },
          })
        )

        if (item.kids.length - 1 === totalKids) {
          moreButton.remove()
        }
      })

      details.append(moreButton)
    }

    details.addEventListener('click', (event) => {
      event.stopImmediatePropagation()
      if (!details.open && !details.querySelectorAll('& > details')?.length && moreButton) {
        moreButton.click()
      }
    })

    return details
  }
}
