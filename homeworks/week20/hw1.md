# 十六到二十週心得

## **第十六週**

----------------------------------

> 一窺 JavaScript 的設計理念

### **變數模型**

從變數的資料型態開始著手，知道了 JavaScript 裡把資料定義為 Primitive type 以及 Object。其中最重要的是知道 Primitive type 還有 Object 的存儲方式。

每次只要又亂掉便會去找[從博物館寄物櫃理解變數儲存模型](https://hulitw.medium.com/variable-and-frontdesk-a53a0440af3c)，看了這麼多 huli 寫的文章，我最喜歡的還是這一篇以及[從傳紙條輕鬆學習基本網路概念](https://hulitw.medium.com/learning-tcp-ip-http-via-sending-letter-5d3299203660)。

其中我覺得最受用的莫過於文章最後的圖了

![img](https://i.imgur.com/UiLaP2n.jpg)

`變數名稱是標籤；Promitive type 存原始值；Object 存指標`。看了圖問題都迎刃而解!

還有一些有趣的東西我覺得可以註記一下。
* `Object.prototype.toString.call()` 判斷型別
* [typeof null === Object](https://2ality.com/2013/10/typeof-null.html) 的 bug
* NaN !== NaN
* 確保型別不是 undefied 的寫法:

```js
if (typeof a !== 'undefined')
```

**推薦文章:**
* [從博物館寄物櫃理解變數儲存模型](https://hulitw.medium.com/variable-and-frontdesk-a53a0440af3c)
* 關於 arguments 的拷貝可以參考[深入探討 JavaScript 中的參數傳遞：call by value 還是 reference？](https://blog.huli.tw/2018/06/23/javascript-call-by-value-or-reference/)

### **JavaScript 的引擎的運作機制**

有關於 JS 的引擎如何編譯 JS 程式碼，Stack 是一個裝著許多 Execution Context 可能是最必要知道的事，這些 Execution Context 不停地產生並且消失，直到 Stack 被清空。

變數提升會在進入一個 Execution Context 的時候進行，之後才會開始執行，這很大程度的讓 JavaScript 變得更加靈活。

函式在被宣告的時候會建立 Scope 屬性，因為這個特性，變數如果在現有的 Execution Context 找不到要如何繼續往上查找這件事，便與函式在哪裡被宣告習習相關，有一個名詞 `Lexical Scope` 指的就是這個特性。

有一個我覺得很值得仔細思考的是 [function declaration 以及 function expression 在變數提升的階段的行為差異](https://github.com/Lidemy/mentor-program-3rd-ClayGao/pull/24)。

基本上 function declaration 會在初始化的時候將函式的 scope 屬性設定好，將整個物件存進記憶體，再把 function 的名字用來創造 variable object 的屬性，並指向這個含是在記憶體的位置。

function declaration 會在執行到它的時候將函式的 scope 屬性設定好，將整個物件存進記憶體，對，就只是這樣。

**推薦文章:**
* [function declaration 以及 function expression 在變數提升的階段的行為差異](https://github.com/Lidemy/mentor-program-3rd-ClayGao/pull/24)
* [我知道你懂 hoisting，可是你了解到多深？](https://blog.huli.tw/2018/11/10/javascript-hoisting-and-tdz/)
* JavaScript 是如何被執行的
  * https://lidemy5thwbc.coderbridge.io/2021/08/13/javascript-runtime-1/
  * https://lidemy5thwbc.coderbridge.io/2021/08/13/javascript-runtime-2/
  * https://lidemy5thwbc.coderbridge.io/2021/08/13/javascript-runtime-3/
  * https://lidemy5thwbc.coderbridge.io/2021/08/13/javascript-runtime-4/
  * https://lidemy5thwbc.coderbridge.io/2021/08/13/javascript-runtime-5/

### **Clousre 的應用**

Clousure 的實際應用都仰賴於 JS 的 scopechain，白話一點是乍看之下應該已經被清除的變數還活著。

主要有練習到三個有關 Closure 的有趣應用，分別是 `throttle`、`debounce` 以及 `cache`

#### **throttle**

throttle 可以保證事件被觸發的間隔時間大於一定值，不想讓瀏覽器一值偵測到下拉結果瘋狂載入就可以使用，以下是我在
[Twitch Top Games](http://18.223.172.223/twitch-hot/) 的實際應用。

```
function throttle(func, timeout) {
  let isClose = false
  let timer;
  const page = document.documentElement
  return function () {
    if (page.scrollHeight - window.innerHeight * 0.05 <= page.scrollTop + window.innerHeight) {
      if (isClose) return
    
      isClose = true
      func.apply(this, args)
      timer = setTimeout(function () {
        isClose = false
      }, delay)
    }
  }
}
```
可以看到在第一次的事件執行之後，閥門關起，時間到之後閥門才會再打開。這樣我們可以達到節流的效果。

#### **debounce**

debounce 會從最後一次觸發開始，在 t秒後執行函數，這個東西在輸入框就會異常的好用，當使用者瘋狂輸入的時候，都不會有反應，等到使用者停下來了，才一次獲取關鍵字。

我用到 debounce 的時機是部落格的暫時儲存功能，防止使用者文章打一堆，結果手殘關掉瀏覽器東西都沒了。下面是節錄自[部落格](https://blog.bocyun.tw/blog/4q6rxvk7)的 debouce。

```js
function debounce(func, delay=5000) {
  let timer = null;   
  return () => {
    let context = this;
    let args = arguments;   
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay)
  }
}
contentInput.addEventListener('keyup', debounce(contentStorage))
```

#### **memorize**

Clousure 最簡單的使用就是拿來當作 cache，舉個範例。

```
function memoize(fn) {
  let result = {};
  return function (num) {
    if (num in result) {
      return result[num];
    }
    result[num] = fn(num);
    return result[num];
  };
}
function square(num) {
  return num * num
}
const cache = memoize(square)
cache(2) // calculating 4
cache(2) // direct return 4
```
每次計算過的結果都會被 cache 起來，下次計算的時候先撈 cache 的結過果，沒有才計算。

**推薦文章:**
* [所有的函式都是閉包：談 JS 中的作用域與 Closure](https://blog.huli.tw/2018/12/08/javascript-closure/)

### **物件導向**

JavaScript 的物件導向對我來說還滿有趣的，因為實際上就算是在 ES6 的 class 也不是一個物件，只是一個語法糖。

為了要實作物件導向的特性，最重要的特性有幾個：
1. 可以產生實體
2. 有 constructor 可以初始化實體
3. 實體有共享的方法

為了達成 1 與 2 的功能，JavaScript 讓函式本身便可以當作 constructor，使用 new constructor 的用法新增一個物件並初始化。

接著為了讓所有實體都有共享的方法，將實體的 __proto__ 屬性指向 constructor 的 prototype 屬性，如此一來這些共享的方法都實際上只被存取一次。

**推薦文章:**
* [該來理解 JavaScript 的原型鍊了](https://blog.huli.tw/2017/08/27/the-javascripts-prototype-chain/) 
* [从__proto__和prototype来深入理解JS对象和原型链](https://github.com/creeperyang/blog/issues/9)
* [静態屬性與靜態方法](https://zh.javascript.info/static-properties-methods)

### **同步以及非同步**

同步執行代表需要互相等待，後面的程式碼比需等待前面的程式碼執行結束才可以執行。如果程式碼並沒有前後相依的關係，非同步的程式碼便會省去許多時間。

可惜的是，不是所有東西想要非同步就可以非同步，除非是別人提供的 API，這樣子才有機會將事情轉交給別人做，因而達成非同步的效果。當然也可以選擇等待，因為後頭的程式碼也許需要這筆資料，這時候可以使用 async, await 的語法。

這些可以非同步進行的 API 包含讀檔或是發送 request 等等，還有一個小問題是如果採用非同步進行，那麼回呼函式會在甚麼時候被呼叫。這些回呼函式會排隊，等待 Stack 空了以後一一被呼叫。

有一點要注意的是，當 Stack 空了以後，如果有 render 的事件會優先排進去。

**推薦文章:** 
* [What the heck is the event loop anyway? | Philip Roberts | JSConf EU](https://www.youtube.com/watch?v=8aGhZQkoFbQ) 
* [JavaScript 中的同步與非同步（上）：先成為 callback 大師吧！](JavaScript 中的同步與非同步（上）：先成為 callback 大師吧！)
* [JavaScript Promise 全介紹](https://wcc723.github.io/development/2020/02/16/all-new-promise/)

### **神秘的 function**

JavaScript 裡的 function 真的很有趣，可以直接呼叫(IIFE)，可以 declartion，可以用 expression，expression 還分匿名以及有名字的，可以當參數傳來傳去。

有一些冷門的屬性，比如說 `constructor`, `arguments`，`caller`，`callee` 等等。

不過我覺得最有趣的還是關於 function expression 裡面匿名還有有名字的區別。下面是從[覺得 JavaScript function 很有趣的我是不是很奇怪](https://blog.huli.tw/2020/04/18/javascript-function-is-awesome/)引用的程式碼：

```
function run(fn, n) {
  console.log(fn(n)) // 55
}

run(function fib(n) {
  if (n <= 1) return n
  return fib(n-1) + fib(n-2)
}, 10)
```

幫 function expression 命名就可以在內部自己呼叫，超級實用，另外命名在追蹤錯誤的時候也是一大利器，因為如果沒有命名，會被瀏覽器命名為 anonymous。

**推薦文章:**
* [覺得 JavaScript function 很有趣的我是不是很奇怪](https://blog.huli.tw/2020/04/18/javascript-function-is-awesome/)
* [function declaration 以及 function expression 在變數提升的階段的行為差異](https://github.com/Lidemy/mentor-program-3rd-ClayGao/pull/24)

### **this**

this 就我的理解命名的很精準，因為 this 是動態的，就好比你在哪裡看到它，它就是你現在看到的「這個」東西。
可以說根 Lexical Scope 是完全兩個流派。

在物件導向裡面，this 很簡單，它指的是被產生的實例。但是在一般的函式宣告裡，也可以調用 this，這就有點麻煩了。

this 可以被直接綁定，假設 xxx 是一個函式，`xxx.call(this ,...arguments)` 以及 `xxx.aapply(this, arguments)` 都可以在第一個參數綁定 this 的值。 bind 也可以綁定 this 的值，`const aaa = xxx.bind(this)`，不過它的作用是回傳一個被綁定 this 值的函式。

如果不綁定 this 的話，可以用 **call 大法** 來預測 this 的值。我們可以這樣想像：
`a.test() // a.test.call(a)`，很明顯的 this 的值與函式在哪裡被呼叫有直接關係。

如果是箭頭函式裡的 this，又不一樣了，主要是因為在箭頭函式的 Execution Context 的 Arguments Object 並不會加進 this。所以箭頭函式的 this 會 refer 到它被定義的地方的 this。有點難懂，但下面的推薦文章裡有範例。

**推薦文章:**
* [淺談 JavaScript 頭號難題 this：絕對不完整，但保證好懂](https://blog.huli.tw/2019/02/23/javascript-what-is-this/)


## **第十七週**

----------------------------------

> 用 express 寫一個部落格!

### **Express 底層**

所謂 Server 其實就是一支程式，這支程式要做的事就是監聽 port 以及處理進入這個 port 的 request，在 nodeJS 比較底層的 Server 可以用 http 這個模組來實現。

Express 模組是根據 http 模組去封裝的，所以Express 裡 res, req 所帶的屬性與方法都與 http 模組裡 http.createServer(func) func 被帶進去的值是同一個東西。

### **Express**

#### Express VS Apache

在之前用 Apache 加 PHP 寫部落格的時候，因為是根據檔案系統來對應 request 的，所以一個 request 地址就要對應一個檔案，我想做一個大家都可以申請的部落格，比如說 aaa 的主頁是 blog.com/aaa；
bbb 的主頁是 blog.com/bbb，那我的檔案數量也太可怕了，只好作罷。

不過 Express 可以在 Server 端定義針對每個 routing 要如何回應，甚至以剛剛的例子來說，blog.com/xxx，其中 xxx 可以以變數來接收，如此一來我便可以輕易做出多人申請的部落格。

此外，Apache + PHP 的架構裡，PHP 都會先被執行才輸出 HTML，造成 PHP 與 HTML 語法錯綜複雜的噁爛情況。

#### MVC

MVC 是一種實作 Server 的架構，由 Model、Controller 以及 View 所組成。

Model 負責提供資料處理的 API，諸如撈取、新增、刪除、編輯等等。View 負責提供要被渲染的 Template。最後由 Controller 來使用 Model 的 API、跟 View 拿模板，以及處理一些邏輯的判斷。

下面的圖用來粗略的簡介 MVC 的架構

![img](https://i.imgur.com/7vvb2lx.png)

#### Middleware

Express 可以透過許多 Middleware 來處理 request，然後不斷的轉交控制權直到發出 response 為止。 這些 Middleware 就是一個個的函式，可以拿來操控 request 與 response，並決定何時轉交控制權。

以下是幾個被寫出來的常用的 Middleware

* body-parser: 會幫 resquest 物件創建好 body 屬性，這樣之後使用者才可以取得 Post 的資料
* express-session: 可以充當 session 機制，會在 response header 新增 set cookie 以及將 request 裡的 cookie 拿來找對應的 session 等等
* connect-flash: connect-flash 是依賴 express-session 的套件，它可以在幫 session 新增一個屬性 flash，flash 可以設定 key 以及 value，但有趣的是一旦使用者獲取這對 key 以及 value，就會用後即焚。這樣的屬性最適合搭配錯誤訊息加上頁面跳轉的組合拳。

當然也可以自己寫 Middleware，比如說一個驗證是否登入以及檢查是不是管理員身分的的 Middleware，像下面這個樣子：

```js
app.use(async(req, res, next) => {
  let isLogin = false
  let isAdmin = false
  if (req.session.username) {
    isLogin = true
    const { username } = req.session
    const user = await User.findOne({
      where: {
        username
      }
    })
    if (user.identity === 1) {
      isAdmin = true
    }
  }
  res.locals.isLogin = isLogin
  res.locals.isAdmin = isAdmin
  next()
})
```

### **Sequelize**

說到 Sequelize 就要提到 ORM(Object Relational Mapping)，如果使用比較底層的套件，比如說 mysqljs，我們需要先建立連線，然後對這個東西下 sql query，才可以操作資料庫。

但如果，我們將資料庫的 table 對應到一個物件，**然後對這個物件執行 edit, find, delete** 等等方法，就可以改動到 table，這樣就可以大大的降低操作資料庫的上手難度，因為 sql query 都被封裝進這些方法裡了!

要達成這件事可以使用 Sequelize，我們可以定義許多 table 的 schema，然後再一起創建，這些 table 都會對應到一個物件，我們便可以輕鬆對這些物件做 CRUD。

如果再更偷懶一點，我們可以使用 sequelize-cli 套件，我們只要寫簡單的 CLI 指令，便可以輕易的產生定義 table schema 以及實際創建 table 的指令的 js 檔，我們可以繼續透過 CLI 來自動執行這些 js 檔案。我們也可以追蹤創建 table 以及修改 table schema 的版本紀錄，並且在各個版本間來回也沒問題。

### **實作部落格的挑戰**

之前因為把心力都花在做留言板，所以下定決心要把功能做好一點。
這次的部落格較 PHP 版本的部落格升級了這些功能:

* 由個人部落格升級為部落格平台
* 串接 CKEditor
* 文章分類功能
* 文章自動暫存機制
* 分頁機制
* 關於我

其中因為要做成平台，路由設計是最耗費心神的。

* 部落格連結: https://blog.bocyun.tw/login

### **上傳圖片功能**

17 週除了做留言板以外，還實作了餐廳抽獎系統的後台，這樣一來，勢必要想辦法上傳獎品照片，可以在自己的資料庫存照片，或是把照片存在別人家的 Server，當然非 imgur 莫屬了。

要控管照片上傳的品質與檔案類型等等，可以利用 middleware `multer` 代勞，接著使用 imgur 的 API 上傳。 說起來不難，但也搞了三天...

**參考資源**
* 開通 imgur APP 與 imgur API 使用: [Imgur API：upload, load 上傳、讀取 心得筆記](https://www.letswrite.tw/imgur-api-upload-load/)
* imgur 官方 API 文件: [Imgur API](https://apidocs.imgur.com/)
* multer: [使用 Multer 實作大頭貼上傳](https://medium.com/%E9%BA%A5%E5%85%8B%E7%9A%84%E5%8D%8A%E8%B7%AF%E5%87%BA%E5%AE%B6%E7%AD%86%E8%A8%98/%E7%AD%86%E8%A8%98-%E4%BD%BF%E7%94%A8-multer-%E5%AF%A6%E4%BD%9C%E5%A4%A7%E9%A0%AD%E8%B2%BC%E4%B8%8A%E5%82%B3-ee5bf1683113)

### **Nginx + pm2 部屬與反向代理**

最後到了部署的階段，幸好之前已經寫過了 XDD
詳細流程都在[這裡](https://lidemy5thwbc.coderbridge.io/2021/09/09/ngix/)。

## **第十八週**

----------------------------------

> 你能做出一個完整的餐廳網站嗎?

第 18 週的內容讓人更興奮了，要做出完整的餐廳網站，可以有購物車、串金流以及查看訂單的功能。看了 zeplin 上的線稿是自己很喜歡的樣式，所以決定好好做。

### **購物車以及訂單功能**

購物車、訂單與庫存是習習相關的。比如說要考慮幾件事:

* 商品要加入購物車會去檢查庫存有沒有剩
* 購物車送出會實際扣除庫存、增加銷售量，但一樣要確保庫存有沒有剩
* 訂單狀態如果取消要幫庫存補回、銷售量回復回原來的數量

資料庫的設計也是要考慮的，讓我苦惱有點久的地方是要如何儲存訂單，因為一個訂單可能內含了許多商品，我思考要不要用 JSON 的方式把一張訂單裡的商品都寫進 JSON。

但是幸好在搜尋如何設計訂單表以後，決定把訂單表與訂單詳情表分開。訂單表紀錄訂單的流水號、訂單狀態與金額。訂單詳情表紀錄著訂單裡的詳細資訊，每項商品都是一列資料。訂單詳情表與菜單關聯同時也與訂單表關聯。

在刻前台的查詢訂單頁面的時候碰上了問題，想要把 form 的送出鈕做成搜尋的圖像，但發現 input 標籤無法再塞其他標籤。最後發現了神奇的 input 屬性

```
<input type="image" src="xxx" />
```
這樣便順利解決了。

**參考文章**
* [設計訂單表](https://zq99299.github.io/mysql-tutorial/ali-new-retail/04/08.html#%E5%88%9B%E5%BB%BA%E8%AE%A2%E5%8D%95%E8%A1%A8)

### **transaction 以及 rollback**

在實作的過程中，前台的一個操作可能要讓後端對資料庫進行一系列的操作。這時候我想到之前有說過可以把一系列的動作封裝進 transaction，這樣便可以確保一旦其中丟出錯誤，之前的操作都會被 redo。

比如說送出購物車的動作，後台需要：
1. 逐一檢查各項商品的庫存確認商品都夠
2. 在訂單表創建訂單(為了產生流水號)
3. 將購物車的商品一一寫進訂單詳情表並計算累積金額
4. 將最後的累積金額寫進訂單表
5. 清空購物車

我猜 sequelize 肯定提供簡單的 API 讓我們使用 transaction，果不其然官方文件寫的簡單又清楚。

**參考文章**
* [sequelize 官方文件](https://sequelize.org/master/manual/transactions.html)

### **串接金流**

要如何串接金流這方面我選擇使用藍新金流，首先要在官網先開設網路商店，取得商家編號以及 HASH 的資訊。

接著參考官方 API 串接手冊研究需要 POST 給第三方金流的參數，比較麻煩的是這些參數需要先 HASH。

交易以後要等待第三方金流回傳交易結果，可以設定背景接收以及前台接收。背景接收會由第三方金流直接對餐廳網站發送交易結果，所以只有餐廳後台會收到；前台接受的模式則是回傳 302 讓前端導向餐廳指定的網址。

也就是說打開瀏覽器 devtool 只看到的到前台接收的部分，但實際上餐廳的 server 兩種接收方式都會收到。

**20211104 更新**

每次串完金流明明要導回訂單查看頁面卻都返回登入頁面，檢查 devtool 確實有導到訂單查詢頁，但又 302 導向到登入。

仔細看才發現訂單查看頁面的 response 竟然有 setCookie 的 header，也就是說在請求訂單頁面的時候 sessionId 沒有被 cookie 帶上。

所以是 sameSite 搞的禍，因為請求訂單頁面是由第三方金流發起的，所以不會帶上餐廳網站的 sessionId，最後調整 express-session 的 cookie 設定才解決

**參考文章**
* [藍新金流串接實作](https://ctaohe.github.io/2019/10/19/2019-10-19_newebpay/)
* [藍新金流 API 文件下載](https://www.newebpay.com/website/Page/content/download_api)

### **寄信功能**

如果想要有寄信的功能，可以在自己的主機架 mail server，也可以使用第三方的 mail server，我使用的是第三方 mail server - AWS SES。不過還要申請開通權限，不然要只能寄信給被驗證的信箱。

**參考文章**
* [How to Send Emails With Node.js Using Amazon SES](https://betterprogramming.pub/how-to-send-emails-with-node-js-using-amazon-ses-8ae38f6312e4)

## **第十九週**

----------------------------------

> 如何開發一個軟體產品

在辛苦的完成兩個網站的開發以後，回歸到學習要如何去設計一個軟體產品，軟體產品有一些它比較特別的特性，比如說它可以在短時間內針對顧客的回饋不斷修正。

### **軟體開發論**

#### 瀑布流

瀑布流的開發方法是從頭到尾的，由蒐集需求、設計、開發、驗證、維護，每個步驟做完就進入下一個步驟，最後交付產品。瀑布流的開發方法很適合客戶有明確的需求與交付時間的情況。

#### 敏捷

敏捷其實不是一個方法論，它比較像是一些原則，符合這些原則的方法都可以稱作是敏捷方法的實作。其中有幾個我認為很重要的特質：

* 團隊定期反思
* 開發團隊與客戶的討論
* 以最短的頻率持續交付可使用的軟體
* 客戶可以不斷變化的要求來增加產品的競爭優勢

敏捷適合用在新開發的專案，要進入市場試試水溫，可以依據市場的反應迅速調整功能。

### **測試**

關於寫單元測試，我最感興趣的是 TDD（Test-Driven Development），主要就是先寫測試再開發，先思考使用者會想要怎麼樣的輸出結果，因為產品最後要給使用者使用，很合理吧!

步驟是這樣子的：
1. 寫測試
2. 紅燈測試
3. 開發最低需求
4. 綠燈測試
5. 優化

關於 JS 的 unit test 的自動化執行，推薦使用 [Mocha](https://mochajs.org/) 搭配斷言庫使用。

**參考文章**
* [TDD 開發五步驟，帶你實戰 Test-Driven Development 範例](https://tw.alphacamp.co/blog/tdd-test-driven-development-example)
* [前端單元測試入門 — Mocha與chai](https://medium.com/@bebebobohaha/%E5%89%8D%E7%AB%AF%E5%96%AE%E5%85%83%E6%B8%AC%E8%A9%A6%E5%85%A5%E9%96%80-mocha%E8%88%87chai-b3037b3a1de1)


### **部屬**

部屬可以分許多環境。
* local
* development
* staging
* production

工程師在開發的時候可能會先在本機邊測試邊開發，之後丟到 development server 上用假資料試跑。接著部屬到 staging server 讓 qa 可以測試，最後部屬到 production server 讓所有使用者使用。

## **複習週**

----------------------------------

> 慢吞吞網速優化挑戰

複習週看到了比前三次複習週更有趣的挑戰，要挑戰優化網頁的載入速度。

之前都是在心裡思考而已，比如說製作雪碧圖，或是壓縮 JS 以及 CSS 等等。但是真的一個慢吞吞的網站要我診斷，我還真的不知道該怎麼下手。

### **實際測試瀏覽器執行外部資源的順序**

為了實際測試 DOM、CSSOM、JS 與 CSS 彼此的建立、下載、執行與互相 block 的關係，我找到了一篇很棒的文章，裡面有 [github](https://github.com/ljf0113/how-js-and-css-block-dom)的連結，可以刻意讓後端延遲響應外部資源的速度來觀察彼此是否有互相等待的情形。

這邊總結下實測的結果:

* CSS 不會 block DOM 的解析，但是會 block Render Tree
* JS 會 block DOM 的解析，而且如果前面有 CSS 資源要等待 CSSOM 建立
* 瀏覽器遇到 `<script>` 標籤且没有 defer 或 async 屬性的時候，會觸發 Render

**參考資源**
* [how-js-and-css-block-dom](https://github.com/ljf0113/how-js-and-css-block-dom)

### **Udacity-webPerformance Optimization**

Udacity 的這堂課把如何解析 DOM、如何解析 CSSOM 以及如何產出 Render Tree 說的滿清楚的。

瀏覽器會先把 html 的標籤轉成一個個的令牌，同時消耗這些令牌來建立 DOM 關係。打個比方，令牌的順序如果是 

Head Start tag --> Meta Start tag --> Meta End tag --> Head End tag

在消耗到第二個令牌的時候便可以知道 Head 是 Meta 的父元素，這就是為甚麼瀏覽器可以一邊產生令牌一邊產生 DOM Tree 的原因。

**參考資源**
* [Udacity webPerformance Optimization](https://classroom.udacity.com/courses/ud884/)

### **網速優化挑戰**

經過前面的練習最後終於有信心來挑戰網速優化挑戰了，不過在刪除冗碼以及壓縮 CSS 以及 JS 檔案以後便黔驢技窮了，但明明知道圖片才是最肥胖的殺手。

在檢查冗碼的過程中，也意外發現了一些厲害的前端套件。`slick` 可以輕鬆製作幻燈片，`typed` 則可以製作文字跑馬燈。

最後根據網站製作者 [yakim-shu]( https://github.com/Lidemy/lazy-hackathon/issues/7) 的優化流程處理圖片，遭遇了許多困難，要自己找套件，最可怕的是要跳進去 SCSS 改動內容，常常改這邊壞那邊。

但最後學的很扎實，也很有成就感，也稍微碰了一點 PhotoShop，最後把血淚的優化流程都放上[部落格](https://lidemy5thwbc.coderbridge.io/2021/10/30/page-speed-insight/)了。


**參考資源**
* [Lazy Hackathon](https://lidemy.github.io/lazy-hackathon/)
* [實戰 Lazy Hackathon 心得](https://lidemy5thwbc.coderbridge.io/2021/10/30/page-speed-insight/)

### **學習系統後台導覽**

看一個專案首先要看 package.json 裡的 script，比較有趣的是有一個 [nodemon](https://www.npmjs.com/package/nodeom) 套件可以自動偵測 js 檔案有沒有變化並重新執行。

學習系統的後台導覽是前後端分離的，所以首先要用到的就是 cors 了。後端變成都是 API 的形式，沒有 view，這樣後端感覺又更乾淨了一些。

在第一次登入的時候會做第三方認證，這時候前端會傳送它拿到的 token 給後端，後端將 token 解碼以後便可以取得用戶的資料以便在本地創建使用者。 之後發的 API 都要再確認一次在 header 裡的 Token，才可以執行 API 的後續操作。

其他比較實用的地方像是把錯誤給另外整理起來、時間的轉換還有使用類似 closure 的語法來生成可以驗證不同的函式都很實用。

最後還有一個特別的關於 object 的用法，可以省去判斷`如果 xxx 就在物件插入 ooo 的語法`。

```js
const a = {
  ...(condition && iterable obj)
}
```
利用 && 的特性，如果前者的布林值是 true 便取後面的值、如果前者的布林值是 false 便取前面的值的特性，便可以達到判斷要不要新增物件內容的功能。





