const BASE_NAME = 'hydrazine'
const BASE_STORE = 'items'
const BASE_VERSION = 1

class Store {
  constructor() {
    const openRequest = window.indexedDB.open(BASE_NAME, BASE_VERSION)
    openRequest.onerror = this.throwError('Initializing')
    openRequest.onupgradeneeded = this.upgrade.bind(this)
    openRequest.onsuccess = ({ target }) => {
      console.log('Initialized store.')
      this.database = target.result
    }
  }

  add(item) {
    return new Promise((resolve, reject) => {
      this.transact('readwrite', (store) => {
        const addRequest = store.add(item, item.id)

        addRequest.onsuccess = ({ target }) => {
          console.log(`Added item ${target.result.id}.`)
          resolve(target.result)
        }

        return addRequest
      })
    })
  }

  addAll(items) {
    return Promise.all(items.map(this.add.bind(this)))
  }

  createStore(database) {
    console.log('Creating store...')
    // create an object store for items
    const store = database.createObjectStore(BASE_STORE)
    // create search indices
    store.createIndex('id', 'id', { unique: true })
    store.createIndex('title', 'title', { unique: false })
  }

  find(id) {
    return new Promise((resolve, reject) => {
      this.transact('readonly', (store) => {
        const getRequest = store.get(id)

        getRequest.onsuccess = ({ target }) => {
          resolve(target.result)
        }

        return getRequest
      })
    })
  }

  findAll(ids) {
    return Promise.all(ids.map(this.find.bind(this))).then((items) => {
      const resultIds = items.map((item) => item?.id)
      const missing = ids.filter((id) => resultIds.filter((itemId) => itemId === id).length === 0)
      return { found: items.filter((a) => a), missing }
    })
  }

  migrate(migration, target) {
    if (!migration || !target.transaction) return
    // version upgrade migration
    const store = target.transaction.objectStore(BASE_STORE)
    const cursorRequest = store.openCursor()
    cursorRequest.onerror = this.throwError('Migration')
    cursorRequest.onsuccess = ({ target }) => {
      const cursor = target.result
      if (!cursor) {
        return console.log('Migration complete.')
      }
      // migrate item
      const item = cursor.value
      const migrated = migration(item)
      // save item
      const putRequest = store.put(migrated, migrated.id)
      putRequest.onerror = this.throwError(`Migrating task ${migrated.id}`)
      putRequest.onsuccess = (success) => {
        console.log(`Migrated item ${success.target.result}.`)
      }

      cursor.continue()
    }
  }

  save(item) {
    return new Promise((resolve, reject) => {
      this.transact('readwrite', (store) => {
        const putRequest = store.put(item, item.id)

        putRequest.onsuccess = (success) => {
          console.log(`Saved item ${success.target.result}`)
          resolve(success.target.result)
        }

        return putRequest
      })
    })
  }

  saveAll(items) {
    return Promise.all(items.map(this.save.bind(this)))
  }

  throwError(context) {
    return ({ target }) => {
      throw new Error(`Store Error: ${context}`, { cause: target.error })
    }
  }

  transact(operation, order) {
    const transaction = this.database.transaction(BASE_STORE, operation)
    const store = transaction.objectStore(BASE_STORE)

    const request = order(store)
    if (request) {
      request.onerror = this.throwError('Transaction')
    }

    return request
  }

  upgrade({ target }) {
    console.log('Upgrading schema...')
    const database = target.result
    database.onerror = this.throwError('Upgrade')
    // object store does not exist
    if (!database.objectStoreNames.contains(BASE_STORE)) {
      this.createStore(database)
    } else {
      // define migration function for version upgrades
      // if (oldVersion === 1) {
      //   // get oldVersion from event.oldVersion
      //   console.log(`Migrating version ${oldVersion} to ${database.version}.`)
      //   migration = (task) => {
      //     /* modify task to new version here */
      //   }
      // }
      let migration = null
      this.migrate(migration, target)
    }
  }
}
