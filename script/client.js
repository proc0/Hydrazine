class Resource {
  static Top = new Resource('topstories')
  static New = new Resource('newstories')
  static Ask = new Resource('askstories')
  static Job = new Resource('jobstories')
  static Best = new Resource('beststories')
  static Show = new Resource('showstories')

  constructor(url) {
    this.url = url
  }
}

class Client {
  static fetchIds(endpoint) {
    return fetch(Client.getUrl(endpoint)).then(Client.receive).catch(this.logError)
  }

  static fetchItems(ids) {
    const xhrCalls = []
    for (let i = 0; i < ids.length; i++) {
      xhrCalls.push(
        fetch(Client.getUrl(`item/${ids[i]}`))
          .then(Client.receive)
          .then(Client.normalize)
      )
    }

    return Promise.all(xhrCalls)
  }

  static getUrl(uri) {
    return `https://hacker-news.firebaseio.com/v0/${uri}.json`
  }

  static receive(response) {
    if (!response.ok) {
      throw new Error(`Item fetch Error: ${response.status}`)
    }

    return response.json()
  }

  static normalize(data) {
    return data
  }

  logError(error) {
    console.error('Client Error:', error)
  }
}
