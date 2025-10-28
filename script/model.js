class Model {
  store = null
  client = null

  constructor(store, client) {
    this.store = store
    this.client = client
  }

  getItems(endpoint, count) {
    return this.client
      .fetchIds(endpoint)
      .then((ids) => ids.slice(0, count))
      .then(this.store.retrieve.bind(this.store))
      .then(this.reclaim.bind(this))
  }

  getKids(item, count) {
    if (!item.kids?.length) return this.wrap(this.wrap([]))

    return this.store.retrieve(item.kids.splice(0, count)).then(this.reclaim.bind(this))
  }

  reclaim({ foundItems, missingIds }) {
    return new Promise((resolve, reject) => {
      return this.client.fetchItems(missingIds).then((items) => {
        if (items.length) {
          return this.store.saveAll(items).then((ids) => {
            return resolve(items.concat(foundItems))
          })
        }

        return foundItems.length ? resolve(foundItems) : reject(items)
      })
    })
  }

  wrap(result) {
    return new Promise((resolve) => resolve(result))
  }
}
