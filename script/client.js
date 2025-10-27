class Client {
  fetchIds(endpoint) {
    return fetch(this.getUrl(endpoint)).then(this.handleResponse).catch(this.catchError)
  }

  fetchItems(ids) {
    const xhrCalls = []
    for (let i = 0; i < ids.length; i++) {
      xhrCalls.push(
        fetch(this.getUrl(`item/${ids[i]}`))
          .then(this.handleResponse)
          .then(this.normalize)
      )
    }

    return Promise.all(xhrCalls)
  }

  getUrl(uri) {
    return `https://hacker-news.firebaseio.com/v0/${uri}.json`
  }

  handleResponse(response) {
    if (!response.ok) {
      throw new Error(`Item fetch Error: ${response.status}`)
    }

    return response.json()
  }

  normalize(data) {
    return data
  }

  catchError(error) {
    console.error('Fetch error:', error)
  }
}
