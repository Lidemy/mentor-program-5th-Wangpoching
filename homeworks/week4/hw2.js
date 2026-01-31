/*
閱讀開頭給的 API 文件並串接，用 node.js 寫出一個程式並接受參數，輸出相對應的結果，範例如下：

node hw2.js list // 印出前二十本書的 id 與書名
node hw2.js read 1 // 輸出 id 為 1 的書籍
node hw2.js delete 1 // 刪除 id 為 1 的書籍
node hw2.js create "I love coding" // 新增一本名為 I love coding 的書
node hw2.js update 1 "new name" // 更新 id 為 1 的書名為 new name
*/
const process = require('process')
const request = require('request')
const queryString = require('query-string')

const BASE_URL = 'https://lidemy-book-store.herokuapp.com'

// 將 request 的處理統一包裝到 call 裡面, callback 給予 err 以及 JSON.parse(body)
const call = (options, callback) => {
  const queryParams = options.query ? `?${queryString.stringify(options.query)}` : ''
  request[options.method]({
    url: `${BASE_URL}${options.path}${queryParams}`,
    ...(options.body && { form: options.body })
  }, (err, res, body) => {
    if (err) {
      return callback(err)
    }

    if (res.statusCode >= 200 && res.statusCode < 300) {
      try {
        const content = JSON.parse(body)
        return callback(null, content)
      } catch (parseErr) {
        return callback(parseErr)
      }
    }

    if (res.statusCode === 404) {
      return callback(new Error('查無此書'))
    }

    callback(new Error('發生問題'))
  })
}

// 取得前 n 本書籍
const getBooks = (n) => {
  call({
    method: 'get',
    path: '/books',
    query: { _limit: n }
  }, (err, books) => {
    if (err) return console.log(err.message)
    books.forEach((book) => console.log(`${book.id} ${book.name}`))
  })
}

// 取得 id 為 xxx 的書籍
const getSpecificBook = (id) => {
  call({
    method: 'get',
    path: `/books/${id}`
  }, (err, book) => {
    if (err) return console.log(err.message)
    console.log(`${book.id} ${book.name}`)
  })
}

// 刪除 id 為 xxx 的書籍
const deleteBook = (id) => {
  call({
    method: 'delete',
    path: `/books/${id}`
  }, (err, book) => {
    if (err) return console.log(err.message)
    console.log(`${book.id} ${book.name}`)
    console.log('刪除成功')
  })
}

// 新增書名為 xxx 的書籍
const addBook = (name) => {
  call({
    method: 'post',
    path: '/books',
    body: { name }
  }, (err, book) => {
    if (err) return console.log(err.message)
    console.log(`${book.id} ${book.name}`)
    console.log('新增成功')
  })
}

// 更新 id 為 xxx 的書名為 ooo
const updateBook = (id, name) => {
  call({
    method: 'patch',
    path: `/books/${id}`,
    body: { name }
  }, (err, book) => {
    if (err) return console.log(err.message)
    console.log(`${book.id} ${book.name}`)
  })
}

// 主程式
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
