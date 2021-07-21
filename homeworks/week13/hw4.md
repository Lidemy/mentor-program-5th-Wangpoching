## Webpack 是做什麼用的？可以不用它嗎？

### 模組化

如果想知道 Webpack 的功能，那肯定得先知道**模組化**的概念，模組化的概念可以想像成拼裝，舉個例子來說，掃地機器人的組成有**動力模組**、**智能模組**、**集塵器**、**紅外線偵測系統**、**灰塵感應器**等等。 

而在組裝一隻掃地機器人時，我們可以在很大程度上隨自己的喜好去搭配自己喜歡的模組來完成自己的掃地機器人。

也就是說，一個可以模組化的東西會包含這幾種特性。

1. 相對獨立性
2. 可替換性：標準化的介面
3. 通用性

而模組化的設計在高度客製化的軟體開發裡，就變得十分適合。

### Common JS

假如我們在使用 nodeJS 寫一個專案的時候，把功能型函式給切到 utils.js 裡，這邊的範例是用來確保丟進這個函式的物件之後可以以 Array 的型態進行操作。

```
//utils.js
const getEnsuredArray = item => {
 if (!Array.isArray(item)) { //確認是不是陣列型態
  return [item]; // 如果不是返回陣列
 }
 return item;
}

module.exports = getEnsuredArray // 把這個函式 export 出去
```

在主程式 main.js 裡，我們試著引入 utils.js

```
// main.js
var getEnsuredArray = require('./utils')
var example = 10
var result = getEnsuredArray(example).map(function(element) {
  return element * 3
})
console.log(result) //[30]

var result = example.map(function(element) {
  return element * 3
})
console.log(result) //ERROR: example.map is not a function.
```
可以發現透過引入 utils.js 裡的 getEnsuredArray 函數，可以避免對不是陣列的物件使用陣列方法而報錯的情況。

這種用 **module.exports 把東西導出**，用 **require 把模組引入** 的寫法叫作 **CommonJS** 的標準。在 ES6 以前，JavaScript 本身沒有規範任何與模組相關的使用機制，所以各個執行平台可以依照自己選擇的方式去實作，nodeJS 採用的就是 CommonJS。

但可惜的是，瀏覽器上並不支援，所以無法使用 module.exports，也沒辦法用 require。

### 自己打造模組化功能

如果我們可以用原生的 JavaScript 寫出 CommonJS 的 export 還有 require 功能，那麼就可以自己把 CommonJS 編譯到瀏覽器上執行了！

我們的目標是讓 require('./utils.js) 回傳的東西就是 utils.js 裡的 module.exports，那麼來實際試試看吧。

首先在主程式要用到 require 這個函式，所以先把主程式打包成一個函式，並傳入參數（函式）require

```
// 把主程式包起來，傳入 require 函式
function main(require) {
  // main.js
  var getEnsuredArray = require('./utils')
  var example = 10
  var result = getEnsuredArray(example).map(function(element) {
    return element * 3
  })
  console.log(result) //[30]
}
```
接著把模組也包成一個函式，記得在模組裡用到 module.exports 的語法嗎？所以這個打包起來的函示要傳入物件 module

```
// 把主程式包起來，傳入 require 函式
function main(require) {
  // main.js
  var getEnsuredArray = require('./utils')
  var example = 10
  var result = getEnsuredArray(example).map(function(element) {
    return element * 3
  })
  console.log(result) //[30]
}

// 把模組包起來，傳入 module 物件
function utils(module) {
  //utils.js
  const getEnsuredArray = item => {
   if (!Array.isArray(item)) { //確認是不是陣列型態
    return [item]; // 如果不是返回陣列
   }
   return item;
  }
  module.exports = getEnsuredArray // 把這個函式 export 出去
}
```
接著思考一下要怎麼實際產生 module 這個物件，裡面要有 exports 可以調用。 沒錯，首先先創造空物件 m，接著呼叫打好的 utils 函式就可以讓 module 成功有 exports。

```
// 把主程式包起來，傳入 require 函式
function main(require) {
  // main.js
  var getEnsuredArray = require('./utils')
  var example = 10
  var result = getEnsuredArray(example).map(function(element) {
    return element * 3
  })
  console.log(result) //[30]
}

// 把模組包起來，傳入 module 物件
function utils(module) {
  //utils.js
  const getEnsuredArray = item => {
   if (!Array.isArray(item)) { //確認是不是陣列型態
    return [item]; // 如果不是返回陣列
   }
   return item;
  }

  module.exports = getEnsuredArray // 把這個函式 export 出去
}

// 產生一個 m 並丟到 utils，讓 m 帶上 exports 的物件
var m = {}
utils(m)
})
```
有了 module.exports，最後一步肯定要執行主程式了。看一下打包好的主程式需要傳入一個 require 函式，也就是說我們希望 require('./utils') 可以回傳 module.exports。

```
// 把主程式包起來，傳入 require 函式
function main(require) {
  // main.js
  var getEnsuredArray = require('./utils')
  var example = 10
  var result = getEnsuredArray(example).map(function(element) {
    return element * 3
  })
  console.log(result) //[30]
}

// 把模組包起來，傳入 module 物件
function utils(module) {
  //utils.js
  const getEnsuredArray = item => {
   if (!Array.isArray(item)) { //確認是不是陣列型態
    return [item]; // 如果不是返回陣列
   }
   return item;
  }

  module.exports = getEnsuredArray // 把這個函式 export 出去
}

// 產生一個 m 並丟到 utils，讓 m 帶上 exports 的物件
var m = {}
utils(m)

main(function r() {
  // 回傳我們所需要的 m.exports
  return m.exports
})
```
### Webpack 的功能

在使用 Wekpck 的最基本的功能其實就是在進行這樣子的打包（ bundler ）的工作。在 Webpack 基本的設定檔裡面可以看看這樣的範例。

```
module.exports = {
  mode: 'development',
  entry: './main.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  }
}
```
設定入口點 main.js，Webpack 會將入口點所需的套件打包起來，如果這些套件又依賴其他套件也會一併打包，最後輸出 bundle.js。 如此一來，bundle.js 便可以成功在瀏覽器上運行，雖然瀏覽器不支援 module.exports/require 語法。

### ES6 的標準化模組

在 ES6 的框架底下終於有了標準化的模組使用方法，首先在 nodeJS 上試一下。
```
//utils.mjs
export function getEnsuredArray(item) {
 if (!Array.isArray(item)) { //確認是不是陣列型態
  return [item]; // 如果不是返回陣列
 }
 return item;
}

// main.mjs
import { getEnsuredArray } from './utils.mjs'
const example = 10
const result = getEnsuredArray(example).map(function(element) {
  return element * 3
})
console.log(result) //[30]
```
這邊可以看到 export/import 的 ES6 語法，另外要注意的是副檔名需要改成 .mjs 才可以使用 export/import 語法。

那麼在瀏覽器上可不可以用呢？答案是可以的，但支援度很差，首先在引入 js 檔的標籤上記得加上 **type="module"**。

```
<html>
<head>
  <script src="./main.js" type="module"></script>
</head>
<body>
</body>
</html>
```
除此之外，在瀏覽器引入不論是 npm 安裝的第三來源套件或是自己寫的模組都必須指定路徑並且寫出完整檔名，這樣其實很不友善，因為當檔案系統改變的時候，把每個 js 檔裡的路徑修改就瘋掉了，那麼不如一樣利用 webpack 打包成一個檔案。

最後，Webpack 還可以打包更多東西，包含 CSS 甚至是圖片等等，不過要謹記在心的還是**為甚麼需要使用 Webpack**這件事。

## gulp 跟 webpack 有什麼不一樣？

gulp 與 webpack 做的事情可以說是完全不一樣。

### gulp

gulp 是一個 task manager，也就是說它是一個管理 task 的工具，甚麼是 task 呢？ gulp 提供了數以百計的 plugins ，我們可以將這些 plugins 拿來使用並且制定這些 plugins 的執行順序，比如說我想先清空桌面，然後修改時間；甚至可以規定要平行執行，比如說 ES5 的 js 檔透過 Babel 轉成 ES6，同時把 SCSS compile 成 CSS。甚至可以使用 webpack 的 plugin 來把許多資源打包。

說到這裡，我們可以知道 gulp 的使用十分彈性，因為他把使用權交給使用者，基本上使用者想做的事情都可以做到。

```
const { src, dest, series, parallel } = require('gulp')
const babel = require('gulp-babel')
const sass = require('gulp-sass')(require('node-sass'))


function compileJS() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(dest('dist'))  
}

function compileCSS() {
  return src('src/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('css'))  
}

exports.default = parallel(compileJS, compileCSS)
```
這邊 gulp 的範例可以看到有兩個 task，一個是 comileJS 一個是 compileCSS，然後這兩個 task 同時進行，task 該做甚麼以及 task 執行的順序都是使用者決定的。

### Weckpack

Weckpack 的功能就很單一了，他就是一個 bundler，比起 gulp，頂多是一個 task 罷了，使用 Weckpack 時可以將資源先經過轉換，但最後還是要全部交給 weckpack 打包。 

## CSS Selector 權重的計算方式為何？

如果要講到 CSS 的權重，2013年 CSS DevConf 發表的圖可以說是經典。

![img](https://i.imgur.com/1YZHeeh.png)

其實 CSS 權重的細節都在這張圖裡了，這張圖的讀法是:

1 2 3 4
5 6 7 8
9 10 11 12
...

如果仔細的看完這張圖，稍微總結一下。

1. !important > inline style > ID > (pesudo class, attribute, class) > universal selector

2. **沒有三個臭皮匠勝過一個諸葛亮**這種事，只要排行比較厲害，就算只有一個也會蓋過 100 個比較後面的排行。





