window.onload = function () {
  const request = fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json() // Or .text(), .blob(), etc., depending on the response type
    })
    .then((data) => {
      console.log(data) // Handle the fetched data here
      const ul = document.createElement('ul')
      document.querySelector('main').appendChild(ul)
      for (let i = 0; i < 5; i++) {
        const post = fetch(`https://hacker-news.firebaseio.com/v0/item/${data[i]}.json`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            return response.json() // Or .text(), .blob(), etc., depending on the response type
          })
          .then((data) => {
            const li = document.createElement('li')
            li.textContent = data.title
            ul.appendChild(li)
          })
      }
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error)
    })
}
