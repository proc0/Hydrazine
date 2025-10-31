class Page extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.dispatchEvent(
      new CustomEvent('load', {
        bubbles: true,
        detail: { cursor: 0, count: 5, resource: Resource.Top },
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
    const remaining = numKidsToFetch > 0 ? numKidsToFetch - 3 : 0
    post.setAttribute('data-kids', remaining)

    if (remaining === 0 && loadButton) {
      loadButton.remove()
    } else {
      loadButton.textContent = `⇊ (+${remaining}) ⇊`
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
      title.textContent = `${item.score}/🗨${item.descendants} ${item.title}`
      summary.append(title)
    } else {
      const subtitle = document.createElement('h2')
      const username = document.createElement('span')
      username.textContent = item.by
      subtitle.textContent = ` ⏲ ${Page.ellapse(item.time * 1000, Date.now())} `
      subtitle.prepend(username)
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
      moreButton.textContent = `⇊ (+${item.kids.length}) ⇊`
      details.append(moreButton)

      moreButton.addEventListener('click', Page.onLoadMore)
      details.addEventListener('click', Page.onExpand)
    }

    return details
  }

  static ellapse(begin, end) {
    // Get the time difference in milliseconds
    let timeDifferenceMS = end - begin
    const startDate = new Date(begin)
    const endDate = new Date(end)

    // Check if either of the start or end date is in DST and
    // adjust the DST offset accordingly.
    if (
      endDate.getTimezoneOffset() < startDate.getTimezoneOffset() ||
      (startDate.getTimezoneOffset() < endDate.getTimezoneOffset() && startDate < endDate)
    ) {
      // Adjust for the DST transition
      const dstTransition = endDate.getTimezoneOffset() - startDate.getTimezoneOffset()
      timeDifferenceMS -= dstTransition * 60 * 1000
    }

    // Calculate the elapsed time in seconds, minutes, hours, and days
    // const timeDifferenceSecs = Math.floor(timeDifferenceMS / 1000)
    const timeDifferenceMins = Math.floor(timeDifferenceMS / 60000)
    const timeDifferenceHours = Math.floor(timeDifferenceMS / 3600000)
    const timeDifferenceDays = Math.floor(timeDifferenceMS / 86400000)

    // console.log(`Time difference in milliseconds: ${timeDifferenceMS}`)
    // console.log(`Time difference in seconds: ${timeDifferenceSecs}`)
    // console.log(`Time difference in minutes: ${timeDifferenceMins}`)
    // console.log(`Time difference in hours: ${timeDifferenceHours}`)
    // console.log(`Time difference in days: ${timeDifferenceDays}`)

    let ellapsedTime = ''
    if (timeDifferenceMins < 60) {
      ellapsedTime = `${timeDifferenceMins} minutes`
    } else if (timeDifferenceHours < 24) {
      ellapsedTime = `${timeDifferenceHours} hours`
    } else {
      ellapsedTime = `${timeDifferenceDays} days`
    }

    return ellapsedTime
  }
}
