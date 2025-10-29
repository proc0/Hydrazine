class Resource {
  static Top = new Resource('topstories')
  static New = new Resource('newstories')
  static Best = new Resource('beststories')
  static Ask = new Resource('askstories')
  static Show = new Resource('showstories')
  static Job = new Resource('jobstories')

  constructor(url) {
    this.url = url
  }
}

class Client {
  fetchIds(endpoint) {
    return fetch(this.getUrl(endpoint)).then(this.receive).catch(this.logError)
  }

  fetchItems(ids) {
    const xhrCalls = []
    for (let i = 0; i < ids.length; i++) {
      xhrCalls.push(
        fetch(this.getUrl(`item/${ids[i]}`))
          .then(this.receive)
          .then(this.normalize)
      )
    }

    return Promise.all(xhrCalls)
  }

  getUrl(uri) {
    return `https://hacker-news.firebaseio.com/v0/${uri}.json`
  }

  receive(response) {
    if (!response.ok) {
      throw new Error(`Item fetch Error: ${response.status}`)
    }

    return response.json()
  }

  normalize(data) {
    return data
  }

  logError(error) {
    console.error('Client Error:', error)
  }
}
