class Model {
  store = null
  client = null

  constructor(store, client) {
    this.store = store
    this.client = client
  }

  getItems(endpoint, itemCount) {
    return this.client.fetchIds(endpoint).then((ids) => {
      return new Promise((resolve, reject) => {
        this.store.find(ids[0], (item) => {
          if (!item) {
            return this.client.fetchItems([ids[0]]).then((items) => {
              this.store.save(items[0], (itemId) => {
                console.log('model saved Id')
                resolve([items[0]])
              })
            })
          }
          return resolve([item])
        })

        return []
      })
    })
  }
}
