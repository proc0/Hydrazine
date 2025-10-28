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
      .then(this.store.findAll.bind(this.store))
      .then(({ found, missing }) => {
        return new Promise((resolve, reject) => {
          return this.client.fetchItems(missing).then((items) => {
            if (items.length) {
              return this.store.saveAll(items).then((ids) => {
                console.log(`Saved items ${ids.toString()}`)

                return resolve(items.concat(found))
              })
            }

            return found.length ? resolve(found) : reject(found)
          })
        })
      })
  }

  getKids(item, count) {
    if (!item.kids) return new Promise((resolve) => resolve(new Promise((resolve) => resolve([]))))

    return this.store.findAll(item.kids.splice(0, count)).then(({ found, missing }) => {
      return new Promise((resolve, reject) => {
        return this.client.fetchItems(missing).then((items) => {
          if (items.length) {
            return this.store.saveAll(items).then((ids) => {
              console.log(`Saved items ${ids.toString()}`)

              return resolve(items.concat(found))
            })
          }

          return found.length ? resolve(found) : reject(found)
        })
      })
    })
  }
}
