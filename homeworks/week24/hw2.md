# Redux middleware 是什麼？

## 前言

Redux 提供了 middleware 的功能，讓我們可以在 action 被真正送到 reducer 以前，可以做許多客製化的事情。

最重要當然是處理非同步的事件，像是可以發 API 請求資料。其他像是用 redux-logger 幫助記錄存入 redux 前後的狀態也是常用的 middleware 之一。

以我的了解來說，middleware 可以說是 pre-reducer 的 hooks。

如果還不是很明白 middleware 被使用的時機，可以看看下面這張圖：

![img](https://i.imgur.com/j3yIbiz.png)

## 如何使用 middleware

```js
import { applymiddleware, createStore } from 'redux'
import logger from 'redux-logger'

const store = createStore(reducer, applyMiddleware(logger))
```

在創建 store 的時候，只要簡單的將要用到的 middleware 當作參數放進 applyMiddleware 裡，就可以成功讓 store 與 middlewares 連結。

在 logger 的例子裡，所有 action 都會先經過 logger，印出進出 reducer 前後的狀態。

## redux-logger

官方提供的 logger 函式的範例是這樣子的:

```js
const logger = store => next => action => {
  console.log("dispatching1", action);
  let result = next(action);
  console.log("next state1", store.getState());
  return result;
};
```

看起來太簡化了，所以在這裡先改成用 function declaration 的方式寫

```js
function logger(store) {
  return function wrapDispatchToAddLogging(next) {
    return function dispatchAndLog(action) {
      console.log('dispatching', action);
      let result = next(action);
      console.log('next state', store.getState());
      return result;
    }
  }
}
```

至於為甚麼要包這麼多層，只好繼續看下去。

## createStore 與 applyMiddleware

為了瞭解 logger 的寫法必須往前追溯 createStore 以及 applyMiddeware 是如何運作的。

首先先來看 createStore 的部分，store 有分兩種，一種是**有 enhancer 的 store 以及沒有 enhancer 的 store**。為了方便理解，在這邊可以思考成**有 middleware 的 store  以及沒有 middleware 的 store**。

### createStore

createStore 擁有三個參數：

* **reducer**: 就是實際處理 action 的地方
* **preloadedState**: 預設的狀態，會覆蓋 reducer 中預設的狀態。也就是會覆蓋我們會在 reducer 中設定狀態的初始值 reducer(state=INIT_STATE, action) 。
* **enhancer**: 有用過 react-redux 提供的 connect 的話，對於 HOC 應該不陌生。而 enhancer 實際上就是一個 **Higher-Order Function (HOF)**，將 redux store 送進 enhancer 裡，回傳包裝過的 redux store。

這個時候機靈的小夥伴們可能開始疑惑了，如果 applyMiddleware 會回傳一個 enhancer ，為了麼上面的範例裡是把 `applyMiddleware(logger)` 放在第二個參數呢?

這時候可以從節錄的 createStore 原碼得到解答:

```js
export default function createStore(reducer, preloadedState, enhancer) {
  ...
  
  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== "undefined") {
    if (typeof enhancer !== "function") {
      throw new Error("Expected the enhancer to be a function.");
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  ...
}
```

第四行的地方表明了當第二個參數是一個 function 而且第三個參數沒有定義的情況，
會把 preloadedState 的值傳給 enhancer ，並且把 preloadedState 設定成 undefined。

在定義好各自的角色以後，最後，用 enhancer 把 reducer 包裝起來，變成一個有 enhancer 的 reducer。

### applyMiddleware

applyMiddleware 可以產生一個 store enhancer。它的效果是可以用 currying 將多個 middleware 串聯在一起，變成 middleware chain。

畫個圖感覺會像這樣子:

![img](https://i.imgur.com/c5fSCUD.png)

感覺應該還是滿不清楚的，再繼續看下去回過頭來再看這張圖會更清楚一些。

下面是 applyMiddleware 的源碼：

```js
export default function applyMiddleware(...middlewares) {
  return createStore => (reducer, ...args) => {
    const store = createStore(reducer, ...args);
    let dispatch: Dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }
    
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    };
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch
    };
  };
}
```

首先我們回想 createStore 在有 enhancer 的情況下會返回 `enhancer(createStore)(reducer, preloadedState);` 這樣的東西。

這邊的 enhancer 我們用簡單的範例就是 applyMiddleware(logger) 回傳的 function。 接著我們注意到源碼的第二行要帶入的參數就是 createStore，最後再把返回的函式帶入 reducer。

最後返回的東西會跟原始的 createStore 有點像，一樣有 subscribe 以及 getState。 不過看起來 dispatch 似乎被修改過了，也就是完成了對 createStore 的修飾。

接下來繼續詳細的看 dispatch 是如何被修改。

#### 建立一個新的 redux store (第 3 行)

第三行的地方呼叫了 createStore(reducer, ...args)，這邊的 ...args 是 preloadedState，由於 preloadedState 在前面把函式傳給 enhancer 後，被設定為 undefined，所以可以看成 createStore(reducer)。

接著先跳到 createStore 的源碼下半段，如果沒有 enhancer 會做的事情：

```js
export default function createStore(reducer, preloadedState, enhancer) {
  ...

  let currentReducer = reducer;
  let currentState = preloadedState;

  function getState() {
    return currentState;
  }

  function dispatch(action: A) {
    currentState = currentReducer(currentState, action);
    return action;
  }

  dispatch({ type: ActionTypes.INIT });

  const store = {
    dispatch,
    subscribe,
    getState
  };
  return store;
}
```

裡面做的事情就是定義了 getState, dispatch, subscribe 然後發送一個 INIT 的 action。

#### compose middleware (第 4–16 行)

我們再看一次 logger 函式。

```js
function logger(store) {
  return function wrapDispatchToAddLogging(next) {
    return function dispatchAndLog(action) {
      console.log('dispatching', action);
      let result = next(action);
      console.log('next state', store.getState());
      return result;
    }
  }
}
```

前面提到過 middleware chain，其中 next 會不斷指向下一個 middleware 函式，所以，在 dispatch action 後進入 middleware 的函式， action 不斷被往下一個 middleware 傳遞 (logger 的第 5 行)。

接著回到 applyMiddleware 的第 4–16 行

```js
let dispatch: Dispatch = () => {
  throw new Error(
    'Dispatching while constructing your middleware is not allowed. ' +
      'Other middleware would not be applied to this dispatch.'
  )
}

const middlewareAPI = {
  getState: store.getState,
  dispatch: (action, ...args) => dispatch(action, ...args)
};
const chain = middlewares.map(middleware => middleware(middlewareAPI));
dispatch = compose(...chain)(store.dispatch);
````

首先透過 map 將經過修改的 getState 與 dispatch 傳入到每一個 middleware 中的第一個參數。為了避免 middleware 在建立時，其中一個 middleware 函式呼叫了 store.dispatch 讓程式壞掉。

現在 chain 會長得像這樣:

`[middleware1 = next => action => {...}, middleware2 = next => action => {...}, ...]` 如果不太清楚的話可以回頭看看 logger 的寫法。

現在 chain 裡面儲存了很多的 `next => action => {...}`，下個步驟就是將每個 middleware 的 next 都指向下一個 middleware 函式。

而答案就在 compose 這個函式裡面。 底下是 compose 的實作。

```js
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```
reduce 的用法可以參考 [MDN Web Docs](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)。

假設有兩個 middleware 分別是 logger 與 reportError，情況會像下面這樣:

```js
const logger = (next) {
  return function dispatchAndLog(action) {
    console.log('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    return result;
  }
}

const reportError = next => action => {...}

// reduce 回傳的函式
return (next) => logger(reportError(next))
```

所以 reduce 最後會回傳一個函式，**這個函式暴露出最後一個 middleware 的 next 參數**，想當然爾要放入 dispatch 來完成對 dispatch 的包裝。

現在再看一次剛剛的圖應該清楚多了!

![img](https://i.imgur.com/c5fSCUD.png)

如果把事情簡化成只有一個 middleware，也就是 logger，會更好解釋。此時的 dispatch 也就會是:

```js
dispatch = (action) {
  console.log('dispatching', action);
  let result = store.dispatch(action);
  console.log('next state', store.getState());
  return result;  
}
```

#### 修改 redux store 中的 dispatch 函式 (第 18–22 行)

applyMiddleware 的最後一個步驟就是把原本串聯在一起的 middleware 傳到 redux 中，改掉原本的 dispatch 函式。到此為止加強版的 store 就被建立起來了。

最後當 dispatch 被呼叫時，就會先經過 middleware 的邏輯以後才實際發出 dispatch 讓 reducer 處理。

-------------------------------------------------

# CSR 跟 SSR 差在哪邊？為什麼我們需要 SSR？

## CSR vs SSR

CSR (Client side rendering) 與 SSR (Server Side rendering) 有甚麼不同呢? 

在深入這個問題之前，可以先看下面這張圖:

![img](https://i.imgur.com/p5wLxq4.png)

### CSR

首先先看 CSR，許多的 SPA 的網站都利用 CSR 來實現，為了實現瀏覽器不用請求新的頁面就達到換頁的效果，可以讓 Javascript 負責畫面元件的渲染，造成**換頁的效果**。

圖中以 React 為例，首先瀏覽器請求 Html，不過大部分的情況下，瀏覽器只會收到一個很空的 Html，像下面的範例一樣。

```html
<!doctype html><html lang="en"><head><meta charset="utf-8"/><link rel="icon" href="/react-blog-redux-/favicon.ico"/><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&amp;display=swap" rel="stylesheet"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="theme-color" content="#000000"/><meta name="description" content="Web site created using create-react-app"/><link rel="apple-touch-icon" href="/react-blog-redux-/logo192.png"/><link rel="manifest" href="/react-blog-redux-/manifest.json"/><title>React Redux App</title><script id="react-dotenv" src="https://wangpoching.github.io/react-blog-redux-/env.js"></script><script defer="defer" src="/react-blog-redux-/static/js/main.9d047363.js"></script><link href="/react-blog-redux-/static/css/main.412967fc.css" rel="stylesheet"></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id="root"></div></body></html>
```

有趣的是除了 id 名叫 root 的 div 元素以外，body 是空的。不過在 header 裡頭會請求 compile 好的 javascript 檔案，負責諸如監聽、渲染以及發 API 等大大小小的工作。

最後使用者得以看到畫面。

### SSR

再來看到 SSR 的部分，SSR 代表當瀏覽器請求 Html 時，網頁的內容已經被寫在 Html 裡了，因此瀏覽器在解析完 css 與 html 後會自動渲染畫面，而不是由 javascript 所操縱渲染畫面。

在 SSR 的情況下瀏覽器一開始收到的 Html 是類似下面的範例的，可以看到畫面需要呈現的內容幾乎都寫在 body 裡頭了。

```html
<!DOCTYPE html>

<html>
<head>
  <meta charset="utf-8">
  <title>lazy-form</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="./normalize.css">
  <link rel="stylesheet" href="./modal.css">
  <script src="./index.js"></script>
</head>

<body>
  <div class="all__wrapper">
    <div class="form__wrapper">
      <div class="wrapper">
        <section>
          <h1>Todo List</h1>
        </section>
      </div>
      <div class="wrapper">
        <section class= 'query-block'>
          <input class="input__text" type="text" placeholder="Add something to do here <(￣︶￣)>?">
          <div class="input__underline"></div>
        </section>
      </div>
      <div class="wrapper">
        <section class= 'main-block'>
          <ul>
            <li>
                <label>
                    <input class="todo" type="checkbox" />
                    <div>開會</div>
                </label>
                <div class="btn__delete"><div>
            </li>
            <li>
                <label>
                    <input class="todo" type="checkbox" />
                    <div>遛狗</div>
                </label>
                <div class="btn__delete"><div>
            </li>
            <li>
                <label>
                    <input class="todo" type="checkbox" />
                    <div>掃客廳</div>
                </label>
                <div class="btn__delete"><div>
            </li>
          </ul>
        </section>
      </div>      
    </div>
  </div>
</body>
</html>
```

## CSR 的缺點

雖然使用 CSR 的方式寫 SPA 很方便，而且像是 React, Vue 等等的框架可以省去把資料與畫面的邏輯混著寫的麻煩，那幹嘛要用 SSR?

因為 CSR 是由前端的 JavaScript 動態產生內容，所以當檢視原始碼時，只會看到空蕩蕩的一片，只看得到一個 JavaScript 檔案。

對於 SEO 來說，簡直糟透了，不過 Google 的爬蟲其實支援執行 JavaScript，所以也許他有辦法知道實際的內容。

不過問題是除了 Google，還有其他很多搜尋引擎並沒有執行 JavaScript 的機制。

![img](https://i.imgur.com/Jmz7XKb.png)

## 解決辦法

有沒有甚麼辦法可以融合 SSR 還有 CSR 的優點呢? 如果可以**在第一次請求 HTML 時使用 SSR，之後元件的  routing、請求 API 都是在瀏覽器端執行，**這樣一來有許多優點。

1. 利於進行 SEO
2. 減少使用者從請求網頁到看見網頁內容時間
3. 仍然有 SPA 的優點

至於要怎麼實作，會在[下一篇](https://lidemy5thwbc.coderbridge.io/2022/01/30/react-ssr-routing-tutorial/)討論。

------------------------------------------------

# 實作 React 版本的第一次渲染 SSR + Routing

## 架構

在網路上看到許多定義 SSR 指的是瀏覽器第一次請求內容使用 SSR，但後續還是使用 CSR 的方式。

為了不要混淆讓人以為所有畫面的改變都是使用 SSR，所以我把這樣的方法稱作 1st SSR + CSR。

在實作 React 版本的 SSR + CSR 以前，先大致瀏覽一下架構這次實作的架構。

![img](https://i.imgur.com/fgzpfHW.png)

這個架構有幾個特色:

* 渲染伺服器與瀏覽器端都可以請求 API。
* 渲染伺服器會在使用者請求 HTML 時，會請求 API 的資料，並將內容都事先放到 HTML 中。
* 在第一次請求 HTML 後，之後的元件 routing、請求 API 都是在瀏覽器端執行。

## 事前準備

第一步要安裝需要的套件，可以照著底下節錄的 package.json 安裝。

```json
"dependencies": {
  "express": "^4.17.2",
  "prop-types": "^15.7.2",
  "react": "^17.0.2",
  "react-dom": "^17.0.2",
  "react-router-dom": "^6.2.1",
  "webpack-node-externals": "^1.7.2"
},
"devDependencies": {
  "@babel/core": "^7.10.4",
  "@babel/preset-env": "^7.10.4",
  "@babel/preset-react": "^7.10.4",
  "babel-loader": "^8.1.0",
  "nodemon": "^2.0.4",
  "npm-run-all": "^4.1.5",
  "webpack": "^4.43.0",
  "webpack-cli": "^3.3.12",
  "webpack-node-externals": "^1.7.2"
}
```

### express

express 作為撰寫渲染伺服器的框架，能夠在使用者請求 HTML 時，決定要渲染哪個元件，或者是呼叫 API 請求資料，並將資料渲染至 HTML 中，最後以**字串**回傳 HTML。

### webpack + babel

因為不用 create-react-app 打包 react 的關係，所以需要自己動手打包。

除了需要讓 babel 轉換 JSX 的語法之外，也記得要讓 ES6 轉 ES5 語法，因為 server 是跑在 node 環境，對 ES6 的支援度不高。

### nodemon

nodemon 可以取代 node 執行 js 程式，厲害的是類似於 dev server，nodemon 會隨時監聽執行程式有沒有被修改，並且重新執行。

### npm-script(package.json)

先看一下在 package.json 中定義的幾個快捷指令:

```json
"scripts": {
  "dev": "npm-run-all --parallel dev:build:* dev:server ",
  "dev:server": "nodemon --inspect build/bundle.js",
  "dev:build:server": "webpack --mode development --config webpack.server.js --watch",
  "dev:build:client": "webpack --mode development --config webpack.client.js --watch"
}
```

當輸入指令 `npm run [npm-script]`時，會自動執行定義好的 command。

下面是各個指令的功能:

* dev:build:server：使用 webpack 打包 server 端程式碼 (express)，並監聽程式碼的改變，自動編譯程式碼。
* dev:build:client：使用 webpack 打包 client 端程式碼 (react)，並監聽程式碼的改變，自動編譯程式碼。
* dev:server : 使用 nodemon 監聽 bundle.js 是否有改變，自動執行 bundle.js
* dev: 偷懶一波，直接把前三個指令都下了

### 如何將 React Component 轉為文字

進入實作的第一個困難是，有沒有甚麼方法可以很方便的將 React Component 轉成 html tags 呢? 

記得在第一次渲染的時候，我們希望渲染伺服器可以給瀏覽器 html，如果我們希望搭配 react 達成這件事情的話，react 已經提供了這樣的函式。

我們來看看 `renderToString` 這個函式在[官網的介紹](https://zh-hant.reactjs.org/docs/react-dom-server.html#rendertostring)

> React 將會回傳一個 HTML string，你可以使用這個方法在伺服器端產生 HTML，並在初次請求時傳遞 markup，以加快頁面載入速度，並讓搜尋引擎爬取你的頁面以達到 SEO 最佳化的效果。

### 資料夾結構

```
│  .babelrc
│  package.json
│  webpack.client.js
│  webpack.server.js
└─src
    │ server.js
    │ client.js
    │ App.js
    └─pages
    │   │ HomePage.js
    │   │ OtherPage.js
    └─helpers
    │   │ renderer.js
    └─components
        │ Header.js
```

## 開始寫 React Components

### Pages

這個實作會有兩個分頁，叫做 HomePage 與 OtherPage。

```jsx
// HomePage
import React from 'react'

const HomePage = () => (
  <div>
    <h1>HomePage</h1>
    <h2>Hello! I am HomePage!</h2>
  </div>
)

export default HomePage
```

OtherPage 比較特別一點，我們加上一個按鈕以及 EventListener，每按一下都會在 console 收到通知。

```jsx
import React from 'react'

const OtherPage = () => (
  <div>
    <h1>OtherPage</h1>
    <button onClick={() => console.log("click me")}>click me</button>
  </div>
)

export default OtherPage
```

### Header (切換頁面)

為了方便切換頁面，接著要切一個 Header。

```jsx
import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => (
  <ul>
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="other">Other page</Link>
    </li>
  </ul>
)

export default Header
```

## 建立渲染伺服器 (Express)

這個 express 渲染伺服器，提供 `/` 與 `/other` 的 GET API，在使用者進入 localhost:3001 時，會選擇元件 `<HomePage />` 或是 `<OtherPage />` 轉換成 HTML 字串，然後回傳。

```js
import express from 'express'
import renderer from './helpers/renderer'

const app = express()

const port = process.env.PORT || 3001

app.get('/', (req, res) => {
  const content = renderer(req)
  res.send(content)
})

app.get('/other', (req, res) => {
  const content = renderer(req)
  res.send(content)
})

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})
```

## 建立 helper function

不是說要用 `renderToString` 把元件轉成 html 嗎? 我們把這個邏輯抽成一個叫做 renderer 的 function。

```jsx
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import OtherPage from '../pages/OtherPage'
import Header from '../components/Header'

export default (req) => {
  const content = renderToString(
    <StaticRouter location={req.path}>
      <Header />
      <Routes>
        <Route exact path='/' element={<HomePage />} />
        <Route exact path='/other' element={<OtherPage />} />
      </Routes>
    </StaticRouter>
  );
  return `
    <html>
      <body>
        <div id="root">${content}</div>
      </body>
    </html>
  `
}
```
這邊有趣的是使用了 Static Router 當作路由，Static Router 會實際依照網址來渲染內容，所以在第一次使用 SSR 渲染時，就可以根據網址來將對應的元件傳換成 Html。

如果使用 Browser Router 是行不通的，因為 Browser Router 要使用到 document 上的函式，但是在第一次使用 SSR 的時候內容是放在 HTML 裡的，那時候尚未有 document 可以使用。

## 設定 babel

接著準備要 compile，所以要先把 babel 的設定寫在 .babelrc 裡頭。

```
{
  "presets": [
      "@babel/preset-env",
      "@babel/preset-react"
  ]
}
```

這兩個 preset 是為了因應我們在 node.js 的環境中會用到 React 的 JSX 語法，而且可能會用到比較新的 JavaScript 語法。

## webpack 設定檔

最後只要寫好 webpack 設定檔就可以 compile 了。

```js
// webpack.server.js
const path = require('path')
const webpackNodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node', //使用 node.js 的環境編譯程式碼。
  entry: './src/server.js', // 入口點
  externals: [webpackNodeExternals()], // 因為在 node 中可以另外引入相依套件，所以不用把 node_modules 都打包
  output: {
    filename: 'bundle.js', // 打包後的檔案名稱
    path: path.resolve(__dirname, './build'), // 打包後的檔案路徑
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'], // 可以寫在 .babelrc 也可以寫在這裡
          },
        },
      },
    ],
  },
  devServer: {
    port: 8080,
  },
};
```

## 打包並執行 bundle

在 cmd 輸入以下指令進行打包與開啟 express server

```cmd
npm run dev:build:server
```
```cmd
npm run dev:server
```

接著在瀏覽器輸入 localhost:3001 測試。

![img](https://i.imgur.com/9eIU60T.gif)

有兩個問題需要改善：
1. 點了按鈕 console 怎麼沒有提醒?
2. 使用 Static Router 每次點擊超連結都會實際換頁，想要有 SPA 怎麼辦?

## 把第一次渲染之後的工作交給 Client Side

記得前面提到我們希望把第一次渲染之後不管是監聽或是換頁等等的工作都交給瀏覽器嗎?

所以只要在第一次渲染之後的換頁都採用 Browser Router 就沒有換頁的問題了。

至於 EventListener 的問題也是因為純文字的 Html 並沒有辦法加上 EventListener，所以也必須仰賴 Client 端在第一次渲染以後另外加上。

我們再看一次[之前的第一次渲染使用 CSR vs SSR 的比較圖](https://lidemy5thwbc.coderbridge.io/2022/01/29/CSR-SSR/):

![img](https://i.imgur.com/q914jq2.png)

接著我們試著把紅色框的部分完成。

## Client.js

我們除了前面用 webpack 打包 express 的程式碼，現在還要多一個在使用者看到網頁內容後，用於綁定事件以及支援 BrowserRouter 的 JavaScript 檔案。

```jsx
//client.js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.hydrate(
  <App />,
  document.getElementById('root')
)
```

接著把 Browser Router 寫在 App.js 裡面

```jsx
//App.js
import React from 'react'
import { BrowserRouter, Route, Routes  } from 'react-router-dom'
import HomePage from './pages/HomePage'
import OtherPage from './pages/OtherPage'
import Header from './components/Header'

const App = () => (
  <BrowserRouter>
    <Header />
      <Routes>
        <Route exact path='/' element={<HomePage />} />
        <Route exact path='/other' element={<OtherPage />} />
      </Routes>
  </BrowserRouter>
);

export default App
```

到這裡眼尖的人應該會注意到在 client.js 裡我們使用 ReactDOM.hydrate 而不是 ReactDOM.render。

官方網站這樣子介紹 ReactDOM.hydrate :

> 如果你在一個已經有伺服器端 render markup 的 node 上呼叫 ReactDOM.hydrate，React 將會保留這個 node 並只附上事件處理，這使你能有一個高效能的初次載入體驗。

所以說使用 React.hydrate 的話可以保留 SSR 與 CSR 相同的部分，節省了一些效能。

## webpack.client.js

接著當然要把 client.js 也 bundle 起來，就像 create-react-app 做的一樣。

```js
//webpack.client.js
const path = require('path');

module.exports = {
  entry: './src/client.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
    ],
  },
  devServer: {
    port: 8080,
  },
};
```

因為這一包是要在瀏覽器上執行的，所以記得要連 node_modules 都一起包起來。

## renderer.js

記得再回到 renderer.js 把打包好的 client.js 給引入到 html 裡的 script 標籤。

```jsx
//renderer.js
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import OtherPage from '../pages/OtherPage'
import Header from '../components/Header'

export default (req) => {
  const content = renderToString(
    <StaticRouter location={req.path}>
      <Header />
      <Routes>
        <Route exact path='/' element={<HomePage />} />
        <Route exact path='/other' element={<OtherPage />} />
      </Routes>
    </StaticRouter>
  );
  return `
    <html>
      <body>
        <div id="root">${content}</div>
        <script src="./bundle.js"></script> // 記得加上 bundle.js
      </body>
    </html>
  `;
};
```

## express

最後可能忽略的小細節是幫 express 指定靜態檔案的路徑，指定路徑為打包好的 client.js 放的 dist 資料夾。

```js
// server.js
import express from 'express'
import renderer from './helpers/renderer'

const app = express()

const port = process.env.PORT || 3001

app.use(express.static('dist')) // 指定靜態資源路徑

app.get('/', (req, res) => {
  const content = renderer(req)
  res.send(content)
})

app.get('/other', (req, res) => {
  const content = renderer(req)
  res.send(content)
})

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})
```

## 最終打包

在 cmd 執行:

```cmd
npm run dev:build:server
```
```cmd
npm run dev:build:client
```
```cmd
npm run dev:server
```

或者開大決:

```cmd
npm run dev
```

開啟 localhost:3001 來測試看看吧! 為了測試 Static Router，這次從 localhost:3001/other 進入。

![img](https://i.imgur.com/B2964Qe.gif)

這次換頁不用重新向伺服器請求而且點擊按鈕 EventListener 也成功監聽了，完美!

## 補充

如果不想一步一步來的話可以直接參考[這裡](https://github.com/Wangpoching/react-ssr-router-tutorial)。

想知道全部使用 CSR 以及第一次渲染使用 SSR 的優劣可以看[前一篇](https://lidemy5thwbc.coderbridge.io/2022/01/29/CSR-SSR/)。

----------------------------------

# 除了原生的方法，有哪些現成的框架或是工具提供了 SSR 的解決方案？至少寫出兩種

要解決 CSR 的 SEO 問題，主要可以分為幾種方式，以下會稍微介紹這幾種方式的優缺點以及工具。

## Pre-build

### 原理與優缺點

Pre-build 的方法需要在 build server 的時候就決定好每個路由需要的資料並建立出完整的 HTML，server 收到請求時直接回傳已經建立好的 HTML。

這樣的好處顯而易見是當瀏覽器要求時，縮短請求回傳時間，缺點是因為是在 build 時產生 HTML，每次有內容變動都要重 build，對於內容變動頻率高的網站會很麻煩。

### 工具

* [react-snap](https://github.com/stereobooster/react-snap)
* [Eleventy](https://www.11ty.dev/)

## Server-Side Rendering

### 原理與優缺點

相對於 Pre-build，SSR 是在瀏覽器請求時才產生 HTML，缺點是時間上慢了 Pre-build 一些，但比較有彈性。

### 工具

* [Next.js](https://nextjs.org/): 使用 React 語法
* [Nuxt.js](https://nextjs.org/): 使用 Vue 語法

## Dynamic Rendering

## 原理

Prerender.io 運作流程是當 web server 收到請求時透過 Prerender-node Middleware 來辨識請求是來自瀏覽器還是爬蟲。

如果是瀏覽器就依照原本的 CSR 機制，如果是爬蟲才需要做 prerender，會委託 Prerender.io 的 cloud service 渲染出 HTML 再回傳給 web server 最後才再回傳給爬蟲，這樣的方式稱為 Dynamic Rendering。

### 要怎麼辨識是不是爬蟲

方法很簡單，只要利用 header 中 user-agent 的值就可以判斷是不是爬蟲了，比如說如果是 google 爬蟲會帶上 `googlebot`。

其他支援的 user-agent 還有很多：

```js
prerender.crawlerUserAgents = [
  'googlebot',
  'Yahoo! Slurp',
  'bingbot',
  'yandex',
  'baiduspider',
  'facebookexternalhit',
  'twitterbot',
  'rogerbot',
  'linkedinbot',
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'pinterest/0.',
  'developers.google.com/+/web/snippet',
  'slackbot',
  'vkShare',
  'W3C_Validator',
  'redditbot',
  'Applebot',
  'WhatsApp',
  'flipboard',
  'tumblr',
  'bitlybot',
  'SkypeUriPreview',
  'nuzzel',
  'Discordbot',
  'Google Page Speed',
  'Qwantify',
  'pinterestbot',
  'Bitrix link preview',
  'XING-contenttabreceiver',
  'Chrome-Lighthouse',
  'TelegramBot',
];
```

### 要如何把帶有資料的 HTML 給爬蟲

最後談一談 Prerender.io 是怎麼把已經填好資料的 HTML 給爬蟲的。

1. web server 呼叫 Prerender.io 提供的 GET API 並帶上爬蟲請求的路由
2. Prerender.io 開一個瀏覽器跟 web serve 請求該路由的資料來渲染 HTML
3. 從原本的 API 回傳渲染好的 HTML 給 web server
4. web server 把 HTML 給爬蟲

整個過程的精髓就在第二個步驟，有一種另闢戰場的感覺 XD

如果還不是很清楚請參考下面這張圖：

![img](https://i.imgur.com/oGlIXJ4.png)

### 工具

* [Prerender.io](https://prerender.io/)


