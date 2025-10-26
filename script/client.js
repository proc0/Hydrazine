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
    // TODO: .text(), .blob(), etc., depending on the response type
    return response.json()
  }

  normalize(data) {
    return {
      id: data.id,
      title: data.title,
    }
  }

  catchError(error) {
    console.error('Fetch error:', error)
  }
}
