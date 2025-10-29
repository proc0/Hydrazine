class Model {
  store = null
  client = null

  constructor(store, client) {
    this.store = store
    this.client = client
  }

  getIds(cursor, count, resource) {
    if (typeof resource === 'object' && resource.kids?.length) {
      return this.wrap(resource.kids.slice(cursor, cursor + count))
    } else if (typeof resource === 'string') {
      return this.client.fetchIds(resource).then((ids) => ids.slice(cursor, cursor + count))
    } else {
      return this.wrap(this.wrap([]))
    }
  }

  getItems(cursor, count, resource) {
    return this.getIds(cursor, count, resource)
      .then(this.store.retrieve.bind(this.store))
      .then(this.reclaim.bind(this))
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
