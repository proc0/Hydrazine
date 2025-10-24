window.onload = function () {
  const client = new Client()
  const view = new View()

  client.fetchItems('topstories', 3).then(view.renderItems)
}
