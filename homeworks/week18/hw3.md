## 什麼是反向代理（Reverse proxy）？

之前使用過 apache 搭配 php 寫的後台，現在開始利用 nodejs express 寫後端，又遇到了要架伺服器的時候了，express 比較特別的地方在於，有別於 php 是利用檔案系統來當作路由，**express 的路由是自定義的**，下面是一個取自[express 官方](https://expressjs.com/zh-tw/starter/hello-world.html)的小範例。

```js
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```

可以看到程式碼中設定了 '/' 的路由，會顯示 'Hello World'，另外值得注意的是 port = 3000 這一行，代表這個 express app 是監聽 3000 埠(ㄅㄨˋ)號的，也就是說一支 express 程式其實就是一支後台程式了。

為了方便不同網站之間的管理，通常會將不同網站的程式碼分開寫成不同的 express app，分別交給不同的 port 監聽，因為 **一個 port 只能被一支後台程式占用**。

假設現在我們寫了兩支程式，分別交給 port 3001 以及 3002 監聽，並且把域名 example.tw 給指向主機，這樣一來使用者必須輸入 `https://example.com:3001/` 以及 `https://example.com:3002/` 來獲取對應內容，但這樣很麻煩，誰會去記得 port 號碼呀!

如果在 http/https 專用的 80/443 port 架一台伺服器，然後透過不同的子網域讓這台伺服器把使用者的需求轉交給對應 port 上的伺服器就可以解決這個問題了。聽起來有點抽象，可以看看下面這張圖來了解。

![img](https://i.imgur.com/rHKWLjh.png)

可以看到 example.com 有兩個子網域 aaa.example 以及 bbb.example，使用者造訪這兩個子網域時，預設會讓 80/403 port 上的代理伺服器處理。代理伺服器裡的設定檔設定將 aaa.example.com 的請求送到 3001 port、將 bbb.example.com 的請求送到 3002 port，如此一來使用者便不用輸入埠號了，因為代理伺服器幫忙代勞了。

## 什麼是 ORM？

有沒有覺得 SQL 的語法很麻煩，不同的資料庫有不同的 SQL 語法，對資料庫不外乎進行新增、查詢、編輯、刪除，有甚麼方法可以降低程式與資料庫之間的耦合關係或者簡化 SQL 的語法嗎? 有的，它就是所謂的 ORM。

### ORM

Object-Relational Mapping (ORM)是將關聯式資料庫映射至物件導向的資料抽象化技術，對這個物件進行新增、查詢、編輯、刪除，底層的實作會使用相對應的 SQL 語法去操作資料庫。此時程式設計師不用再去管料庫是使用哪一種類型(如：SQL Server、Oracle、DB2、MySQL、Sybase...)，同一套語法便可以了，這便是因為 ORM 為程式設計師還有資料庫之間搭起了一道橋樑。

也許這麼想 ORM 會更好，它就像一個翻譯，原本你必須會資料庫的語言，用資料庫的語言跟資料庫溝通，但有了 ORM，你可以將需求用你熟悉的物件導向程式語言告訴 ORM，ORM 再用資料庫的語言將你的請求翻譯給資料庫。

![img](https://i.imgur.com/jvY4hd4.png)

### ORM 的優點

1. ORM 可以防止 SQL-Injection 的攻擊
2. 方便轉移資料庫，當資料庫發生改變時，只需要修改映射關係即可
3. 不用考慮該死的 SQL 語句，語法簡化
4. 通用性：
舉例來說下面這兩個 MySQL、MsSQL 的語法做的其實是一樣的事情

```
// MySQL
SELECT * FROM Menu WHERE price=100 LIMIT 10
// MsSQL
SELECT TOP 10 * FROM TestTable WHERE price=100
```

### ORM 的缺點

1. 對於複雜的查詢，ORM 的使用上支援度不好，可能還要額外寫入原生的 SQL 語法。
2. 延伸上一個缺點，使用 ORM 的使用者在需要用到 SQL 語法的時候經常不熟練。

看到一個有趣的關於 Ruby 案例是這樣子的，這便是額外使用原生 SQL 語法的案例。

```Ruby
User.where(“age between ? and ?”,10,30)
```


## 什麼是 N+1 problem？

N + 1 問題涉及到後端效能的問題，很多人可能都聽過，如果沒聽過也沒關係，這篇文章會試圖用比喻的方式模擬 N + 1 問題，並以 sequelize 為例，看看要如何解決這樣的問題。

### 我想做一個提拉米蘇

今天忽然心血來潮想做一個提拉米蘇，想像這樣子的情境：冰箱在儲藏室裡、食譜在書房裡、而你在廚房準備要做提拉米蘇。

首先，你到書房拿了製作提拉米蘇的食譜，並且將它帶到廚房。

你閱讀食譜的第一行：

`馬斯卡彭乳酪 250g`

於是你去儲藏室的冰箱拿出 250 克的馬斯卡彭乳酪。

接著你閱讀食譜的第二行：

`鮮奶油 100ml`

於是你去儲藏室的冰箱拿出 100 毫升的鮮奶油。

最後你閱讀食譜的第三行：

`手指餅乾 10 根`

於是你去儲藏室拿出 10 根手指餅乾。

這樣子來來回回在廚房與儲藏室之間真是讓你累壞了，**其實你正在體驗的，就是 N + 1 problem** 你的 ORM 被迫要在你拿到食譜以後再多做 N 次的查詢 (去儲藏室拿食材 N 趟）。

### 實際案例

現在有一個食譜網站長得像這樣。

巧克力蛋糕     | 蘋果派    | 麵包 
--------------|----------|------    
黑巧克力 200 克|蘋果 4 個  |麵粉 300 克
蛋 3 顆       |蛋黃 1 顆  |水 300 毫升 
奶油 100 克   |奶油 100 克|鹽 1 茶匙
麵粉 50 克    |麵粉 50 克 |麵糰 100 克
糖 100 克     |糖 100 克  |

背後涉及到了兩個 model，分別是 Recipe 以及 Content
Recipe 的每一列記錄了成品的名稱，比如說蘋果派或是麵包；而 Content 的第一欄則以 recipe-name 紀錄對應到的成品名稱，並且記錄了材料的名稱以及數量，比如說：

recipe-name | name    | amount
巧克力蛋糕   | 黑巧克力 | 200 克

所以說**一筆 Recipe 擁有多筆 Content，而一筆 Content 則屬於一筆 Recipe**。

如果是用 express + sequelize 寫的網站，可能會寫這樣的 Controller：

```
// 拿食譜
const recipes = await Recipe.findAll()
const contents = []
// 拿材料
for (const recipe of recipes) {
    const content = await awesomeCaptain.getContents()
    ingredients.push(content)
}
```
食譜上有三種料理，為了把這種料理的食譜給呈現在網站上，我們總共必須造訪資料庫 4 次，**一次拿出整本食譜，另外三次拿出三種料理要用到的食材。**

### 如何解決

我們可以造訪資料庫一次就好嗎? 如果可以在資料庫裏面**把 content 給 join 到 recipe** 便沒問題了，就好像是**在書房拿到食譜以後，先不回廚房，而是先去閣樓的冰箱把食譜上載明要用到的食材都一起拿到廚房去**。

這個動作有一個專有名詞叫做 `eager loading`，以 sequelize 為例，可以將剛剛的程式碼改寫為：
```
// 拿食譜與材料
const recipes = await Recipe.findAll({
    include: Content
})
```

相對於 eager loading 則是 lazy `loading`，當然不是每次都要使用 eager loading，但如果需要或取關聯資料，使用 lazy loading 就好像自己製造了一場 DDoS 的攻擊呢(笑

使用 sequelize 的讀者可以參考 [sequelize 的官方文件](https://sequelize.org/master/manual/assocs.html#lazy-loading-example) 有更多關於 include 的進階用法。














