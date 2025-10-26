const BASE_NAME = 'hydrazine'
const BASE_STORE = 'items'
const BASE_VERSION = 1

class Store {
  constructor() {
    const openRequest = window.indexedDB.open(BASE_NAME, BASE_VERSION)
    openRequest.onerror = this.throwError('Initializing')
    openRequest.onupgradeneeded = this.upgrade.bind(this)
    openRequest.onsuccess = ({ target }) => {
      console.log('Initialization complete.')
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
    return Promise.all(items.forEach(this.add.bind(this)))
  }

  create(database) {
    console.log('Creating store...')
    // create an objectStore for items
    const store = database.createObjectStore(BASE_STORE)
    // create search indices
    store.createIndex('id', 'id', { unique: true })
    store.createIndex('name', 'name', { unique: false })
  }
  //   delete(event) {
  //     const node = event.target
  //     // root task
  //     if (node.task.id) {
  //       // bubbles up to task view
  //       return this.transact('readwrite', (store) => {
  //         const taskId = node.task.id
  //         const deleteRequest = store.delete(taskId)
  //         deleteRequest.onsuccess = () => console.log(`Deleted task ${taskId}.`)

  //         return deleteRequest
  //       })
  //     }
  //     // branch task
  //     return this.save(event)
  //   }

  //   dispatch(eventName, detail) {
  //     return this.dispatchEvent(new CustomEvent(eventName, { bubbles: true, detail }))
  //   }

  //   export() {
  //     console.log('Exporting...')

  //     this.transact('readonly', (store) => {
  //       const readRequest = store.getAll()
  //       readRequest.onsuccess = ({ target }) => {
  //         const tasks = target.result
  //         const a = document.createElement('a')
  //         a.href = URL.createObjectURL(
  //           new Blob([JSON.stringify(tasks, null, 2)], {
  //             type: 'text/plain',
  //           })
  //         )
  //         a.setAttribute('download', 'tasks.json')
  //         this.appendChild(a)
  //         a.click()
  //         this.removeChild(a)
  //       }

  //       return readRequest
  //     })
  //   }

  //   import() {
  //     console.log('Importing...')

  //     const input = document.createElement('input')
  //     input.setAttribute('type', 'file')
  //     input.addEventListener('change', (event) => {
  //       const file = event.target.files[0]
  //       if (!file) {
  //         return this.throwError('Selecting file')
  //       }

  //       const reader = new FileReader()
  //       reader.onerror = this.throwError(`Reading file ${file}`)
  //       reader.onload = () => {
  //         // parse tasks
  //         const tasks = JSON.parse(reader.result)
  //         // save tasks
  //         this.transact('readwrite', (store) => {
  //           tasks.forEach((task) => {
  //             const addRequest = store.add(task, task.id)
  //             addRequest.onerror = this.throwError('Importing')
  //             addRequest.onsuccess = ({ target }) => {
  //               console.log(`Imported task ${target.result}`)
  //               this.dispatch(EVENT_RENDER_ROOT, { task })
  //             }
  //           })
  //         })

  //         input.remove()
  //       }

  //       reader.readAsText(file)
  //     })

  //     input.click()
  //   }

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
  //   migrate(migration, target) {
  //     if (!migration || !target.transaction) return
  //     // version upgrade migration
  //     const store = target.transaction.objectStore(BASE_STORE)
  //     const cursorRequest = store.openCursor()
  //     cursorRequest.onerror = this.throwError('Migrating')
  //     cursorRequest.onsuccess = ({ target }) => {
  //       const cursor = target.result
  //       if (!cursor) {
  //         return console.log('Migration complete.')
  //       }
  //       // migrate task and subtasks
  //       const model = cursor.value
  //       this.transformTask(migration, model)
  //       // save task migration
  //       const putRequest = store.put(model, model.id)
  //       putRequest.onerror = this.throwError(`Migrating task ${model.id}`)
  //       putRequest.onsuccess = (success) => {
  //         console.log(`Migrated task ${success.target.result}.`)
  //       }

  //       cursor.continue()
  //     }
  //   }

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
      throw new Error(`TaskBase Error: ${context}`, { cause: target.error })
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
    console.log('Upgrade needed.')
    const database = target.result
    database.onerror = this.throwError('Upgrading')
    // database does not exist
    if (!database.objectStoreNames.contains(BASE_STORE)) {
      this.create(database)
    } else {
      // define migration function for version upgrades
      // if (oldVersion === 1) { // get oldVersion from event.oldVersion
      //   console.log(`Migrating version ${oldVersion} to ${database.version}.`)
      //   migration = (task) => { /* modify task to new version here */ }
      // }
      // let migration = null
      // this.migrate(migration, target)
    }
  }
}
