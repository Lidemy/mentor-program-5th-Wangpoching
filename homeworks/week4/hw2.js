const BASE_URL = 'https://lidemy-book-store.herokuapp.com'
const request = require('request')
const process = require('process')

function getBooks(n) {
  request(`${BASE_URL}/books?_limit=${n}`, (error, response, body) => {
    if (error) {
      console.log(error)
      return
    }
    if (response.statusCode >= 200 && response.statusCode < 300) {
      let books
      try {
        books = JSON.parse(body)
      } catch (error) {
        console.log(error)
        return
      }
      for (const value of books) {
        console.log(`${value.id} ${value.name}`)
      }
      return
    }
    console.log('something went wrong')
  })
}

function getBook(id) {
  request(`${BASE_URL}/books/${id}`, (error, response, body) => {
    if (error) {
      console.log(error)
      return
    }
    if (response.statusCode >= 200 && response.statusCode < 300) {
      let book
      try {
        book = JSON.parse(body)
        console.log(`${book.id} ${book.name}`)
        return
      } catch (error) {
        console.log(error)
        return
      }
    }
    if (response.statusCode === 404) {
      let parsedBody
      try {
        parsedBody = JSON.parse(body)
        if (!Object.keys(parsedBody).length) {
          console.log('查無此書')
          return
        }
      } catch (error) {
      }
      console.log('發生問題')
      return
    }
    console.log('發生問題')
  })
}

function createBook(name) {
  request.post({
    url: `${BASE_URL}/books`,
    form: { name }
  }, (error, response, body) => {
    if (error) {
      console.log(error)
      return
    }
    if (response.statusCode >= 200 && response.statusCode < 300) {
      let book
      try {
        book = JSON.parse(body)
        console.log(`${book.id} ${book.name}`)
        console.log('新增成功')
        return
      } catch (error) {
        console.log(error)
        return
      }
    }
    console.log('發生問題')
  })
}

function deleteBook(id) {
  request(`${BASE_URL}/books/${id}`, (error, response, body) => {
    if (error) {
      console.log(error)
      return
    }
    if (response.statusCode >= 200 && response.statusCode < 300) {
      let book
      try {
        book = JSON.parse(body)
      } catch (error) {
        console.log(error)
        return
      }
      console.log(`${book.id} ${book.name}`)
      console.log('刪除成功')
      return
    }
    if (response.statusCode === 404) {
      let parsedBody
      try {
        parsedBody = JSON.parse(body)
        if (!Object.keys(parsedBody).length) {
          console.log('查無此書')
          return
        }
      } catch (error) {
      }
      console.log('發生問題')
      return
    }
    console.log('發生問題')
  })
}

function updateBook(id, name) {
  request.patch({
    url: `${BASE_URL}/books/${id}`,
    form: { name }
  }, (error, response, body) => {
    if (error) {
      console.log(error)
      return
    }
    if (response.statusCode >= 200 && response.statusCode < 300) {
      let book
      try {
        book = JSON.parse(body)
      } catch (error) {
        console.log(error)
        return
      }
      console.log(`${book.id} ${name}`)
      return
    }
    if (response.statusCode === 404) {
      let parsedBody
      try {
        parsedBody = JSON.parse(body)
        if (!Object.keys(parsedBody).length) {
          console.log('查無此書')
          return
        }
      } catch (error) {
      }
      console.log('發生問題')
      return
    }
    console.log('發生問題')
  })
}

function main() {
  switch (process.argv[2]) {
    case 'list':
      getBooks(20)
      break
    case 'read':
      getBook(process.argv[3])
      break
    case 'delete':
      deleteBook(process.argv[3])
      break
    case 'create':
      createBook(process.argv[3])
      break
    case 'update':
      updateBook(process.argv[3], process.argv[4])
      break
    default:
      console.log(
`
command not found!
node hw2.js list: 印出前二十本書的 id 與書名
node hw2.js read 1: 輸出 id 為 1 的書籍
node hw2.js delete 1: 刪除 id 為 1 的書籍
node hw2.js create 'I love coding': 新增一本名為 I love coding 的書
node hw2.js update 1 'new name': 更新 id 為 1 的書名為 new name
`)
  }
}

main()
