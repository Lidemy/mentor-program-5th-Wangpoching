const request = require('request')
const process = require('process')

function list() {
  request(
    'https://lidemy-book-store.herokuapp.com/books?_limit=20',
    (error, response, body) => {
      if (error) {
        console.log(error)
      } else if (!error && response.statusCode >= 200 && response.statusCode < 300) {
        let books
        try {
          books = JSON.parse(body)
        } catch (err) {
          console.log(err)
          return
        }
        for (let i = 0; i < books.length; i++) {
          console.log(`${books[i].id} ${books[i].name}`)
        }
      }
    }
  )
}

function getBook(id) {
  request(
    `https://lidemy-book-store.herokuapp.com/books/${id}`,
    (error, response, body) => {
      if (error) {
        console.log(error)
      } else if (!error && response.statusCode >= 200 && response.statusCode < 300) {
        let book
        try {
          book = JSON.parse(body)
        } catch (err) {
          console.log(err)
          return
        }
        if (book.name) {
          console.log(`${book.name}`)
        } else {
          console.log('book does not exist')
        }
      }
    }
  )
}

function deleteBook(id) {
  request(
    `https://lidemy-book-store.herokuapp.com/books/${id}`,
    (error, response, body) => {
      if (error) {
        console.log(error)
      } else if (!error && response.statusCode >= 200 && response.statusCode < 300) {
        let book
        try {
          book = JSON.parse(body)
        } catch (err) {
          console.log(err)
          return
        }
        if (book.name) {
          console.log(`${book.name}`)
          request.delete(
            `https://lidemy-book-store.herokuapp.com/books/${id}`,
            (error, response, body) => {
              if (error) {
                console.log(error)
              } else if (!error && response.statusCode >= 200 && response.statusCode < 300) {
                console.log('delete this book successfully')
              }
            }
          )
        } else {
          console.log('book does not exist')
        }
      }
    }
  )
}

function addBook(name) {
  request.post(
    {
      url: 'https://lidemy-book-store.herokuapp.com/books',
      form: {
        name
      }
    },
    (error, response, body) => {
      if (error) {
        console.log(error)
      } else if (!error && response.statusCode >= 200 && response.statusCode < 300) {
        console.log('add successfully')
      }
    }
  )
}

function updateBook(id, name) {
  request(
    `https://lidemy-book-store.herokuapp.com/books/${id}`,
    (error, response, body) => {
      if (error) {
        console.log(error)
      } else if (!error && response.statusCode >= 200 && response.statusCode < 300) {
        let book
        try {
          book = JSON.parse(body)
        } catch (err) {
          console.log(err)
          return
        }
        if (book.name) {
          request.patch(
            {
              url: `https://lidemy-book-store.herokuapp.com/books/${id}`,
              form: {
                name
              }
            },
            (error, response, body) => {
              if (error) {
                console.log(error)
              } else if (!error && response.statusCode >= 200 && response.statusCode < 300) {
                console.log('update successfully')
              }
            }
          )
        } else {
          console.log('book does not exist')
        }
      }
    }
  )
}

function main() {
  if (process.argv[2] === 'list') {
    list()
  } else if (process.argv[2] === 'read') {
    getBook(process.argv[3])
  } else if (process.argv[2] === 'delete') {
    deleteBook(process.argv[3])
  } else if (process.argv[2] === 'create') {
    addBook(process.argv[3])
  } else if (process.argv[2] === 'update') {
    updateBook(process.argv[3], process.argv[4])
  }
}

main()
