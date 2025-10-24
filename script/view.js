class View {
  renderItems(items) {
    const ul = document.createElement('ul')

    items.forEach((item) => {
      const li = document.createElement('li')
      li.textContent = item.title
      ul.appendChild(li)
    })

    document.querySelector('main').appendChild(ul)
  }
}
