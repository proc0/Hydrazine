class Model {
  BASE_URL = 'https://hacker-news.firebaseio.com/v0'

  fetchItems(endpoint, itemCount) {
    return fetch(`${this.BASE_URL}/${endpoint}.json`)
      .then(this.handleResponse)
      .then((itemIds) => {
        const xhrCalls = []
        for (let i = 0; i < itemCount; i++) {
          xhrCalls.push(
            fetch(`${this.BASE_URL}/item/${itemIds[i]}.json`)
              .then(this.handleResponse)
              .then(this.normalize)
          )
        }

        return Promise.all(xhrCalls)
      })
      .catch(this.catchError)
  }

  handleResponse(response) {
    if (!response.ok) {
      throw new Error(`Item fetch Error: ${response.status}`)
    }
    // Or .text(), .blob(), etc., depending on the response type
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
