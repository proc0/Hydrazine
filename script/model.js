class Model {
  store = null
  client = null

  constructor(store, client) {
    this.store = store
    this.client = client
  }

  getItems(endpoint, itemCount) {
    return this.client.fetchItems(endpoint, itemCount)
  }
}
