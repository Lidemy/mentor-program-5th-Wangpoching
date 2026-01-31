/*
Base URL: https://lidemy-book-store.herokuapp.com

說明         Method  path        參數                    範例
獲取所有書籍  GET     /books      _limit:限制回傳資料數量  /books?_limit=5
獲取單一書籍  GET     /books/:id  無                      /books/10
新增書籍      POST    /books      name: 書名             無
刪除書籍      DELETE  /books/:id  無                     無
更改書籍資訊  PATCH   /books/:id  name: 書名             無

node hw1.js

1 克雷的橋
2 當我想你時，全世界都救不了我
3 我殺的人與殺我的人
....
*/

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
