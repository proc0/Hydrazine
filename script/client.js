class Client {
  fetchItems(endpoint, itemCount) {
    return fetch(this.getUrl(endpoint))
      .then(this.handleResponse)
      .then((ids) => {
        const xhrCalls = []
        for (let i = 0; i < itemCount; i++) {
          xhrCalls.push(
            fetch(this.getUrl(`item/${ids[i]}`))
              .then(this.handleResponse)
              .then(this.normalize)
          )
        }

        return Promise.all(xhrCalls)
      })
      .catch(this.catchError)
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
      title: data.title,
    }
  }

  catchError(error) {
    console.error('Fetch error:', error)
  }
}
