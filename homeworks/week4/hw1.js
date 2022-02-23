const request = require('request')

request(
  'https://lidemy-book-store.herokuapp.com/books?_limit=10',
  (error, response, body) => {
    if (error) {
      console.log(error)
      return
    }
    if (response.statusCode >= 200 && response.statusCode < 300) {
      let books
      try {
        books = JSON.parse(body)
      } catch (err) {
        console.log(err)
        return
      }
      showbooks(books)
      return
    }
    console.log('something went wrong')
  }
)

function showbooks(books) {
  for (let i = 0; i < books.length; i++) {
    console.log(`${books[i].id} ${books[i].name}`)
  }
}
