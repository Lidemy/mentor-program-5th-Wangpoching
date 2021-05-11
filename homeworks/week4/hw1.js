const request = require('request')

request(
  'https://lidemy-book-store.herokuapp.com/books?_limit=10',
  (error, response, body) => {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      let books
      try {
        books = JSON.parse(body)
      } catch (err) {
        console.log(err)
        return
      }
      getbooks(books)
    }
  }
)

function getbooks(body) {
  for (let i = 0; i < body.length; i++) {
    console.log(`${i + 1} ${body[i].name}`)
  }
}
