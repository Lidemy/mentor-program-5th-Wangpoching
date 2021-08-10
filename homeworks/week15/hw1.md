## 十一到十五週心得

### **第十一週**

----------------------------------

> 資訊安全的大坑

#### 偽造身分

在很多網站都有會員登入機制，基於 http/https 本身沒有保存 satage 的機制，會利用 cookie 來保存使用者的登入狀態。 這樣雖然方便卻沒有思考到安全性的問題，因為 cookie 可以被竄改，如果在 cookie 使用帳號之類的公開資訊作為通行證，會使得有心人士可以跳過輸入帳密的步驟成功登入別人的帳號。所以如果可以發給使用者**一組隨機字串**來作為驗證身分用，便很大程度上減低了資安的疑慮。

#### 明文密碼

關於明文密碼的問題一開始我是沒有想過的，因為我沒有去設想到駭客侵入 sever 的情況，但如果想到提供服務端可以看到使用者的密碼等敏感資訊，又何嘗不可怕呢? 在後端資料庫為了將密碼單項加密，會使用各種 **hash** 的演算法，當然對付這種單項的加密，可能會被 key/value 查表的方式暴力破解，關於在加密方式的亂鬥，可以參考[這裡](https://lidemy5thwbc.coderbridge.io/2021/07/01/security/)。

#### XSS

XSS (Cross-Site Scripting) 利用了後端直接把使用者的輸入資訊輸出到前台的漏洞下，趁機插入 JS 程式碼來進行操作，留言板之類的網站最需要防範這種攻擊。XSS 可以進行的攻擊十分廣泛，可以進行 redirect、在網站新增假資訊、偷取 cookie 等等操作（ 如果還有想法歡迎補充 ）。想要防範 XSS 要從 html 讀取程式碼的架構著手，基於 html 程式碼是有許多**標籤**組成，防範的手段就必須把可能會被當作是 html 標籤的可能性給替換掉 (encode)。

#### SQL Ingection

後端直接把使用者的輸入資訊輸出到前台的漏洞除了會影響 html 檔以外，也會影響到 SQL 的語法，影響的原因與 XSS 一樣。如此一來，防範的方法也需要透過跳脫來維持 SQL 語法的原意。 SQL Injection 造成的影響是與資料庫連動的，因此很容易造成資料外洩的後果。如果想看一些有趣的 SQL Injection 攻擊案例，歡迎看[這裡](https://lidemy5thwbc.coderbridge.io/2021/07/01/information-security/)。

#### CSRF

CSRF (Cross site request forgery) ，名如其義就是跨站的偽造請求，在自己的網頁裡隱藏請求，當使用者一造訪就會將請求送出，基於送出請求時瀏覽器會將對應網域的 cookie 一併帶上的情況下，可以成功達到偽造身分的目的，所幸因為 CSRF 的攻擊太過氾濫，各大瀏覽器開始限制跨站請求攜帶 cookie，使得利用 CSRF 的攻擊減少許多。除了被動讓瀏覽器防禦 CSRF 以外，也有主動防範的方法，這些主動防範的方法都離不開**區分是不是第三方網站發出的請求**，詳細的防範方式一樣可以參考[這裡](https://lidemy5thwbc.coderbridge.io/2021/07/01/information-security/)。

#### 留言板資安加強

前幾周持續優化的留言板在第十一週繼續強化，這次進行的是資安的補強，包括**偽造身分**、**明文密碼**、**XSS**、**SQL Ingection**、**CSRF**都進行防範。除此之外也在每個分頁與使用者的操作都加入身分驗證確保繞過登入頁面的情況，一言以蔽之大概就是**永遠不要相信前端來的東西**。

### **第十二週**

----------------------------------

> 前後端各司其職

#### 自己生產 Web API

每次都在用別人的 Web API，第十二週練習自己用 PHP 寫 API，如果想想 API 與一般網頁的差異，可以很清楚地發現就是差在資訊有沒有被渲染而已，網頁的 HTML 會被渲染出來，但 API 的資訊只是單純的文字內容。所以我認為寫 Web API 最重要的地方在於**告知回傳格式的 response header**，必須要正確的告知瀏覽器回傳的資料希望被如何解讀。之後的細節就在於如何設計 API 的參數了，而這感覺也是一個不小的坑。

#### 使用 jQuery

第十二週也引入了一些工具，其中一個是 jQuery，jQuery 將原生的 JS 方法變得簡潔了，不過原本 jQuery 的興起是因為他可以**適用於所有瀏覽器**，在 200x 年代瀏覽器百家爭鳴的時代，同一個功能每個瀏覽器支持的 API 可能都不一樣，因此 jQuery 就像個救世主一樣。 現在雖然 chrome 已經漸漸的大一統了，jQuery 還是有一些語法簡潔的優勢，比如說：

1. chaining
2. 賦值以及取值使用同一個 function

個人覺得是很好的設計理念。

#### 使用 bootstrap

bootstrap 提供了一大堆寫好的 JS 還有 CSS，絕大多數是 CSS，少部分元件結合 JS 可以做變化，可以說是工程師的救星。

bootstrap 有兩個我很喜歡的地方，第一個是在 class name 的部分採用了 functional CSS 來設計，讓元素屬性在 HTML 裡就一清二楚。再來就是網格系統了，利用網格系統搭配 RWD 便可以做出很彈性的變化。

#### API_based 留言板

第十二週做的留言板不同於之前的留言板，後端只負責給模板，主要的內容是由前端 call API 以後用 JS 動態渲染出來的，這也是第十二週的重要概念，這種寫法有一種各司其職的味道，前端負責畫面渲染，後端負責資料與提供 API。

這種做法存在著一些缺點，顯而易見的便是 SEO 的短板，優點是使用者的體驗不會因為網頁頻繁的刷新受到干擾。

想知道更多前後端分離的優點可以參考[這裡](https://lidemy5thwbc.coderbridge.io/2021/07/09/SPA/)。

這個作業有趣的地方是載入更多的功能，有沒有辦法提前知道已經沒有留言了，以避免點了載入更多結果沒有新的的留言跑出來的窘況。我的想法是每次點擊載入更多都會抓兩次留言，但只把第一次抓的留言顯示，第二次的先存著，如此一來就可以提前知道第二次抓到的留言是不是已經把所有留言都抓光了。但還是要記得把第二次的 call API 放在第一次的 Call Back 裡，這一點很容易忘記。

#### To Do List

To Do List 可以說是我之前就很喜歡的一個作業，在第十二週更是新增了清空 todo
以及篩選 todo（全部、未完成、已完成）的功能，除此之外再額外加上註冊系統，每次登入 JS 會呼叫 API 去把上次儲存的 todo 給載入，結束操作前也可以把 To Do List 用呼叫 API 的方式存起來。

這個 To Do List 還有一些迷人的地方，在做新增或是刪除等等的功能的時候，直覺的想法可能是直接使用 JS 在 UI 上修改。

但有一個很酷的想法是我們只要先給 JS 一個小空間存 todo 的表格，簡單的給 id、完成狀態以及內容即可，每次使用者做操作的時候，背後執行的順序會是先改表格，接著清空 UI 重新照著表格內容再渲染一次。

底下是一個新增的範例：

```
  // 新增
  $('.input__text').keyup((e) => {
    const target = $('.input__text')
    if (e.key === 'Enter') {
      // 更新表格
      const todo = target.val()
      target.val('')
      if (!todo) return
      lastId += 1
      todos.push({
        id: lastId,
        content: todo,
        isDone: false
      })
      // 重新渲染
      render(todos, state)
    }
  })
```

這樣的好處是程式碼的可維護性會大大的提升，因為新增刪除的動作只需要更改表格，而渲染畫面這件事**不管是新增或是刪除，都只要呼叫同一個函式就可以了**。也就是說，如果在 UI 的設計有改變，只需要修改負責渲染的這個函式就行了。

當然這樣的缺點是資源的消耗，因為每次都要把整個畫面重新渲染，所以要把效能也權衡進來一併考量。

### **第十三週**

----------------------------------

> 現代前端的車輪

#### 使用 SCSS

在使用 CSS 常常覺得很麻煩，主要是因為是一條一條將規則寫出來，這樣一來規則一多的時候便很難將同類型的收納在一起，再者有許多用到一樣屬性的地方也要重複寫上。困擾我的主要是前者，幸好有人也有一樣的煩惱，所以設計了一套可以客製化 CSS 的語法。

SCSS 引入了許多在程式語言中常見的語法，下面列幾個我覺得很實用的。

* 變數： 

`$primary-color: #333;`

* 槽狀：

```
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li { display: inline-block; }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}
```

* 模組化：

```
// _base.scss
$font-stack:    Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
// styles.scss
@use 'base';

.inverse {
  background-color: base.$primary-color;
  color: white;
}

```

* 函式：

```
@mixin theme($theme: DarkGray) {
  background: $theme;
  box-shadow: 0 0 1px rgba($theme, .25);
  color: #fff;
}

.info {
  @include theme;
}
.alert {
  @include theme($theme: DarkRed);
}
```

* 模板：

```
%message-shared {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

// This CSS won't print because %equal-heights is never extended.
%equal-heights {
  display: flex;
  flex-wrap: wrap;
}

.message {
  @extend %message-shared;
}
```
（ 以上範例節錄自 [SASS 官網](https://sass-lang.com/guide) ）

其他還有像運算符以及迴圈之類的用法，便比較少用一些，不過看的出來這些語法有能力解決 CSS 死板的問題，最後再將 SCSS compile 成 CSS 就大功告成啦!

#### Gulp

Gulp 是一個 task manager，透過在設定檔裡引入各種工作的 library，然後將這些工作串接在一起包裝成一個一個的任務（ 以 function 包裝任務 ），最後輸出。 Gulp 實際執行時只要引入設定檔並執行被指定的任務即可。實際上一個簡單的設定檔範例可能會像這樣。

```
// 引入工具
const { src, dest, series, parallel } = require('gulp')
const babel = require('gulp-babel')
const sass = require('gulp-sass')(require('node-sass'))

// 任務 1：用 babel compile JS 
function compileJS() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(dest('dist'))  
}

// 任務 2：用 SASS compile SCSS
function compileCSS() {
  return src('src/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('css'))  
}

// 輸出任務：任務 1 任務 2 同時進行
exports.default = parallel(compileJS, compileCSS)
```
Gulp 的威力在於它的工具之多讓你幾乎可以完成想做的任何事，使用者需要做的大致上就是決定要做甚麼以及順序而已，是十分貼近自然語言的，所以也很容易入手，如果想知道 Gulp 的厲害直接去 [Gulp 的官網](https://gulpjs.com/)看看他能不能滿足你的所需!

#### Webpack

Webpack 是一個用來打包網頁資源的工具，打包是甚麼呢? 以 JS 來說，在 ES6 裡面會利用 import/export 來引入不同 JS 檔，如果我們**不要用引入的方式，直接把該用的程式碼全部寫進同一個 JS 檔裡**，這就叫做打包。

而 Webpack 厲害的地方就在於它不只可以打包 JS，連 CSS、圖片等資源都可以打包成一個 JS 檔。這樣的好處在於我們不用將資源全部丟到線上，我們只要把打包好的唯一檔案上線就可以了，如果要修改資源，在本地再度打包以後重新放上線，就可以保證線上的服務不會中斷。除此之外因為 client 端只要做一次 request，提升了使用者的體驗。

詳細一點的打包的細節，可以參考[這裡](https://lidemy5thwbc.coderbridge.io/2021/07/19/webpack-gulp/)。

#### Fetch

想要在前端網站發送 AJAX，除了用之前學過的 XHR, jQuery 提供的 ajax 以外還可以使用 Fetch，有趣的是 fetch 會回傳 promise，而 promise 的 then 函數也會回傳 promise，如此一來便可以透過 chaining 的方式把指令像水管一樣連接在一起，而 `then` 這個函式的取名也十分傳神，以`我先吃早餐然後刷牙`這句話為例，從語意可以知道是**吃完**早餐接著再刷牙，then 要輸入的參數也是 call back function，跟自然語言十分貼近。

另一個要注意的點是 fetch 與 XHR 相比 jQuery 的 ajax 比較底層，比較接近瀏覽器傳給 server 的原始數據，最顯而易見的地方就是如果要傳送 json 格式的資料要手動 stringify，但如果使用 jQuery 的 ajax 就會自己處理 json 的 stringify。

#### Promise

第一次碰到 Promise，對於寫法覺得很有趣，如果想要創建一個新的 Promise 物件，要這麼寫：

```
const example = new Promise(init)
```
init 這個自定義的函式包含了兩個參數，用來表示 Promise 的狀態。第一個表示成功，第二個表示失敗。比如像下面的例子：

```
function init(resolve, reject) {
  try {
    const a = 1 + 3
  } catch {
    reject("oops")
  }
    resolve(a) 
}

```
接著用 then/catch 函式就可以解析 成功/失敗 狀態的回傳值，其中 then 函式會回傳 promise 物件。

Promise 的好處可以由此看出來，如果不斷使用 call back function，會造成 **Christmas Tress Callback Hell**，非常難以閱讀的槽狀結構。透過 then/catch 的 chaining 就可以把一連串的 call back 給縮在同一排，大大增加了程式碼的可讀性。

#### async/await 

前綴 async 的函式可以在它的內部以**同步的方式運行非同步**的程式碼，透過在 async 函式裡回傳 promise 的語句加上 await ，就可以達到**等待 resovle 的結果並回傳後**再繼續往下執行程式碼的效果。

想要深入研究的話，推薦卡斯柏的[使用 Promise 處理非同步](https://wcc723.github.io/javascript/2017/12/29/javascript-proimse/)以及[Async function / Await 深度介紹](https://wcc723.github.io/development/2020/10/16/async-await/)。

#### CSS 資源優化

在前端載入資源的時候，可以針對**資源的大小**、**資源載入方式**以及**資源的執行方式**進行優化。

* CSS 大小優化：
  * Minify: Minify 的做法是清除 CSS 檔案裡的空格、以及更改變數名稱等等把檔案體積縮小，雖然人看起來很吃力，但瀏覽器是沒有障礙的。
  * Compressed: Compress 則是把檔案重新編碼過，在沒有告知瀏覽器用甚麼編碼的狀況下，瀏覽器是看不懂的。所以可以利用 server 端回傳的 Content-Encoding: xxx 來告知瀏覽器要怎麼 decode。要知道對於編碼的資源 client/server 的溝通可以參考[這裡](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)，要如何啟用壓縮的功能請參考[這裡](https://www.pair.com/support/kb/using-mod_deflate-for-page-compression/)。

* CSS 執行方式優化
  * 選擇器優化：在使用 CSS 的選擇器的時候如果可以使用單一屬性選取可以加快效率，另外在寫 SASS 的時候如果太開心使用很多槽狀，也會降低瀏覽器生成 CSSOM Tree 的速度。
  * 渲染流程優化：在使用很多特效的網站裡，可以留意到要使用甚麼屬性來達成效果，舉例來說，top/left/right/bottom 的屬性改變會從 Layout 步驟開始重繪，但如果使用 transform: translate 則只需要從 Composite 階段重繪即可。

* CSS 載入方式優化
  * 快取：如果瀏覽器端有將資源先存起來，下次再造訪網站時便不用再次請求資源，如果不要使用快取使用`ctrl + shift +ｒ`。
  * Critical CSS：這個方法的精神在於把重要的 CSS 樣式優先載入，一個最簡單的方法就是直接把重要的樣式寫進 style 標籤裡，其他樣式再以 link 的方式另外拿取。
  * CSS Sprites：這個方法是透過把大量的小圖片合成一張大圖，如此一來，可以省去許多次 request 來回傳輸的時間，實際上可以透過 Webpack 合成，或是自己手動合成，切割大圖的方式也很簡單，可以利用 background-position 屬性來調整要切割的起始點。


  ```
  // 取左圖
  .cotainer {
    height:　60px;
    width: 60px;
    backgroud-image: url(sprite.svg);
    background-position: 0 0;
    background-repeat: no-repeat;
  }

  // 取右圖
  .cotainer {
    height:　60px;
    width: 60px;
    backgroud-image: url(sprite.svg);
    background-position: -60px 0;
    background-repeat: no-repeat;
  }  
  ```

  ![img](https://i.imgur.com/y7IAUWS.png)


#### 留言板 Plugin

第十三週的有趣作業是做外掛程式，體現了 Webpack 的強大之處，利用 Webpack 可以把 JS 檔打包成一個物件，當在瀏覽器引入時，就擁有了全域變數的物件。

把第十二週做的 API_based 的留言板包裝成外掛以後，就可以很簡單的外掛在任何網站裡了！

### **第十四週**

----------------------------------

> 佈署自己的 server

#### 佈署 server

第十四週算是重頭戲，因為要架設自己的 Server 了，首先要租借虛擬主機，之後大致的流程是這樣的：
1. 設定防火牆
2. 安裝虛擬主機環境
3. 資料庫搬遷
4. 網頁資源搬遷

雖然大致的流程很直觀，但是實際上有很多眉角，詳細可以參考[這裡](https://lidemy5thwbc.coderbridge.io/2021/07/27/webserver-set/)，裡面仔細的把我的架站流程給寫過了一遍。

#### 設定網域

佈署完 Server 以後，下一件事情便可以購買網域名稱，`Gandi` 除了可以購買網域名稱，也有提供 DNS Server。

除了將主網域指向 Server IP 以外，也可以設定子網域，並將子網域指向主網域，最終在瀏覽器順利找到 Server 的 IP 以後，再由 Server 讀取相應的設定檔拿出資源。

如果想要擁有免費的 SSL 憑證，可以使用 `Cloudflare`，同時也可以將 DNS 轉交給它管理。

#### SQL vs NoSQL

第十四週除了佈署 Server 的重頭戲以外也不乏知識補充。其中就是對後端資料庫更深入的了解，資料庫可以分成關聯式與非關聯式兩種，兩者更擅勝場，其中關聯式資料庫可以很方便的做正規化；非關聯式資料庫可以儲存更多元的資料。

更多的 SQL/NoSQL 比較都在[這裡](https://lidemy5thwbc.coderbridge.io/2021/07/28/sql-nosql/)。

#### Transaction

在關聯式資料庫裡常常將資料異動的最小單位稱為一筆交易 (Transaction)，而一筆交易可能會涉及到多個 SQL 語法，如此一來，這些 SQL 語法變必須保持 Atomicity（ 原子性 ）、Consistency（ 一致性 ）、Isolation（ 隔離性 ）、Durability（ 持續性 ）。有了這些特性，可以保證**每一筆交易是獨立且封閉的系統**。

在 MySQL 裡如何實際把 SQL 語法包裝成交易一樣可以參考[這裡](https://lidemy5thwbc.coderbridge.io/2021/07/28/sql-nosql/)。

#### 系統架構

系統架構這部分的水便比較深了，要考慮到如何分配流量、如何確保服務不中斷、如何優化資料庫搜尋效率等等，其中常常出現的例子應該是`短網址服務的系統架構`，我推薦一篇很棒的部落格一步一步的思考要如何配置一個短網址服務的系統架構，請參考[這裡](https://www.jyt0532.com/2019/12/05/design-tiny-url/)。

如果想要理論一點的話，可以聽聽 [David Malan 講的課](https://www.youtube.com/watch?v=-W9F__D3oY4)。

### **第十五週**

----------------------------------

> 精實的複習週

#### 第四期官網導覽

[第四期的官網](https://github.com/Lidemy/mtr-4th-web)大部分都是靜態的，在開發的部分採用 Gulp，看了 gulpfile.js 可以發現一些有趣的工作流程，比如說：

* html 的 template engine （ 提供 html 類似 php 的 require 寫法 ）
* 圖片 sprite ( 十三周才提到沒想到就看到了 ）

第四期官網的 SCSS 也十分值得參考，其中關於 RWD 的 mixin 十分受用，以下節錄片段：
```
$breakpoints: (
  'mobile-s': $width-mobile-s,
  'mobile-m': $width-mobile-m,
  'mobile-l': $width-mobile-l,
  'tablet': $width-tablet,
  'tablet-s': $width-tablet-s,
  'desktop-s': $width-desktop-s,
  'desktop-m': $width-desktop-m,
  'desktop-l': $width-desktop-l,
  'desktop-xl': $width-desktop-xl
);

@mixin mq($width) {
  // 如果 $width 是 $breakpoints 裡的 key
  @if map_has_key($breakpoints, $width) {
    // 取得相應的值
    $width: map_get($breakpoints, $width);
    // 寬度小於 $width 的時候
    @media screen and (max-width: $width) {
      // @content 可以由使用者使用 mixin 時隨意添加
      @content;
    }
  }
}
```

#### 瀏覽器運作原理

複習週閱讀了 [Mariko Kosaka 對瀏覽器運作的解剖](https://developers.google.com/web/updates/2018/09/inside-browser-part1)，這個有技術背景的畫家文筆實在很棒，當然插圖也很可愛。

裡面有幾個重點：

* 每個 Tab 都是一個 Process (renderer process)，防止集體陣亡。
* Renderer Process 的工作流程：
  1. DOM 解析以及非同步 request 資源。（ 注意 JavaScript 會阻塞 DOM 解析，除非使用 async/defer 屬性才會飛同步執行 ）。
  2. 計算 DOM Tree 每個節點的樣式。
  3. Layout 每個元素的位置，但是 display:none 的元素不會被 Layout。
  4. 決定 paint 的順序。 example: background first, then text, then rectangle...
  5. 把要畫的東西切成圖層
  6. Compositor thread 把各個 layer 光柵化以後，再把它們組合成一個 compositor frame
  7. GPU 繪製 compositor frame
* 使用事件代理時，使用 passive: true 讓繪製可以持續進行

就是讀了瀏覽器的運作原理以後，才更了解在十三週 CSS 優化學到的，在 compositor thread 的階段的改動會優於在 Layout 的階段的改動。

#### 網站前後端開發基礎測試

複習週一樣延續了傳統有 Huli 設計的小挑戰，第十五週的小挑戰是[網站前後端開發基礎測試](https://github.com/Lidemy/mentor-program-3rd/issues/5)，其中有兩題理解的還不夠正確。

1. 原來不只 get 算是簡單請求，連基本的 post 也算是簡單請求。
2. 因為 Javascript 有 hoisting 的特性，所以 not defined 以及 undefined 是不同的意義。

#### 期中考

期中考有四題，一題 30 分鐘。

* 第一題（ 用 CSS 切版 ）：第一題我很喜歡，因為覺得要切的東西還滿漂亮的，所以就努力切了。遇到的問題是對 flex grow/ flex shrink/ flex basis，所以沒辦法隨心所欲的讓螢幕縮放下保持比例。
* 第二題（ To do list ）：第二題的實作很類似 To do List，都要有新增、刪除的功能，在最後 sessionStorage 的部分來不及完成。
* 第三題（ 通訊錄 ）：第三題要串 api，然後解析資料寫成 DOM。有點忘了 XMLHttpRequest 的用法，上官方文件抄了一波，結果就不小心太快寫完了。
* 第四題（ 資料整理 ）：第四題的題型很邏輯，是我喜愛的類型，先在筆記本寫下新開一個陣列，然後遍歷原來的陣列以後丟進來，之後實際寫程式碼就沒有遇到甚麼問題完成了。

測驗的題目我有自己在 github 裡 fork 一份，[連結](https://github.com/Wangpoching/web-platform-62um89/)，方便之後再多玩幾次。



