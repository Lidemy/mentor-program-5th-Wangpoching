const request = require('request')
const process = require('process')

function list() {
  request(
    'https://lidemy-book-store.herokuapp.com/books',
    (error, response, body) => {
      if (error) {
        console.log(error)
        return
      }
      let books
      try {
        books = JSON.parse(body)
      } catch (err) {
        console.log(err)
        return
      }
      for (let i = 0; i < books.length; i++) {
        console.log(`${i + 1} ${books[i].name}`)
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
        return
      }
      let book
      try {
        book = JSON.parse(body)
      } catch (err) {
        console.log(err)
        return
      }
      console.log(`${id} ${book.name}`)
    }
  )
}

function delBook(id) {
  request.delete(
    `https://lidemy-book-store.herokuapp.com/books/${id}`,
    (error, response, body) => {
      if (error) {
        console.log(error)
        return
      }
      console.log('delete sucessfully')
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
        return
      }
      console.log('add successfully')
    }
  )
}

function updateBook(id, name) {
  request.patch(
    {
      url: `'https://lidemy-book-store.herokuapp.com/books/${id}`,
      form: {
        name
      }
    },
    (error, response, body) => {
      if (error) {
        console.log(error)
        return
      }
      console.log('update successfully')
    }
  )
}

function main() {
  if (process.argv[2] === 'list') {
    list()
  } else if (process.argv[2] === 'read') {
    getBook(process.argv[3])
  } else if (process.argv[2] === 'delete') {
    delBook(process.argv[3])
  } else if (process.argv[2] === 'create') {
    addBook(process.argv[3])
  } else if (process.argv[2] === 'update') {
    updateBook(process.argv[3], process.argv[4])
  }
}

main()
