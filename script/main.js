window.onload = function () {
  const model = new Model()
  const view = new View()

  model.fetchItems('topstories', 3).then(view.renderItems)
}
