const process = require('process')
const https = require('node:https')
const queryString = require('query-string')

const BASE_URL = 'lidemy-book-store.herokuapp.com'

const call = (options, callback) => {
  const queryParams = options.query ? `?${queryString.stringify(options.query)}` : ''

  const requestOptions = {
    hostname: BASE_URL,
    port: 443,
    path: `${options.path}${queryParams}`,
    method: options.method,
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const req = https.request(requestOptions, (res) => {
    let data = ''

    res.on('data', (chunk) => {
      data += chunk
    })

    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const content = JSON.parse(data)
          callback(null, content)
        } catch (parseErr) {
          callback(parseErr)
        }
      } else if (res.statusCode === 404) {
        callback(new Error('查無此書'))
      } else {
        callback(new Error('發生問題'))
      }
    })
  })

  req.on('error', (e) => {
    callback(e)
  })

  // 如果有 body，需要寫入
  if (options.body) {
    req.write(JSON.stringify(options.body))
  }

  req.end()
}

const getBooks = (n) => {
  call({
    method: 'GET',
    path: '/books',
    query: { _limit: n }
  }, (err, books) => {
    if (err) return console.log(err.message)
    books.forEach((book) => console.log(`${book.id} ${book.name}`))
  })
}

const getSpecificBook = (id) => {
  call({
    method: 'GET',
    path: `/books/${id}`
  }, (err, book) => {
    if (err) return console.log(err.message)
    console.log(`${book.id} ${book.name}`)
  })
}

const deleteBook = (id) => {
  call({
    method: 'DELETE',
    path: `/books/${id}`
  }, (err, book) => {
    if (err) return console.log(err.message)
    console.log(`${book.id} ${book.name}`)
    console.log('刪除成功')
  })
}

const addBook = (name) => {
  call({
    method: 'POST',
    path: '/books',
    body: { name }
  }, (err, book) => {
    if (err) return console.log(err.message)
    console.log(`${book.id} ${book.name}`)
    console.log('新增成功')
  })
}

const updateBook = (id, name) => {
  call({
    method: 'PATCH',
    path: `/books/${id}`,
    body: { name }
  }, (err, book) => {
    if (err) return console.log(err.message)
    console.log(`${book.id} ${book.name}`)
  })
}

function main() {
  switch (process.argv[2]) {
    case 'list':
      getBooks(20)
      break
    case 'read':
      getSpecificBook(process.argv[3])
      break
    case 'delete':
      deleteBook(process.argv[3])
      break
    case 'create':
      addBook(process.argv[3])
      break
    case 'update':
      updateBook(process.argv[3], process.argv[4])
      break
    default:
      console.log('Please use list/read/delete/create/update')
  }
}

main()
