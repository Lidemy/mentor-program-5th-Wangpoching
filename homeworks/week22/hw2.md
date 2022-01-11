# **請列出 React 內建的所有 hook，並大概講解功能是什麼**

## **useState**

```js
const [state, setState] = useState(initialState);
```

useState 的用法像這樣子，在首次 render 時，state 的值由 initialState 來決定; setState 則是用來修改 state 值的函式。

```js
setState(newState)
```

setState 用來更新 state。它接收一個新的 state 後元件將重新 render。

這邊有兩點要注意：

1.  render 以後 useState 回傳的 state 是更新過後的值。
2. setState 不會在被 render 後改變指向的位置，所以可以放心地不在 dependencies 中放入。

### 函數式更新

setState 並不一定要使用直接代入要更新的值的方式使用。它可以像下面這樣使用。

```
setState(prevState => prevState + 1)
```

透過代入匿名函式的方式，可以拿到上一個 state 來使用，如果 state 的更新是基於上一個 state，可以用這個方法，此外，這個方法也不用將 state 寫進 dependencies 裡。

### 與 class component setState 不同的地方

與 class component 的 setState 方法不同，沒有辦法自動合併更新 object，所以可以搭配 ES6 的 object spread 語法來更新，像下面這樣:

```
setState(prevState => {
  return {...prevState, ...updatedValues}
})
```

### LazyInitializer

initialState 參數只會在初始 render 時使用，在後續 render 時會被忽略。其實 useState 也可以傳入匿名函式，這個函式的回傳值就會是 state 的初始值，而且只會被調用一次。

```
const [state, setState] = useState(() => {
  const initialState = complexComputation(props)
  return initialState
})
```

不過因為這個函式的運算速度會影響第一次 render 的效能，所以如果真的要進行太複雜的計算也可以考慮移到 useEffect。

### state 不更新的情況

如果使用跟目前 state 一樣的值更新 state，React 將不會重新 render。

---------------------------------

## **useEffect**

```js
useEffect(didUpdate)
```

useEffect 接受傳入匿名函式，並且預設會在每一次 render 結束以後執行這個匿名函式，但我們也可以選擇它們在某些值改變的時候才執行。

### 清除一個 effect

很多時候，在 component 離開螢幕之前需要清除 effect 的效果，比如說 subscription 或計時器的 ID。

傳遞到 useEffect 的 function 可以回傳一個清除的 function，這個 function 會在 component 從 UI 被移除前執行。

```js
useEffect(() => {
  const timer = setTimeout(doSomething, 1000)
  return () => {
    // Clean up the timer
    clearTimeout(timer)
  }
})
```

### 有條件的觸發 effect

useEffect 可以傳遞第二個參數，它是該 effect 所依賴的值的 array，當每次重新 render 後，這個 array 會被比較是否一模一樣，如果有改動就會觸發 useEffect 的效果。

```js
// 當 count 改變時才會建立計時器
useEffect(() => {
  const timer = setTimeout(doSomething, 1000)
  return () => {
    // Clean up the timer
    clearTimeout(timer)
  }
}, [count])
```

----------------------------

## **useLayoutEffect**

useLayout 的用法基本上與 useEffect 相同，因為不是所有的 effect 都可以被延後。例如，使用者可見的 DOM 改變最好在下一次繪製之前同步觸發，這樣使用者才不會感覺到視覺不一致，而 useLayoutEffect 可以確保在 render 到螢幕前被執行。

---------------------------

## **useContext**

```js
const value = useContext(MyContext);
```

useContext 接收一個由 React.createContext 所建立的物件，並且會回傳該 context 目前的值。

聽起來有點抽像，再繼續看看它的使用。 

```js
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext();

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Button />
    </ThemeContext.Provider>
  );
}

function Button() {
  return (
    <div>
      <ThemedButton style={{ background: theme.background, color: theme.foreground }}/>
    </div>
  );
}
```

Context.Provider 可以將 value 給傳遞到他所有的子元件，而子元件透過 useContext(Context) 可以將 value 取出。

最後有兩點要注意:

1. Context 目前的值是取決於上層 component 距離最近的 <MyContext.Provider> 的 value prop
2. 當 component 上層最近的 <MyContext.Provider> 更新時，會觸發重新 render

--------------------------------

## **useReducer**

useReducer 是 useState 的替代方案，它接收一個 reducer 以及初始值。 並且回傳 現在的 state 以及其配套的 dispatch 方法。

至於甚麼是 reducer 以及 dispatch 下面會解釋。

當我們需要一次管理許多 state，useReducer 會比 useState 更適用，我們可以透過傳遞一個 diapatch 而不用傳遞很多個 callback function。

用法像下面這樣，範例取自 [React Hooks 官方文件](https://zh-hant.reactjs.org/docs/hooks-reference.html)

```jsx
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

useReducer 的其他特性則和 useState 一樣，包括:

1. dispatch 和 setState 一樣不會隨著 rerender 而改變
2. 支援 LazyInitializer
3. 如果在 Reducer Hook 回傳的值與目前的 state 相同，則不會再次觸發渲染

-------------------------------

## **useCallback**

在一個元件裡面，有一些函式並不需要在每次 render 都被更新，除非是它所依賴的值發生變化，為了讓函式有條件的更新，可以使用 useCallback。

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b)
  },
  [a, b],
)
```

這個例子裡 doSomething 依賴了 a, b，所以在第二個參數上以 array 的方式填上依賴的變數，這樣一來，在每次 render 時，新的跟舊的 array 會被拿來比較是否相同，不同的話會更新這個函式。

--------------------------------

## **useMemo**

useMemo 與 useCallback 大同小異，只不過它會回傳一個值而不是 function。如果有些值需要透過複雜的運算，那麼 useMemo 便可以讓需要重新計算時再重新計算即可。

```js
const memoizedValue = useMemo(() => doComplexCompute(a, b), [a, b])
```

------------------------------

## **useRef**

useRef 是一個十分有趣的 hook，因為與其他 hook 不同，它會回傳給你一個 mutable 的 object，並且每次 render 這個 object 都是一樣的。

所以在讀取 useRef 的 current 屬性時，它並不會被綁定在某次 render，它會隨時更新，會拿到甚麼值端看使用者何時讀取它。

它最常被用到的地方是 uncontrolled component，用法如下:

```jsx
  function InputElement() {
    const refContainer = useRef()
    return (
      <input ref={refContainer} />
    )
  }
```

當我們要取值的時候可以這樣寫:

```
const value = refContainer.current.value
```

此外，如果要記錄 render 的次數等等的功能也很適合使用 useRef

最後要注意的是，useRef 在其內容有變化時並不會通知你。變更 current 屬性不會觸發重新 render。


--------------------------



# **請列出 class component 的所有 lifecycle 的 method，並大概解釋觸發的時機點**

## **從圖表觀察 Class Component 的生命週期**

想要了解 Class Component 的生命週期，可以在 React 的官網上找到[react-lifecycle-methods-diagram](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

![img](https://i.imgur.com/6MRnMbT.jpg)

從這張圖可以很好的展示了在 Mount, Updating 還有 Unmounting 的過程中會呼叫哪一些函式。

**Mount** 顧名思義是要將 Component 給掛到 DOM 上面，所以說如果 DOM 裡面如果不存在這個 component，肯定會執行 Mount 的流程。

**Updating** 是指將 Component 進行更新，例如原本 DOM 上面已經存在某個 component，如果 setState 被觸發了，那麼會走 Updating 的流程。

**Unmount** 是指從 DOM 上面拿掉 component，所以說在 component 被 unmount 之後，如果想要再讓它出現，必須走 Mount 的流程。

下面來一一看看圖裡面的函式的實際應用吧!

## **Constructor**

Constructor 會在 component 進入 Mount 的流程的最一開始被呼叫，在這裡最常做的事情是設定 component 的 state，另外要跑一次 `super()`，跑一次 Compoent class 的 constructor。

```jsx
constructor(props) {
  super(props);
  this.state = {
    number: 1
  };
  console.log("construct Component");
}
```

## **shouldComponentUpdate**

從生命週期的圖中可以看到 shouldComponentUpdate 會在 update 的流程中呼叫 render 前使用，如果回傳 false 則不會更新，如果回傳 true 則會接續更新的流程，通常可以用在優化效能方面，看下面的例子。

```jsx
import { Component } from "react";
import Content from "./Content";

class Title extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "老鼠"
    };
    console.log("construct Title");
    this.handleChangeContent = this.handleChangeContent.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.content !== this.state.content) return true;
    return false;
  }
  handleChangeContent() {
    console.log("clicked");
    const options = ["倉鼠", "銀狐", "老公公鼠"];
    this.setState({
      content: options[Math.floor(Math.random() * options.length)]
    });
  }
  render() {
    console.log("render Title");
    return (
      <div>
        <h1>Title: 老鼠家族</h1>
        {<Content content={this.state.content} />}
        <button onClick={this.handleChangeContent}>改變內文</button>
      </div>
    );
  }
}

export default Title;
```

我們可以透過檢查 state.content 有沒有改變，來決定是不是要更新 component，這有賴於 shouldComponentUpdate 的參數裡會帶入即將改變的 props 以及 state。

來看一下 Demo 的影片，可以發現只有在 content 的內容實際變動的時候，才會觸發 render function。

![img](https://i.imgur.com/FaQJ8vv.gif)

## **componentDidMount && componentWillUnmount**

componentDidMount 會在 component 被掛載到 DOM 上時被呼叫，而 componentWillUnmount 則會在 component 被 unmount 前呼叫。

他們常常會被成雙使用，因為可能在 component 掛載後的 sideEffect 需要在 unmount 時被清除。

看看下面的範例:

```jsx
//Title.js
import { Component } from "react";
import Content from "./Content";

class Title extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "老鼠",
      isShow: true
    };
    this.handleChangeContent = this.handleClick.bind(this);
  }
  handleClick() {
    const options = ["倉鼠", "銀狐", "老公公鼠"];
    this.setState({
      content: options[Math.floor(Math.random() * options.length)],
      isShow: !this.state.isShow
    });
  }
  render() {
    return (
      <div>
        <h1>Title: 老鼠家族</h1>
        {this.state.isShow && <Content content={this.state.content} />}
        <button onClick={this.handleChangeContent}>開關</button>
      </div>
    );
  }
}

export default Title;
```

```jsx
//Content.js
import { Component } from "react";

class Content extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log("did mount");
    this.timer = setTimeout(() => {
      alert(this.props.content);
    }, 2000);
  }
  componentWillUnmount() {
    console.log("Will Unmount");
    clearTimeout(this.timer);
  }
  render() {
    return (
      <div>
        <h1>Content: {this.props.content}</h1>
      </div>
    );
  }
}

export default Content;
```

點擊按鈕除了可以調控是要將 Content component 給放上 DOM 或者是從 DOM 上面移除，也會同時修改 state.content 的內容。

在 DidMount 兩秒後會 alert 提醒新改變的 state.content 的值，不過因為如果 Content component 被 unmount 的情況下，實際上就不需要 alert 了，這時候在 componentWillUnmount 將 timer 刪掉便是很好的做法。

我們來看，點擊一次讓內容以及 alert 出現的情況。

![img](https://i.imgur.com/jFhSsY7.gif)

再接著看，連續點擊兩次讓內容快速出現又消失，這一次不會跳出 alert。

![Imgur](https://i.imgur.com/9OUs89H.gif)

### **componentDidUpdate**

componentDidUpdate 比較類似於 componentDidMount，不過他是在每一次元件更新時，被確保會被執行一次，除非 shouldComponentUpdate 回傳 false。

像 componentDidMount 一樣，可以拿來比對 prevProps/prevState 及 this.props/this.state 的 狀態差異，做像是存取 DOM、 重畫 Canvas、 AJAX 等等。


---------------------------


# **請問 class component 與 function component 的差別是什麼？**

在 React 的生態系裡，打造 component 有 class 還有 function 的選擇，如果要說他們間有甚麼最大的不同，那肯定是 

> function component 會捕獲 render 當下的狀態

這個意義可以在後面的解釋裡慢慢被闡述明白。

-----------

## **點餐系統**

假設有一家拉麵店的[點餐系統](https://codesandbox.io/s/practical-saha-6bmlb)，使用方式是先選擇下拉選單的品項，然後再按下面的 Order 按鈕確認訂餐。

你應該會發現，不論是按標註 class 或是 function 的按鈕，都會大概在三秒後 alert 訂餐的訊息。

不過如果現在試試看這個順序:

1. 選擇一樣餐點
2. 按下 Order 鈕
3. 切換到另一個餐點

兩種 Order 鈕都試試看，看看有甚麼不一樣。

* 按 Function 按鈕點餐的結果:

![img](https://i.imgur.com/Ovdwepe.gif)

* 按 Class 按鈕點餐的結果:

![img](https://i.imgur.com/oOxjE2W.gif)

令人驚訝的是 Class 按鈕的 alert 結果竟然會隨著切換選擇而切換。 哪一個按鈕的反應比較合乎消費者的認知呢? 

答案應該是 Function 按鈕的結果，因為按下點餐按鈕時選的餐點才是真正想要購買的餐點。

--------

## **發生了甚麼事**

如果仔細看一下，class component 的按鈕顯示 alert 的地方可以一窺一二。

```js
class OrderButtonClass extends React.Component {
  showMessage = () => {
    alert('Your order: ' + this.props.food);
  };
```

在 react 裡，props 是 imutable 的，就像是 javascript 的 primitive type 的特性一樣。看看下面的例子。

```js
const a = 3
b = a
a = 4
console.log(b) //3
```

不過上面這個 class component 的 props 怎麼會一起改變了呢? **事實上，this 是一個 mutable 的東西**，所以 props 被設計成綁在 this 底下就會有隨著原始值一起改變的效果。 

在點餐的例子裡，showMessage 在三秒後才讀取 this.props，可是這個時候 this.props 已經被改動了。

-----------

## **如何解決**

1. **提早將 this.props 的值給拷貝出來**

```jsx
class OrderButtonClass extends React.Component {
  showMessage = (food) => {
    alert('Your order: ' + this.props.food);
  };

  handleClick = () => {
    const {food} = this.props;
    setTimeout(() => this.showMessage(food), 3000);
  };

  render() {
    return <button onClick={this.handleClick}>Follow</button>;
  }
}
```

因為 String 原本就是 immutable，所以 `const {food} = this.props` 可以成功達成效果`。

現在如果試著這樣拷貝呢? `const item = this.props`

```jsx
class OrderButtonClass extends React.Component {
  showMessage = (item) => {
    alert('Your order: ' + item.food);
  };

  handleClick = () => {
    const item = this.props;
    setTimeout(() => this.showMessage(item), 3000);
  };

  render() {
    return <button onClick={this.handleClick}>Order</button>;
  }
}
```

事實上也是可行的。

2. **閉包**

第二個方法跟第一個方法有點類似，看以下的範例:

```jsx
class OrderButtonClass extends React.Component {
  render() {
    const props = this.props;

    const showMessage = () => {
      alert('Your order: ' + props.food);
    };

    const handleClick = () => {
      setTimeout(showMessage, 3000);
    };

    return <button onClick={handleClick}>Order</button>;
  }
}
```

記得在第一個方法裡我們實驗出 this.props 是 immutable 的，所以把所有的功能函式寫進 render 裡，並且在裡面將 this.props 做一個 snapshot，如此一來功能函式裡都會優先讀取這個 snapshot 的值。

既然所有含式都被寫進了 reder function 裡，便可以不用用到 class 了，改寫成以下的樣子：

```jsx
function OrderButtonClass(props) {
  const showMessage = () => {
    alert('Your order: ' + props.user);
  };

  const handleClick = () => {
    setTimeout(showMessage, 3000);
  };

  return (
    <button onClick={handleClick}>Order</button>
  );
}
```

這樣的寫法其實就是 function component 的寫法，以 argument 的方式傳進 props 一樣可以有 snapshot 的效果，這個效果在最一開始使用 function component 的按鈕點餐的時候便可以發現。

-----------------------

## **補充**

如果再回到一開始說的

> function component 會捕獲 render 當下的狀態

我們可以發現這個狀態不單單指 props，事實上在 function component 中，這個狀態也包含 state。

這次一樣來體驗看看使用 class component 與 function component 建立的點餐系統。

[Function component Demo](https://codesandbox.io/s/function-component-state-demo-tv6qo)

用 function component 的平台點餐會記住送出時的餐點

![img](https://i.imgur.com/OzYOUSi.gif)

[Class component Demo](https://codesandbox.io/s/class-component-state-demo-kqlhj)

用 class component 的平台點餐不會記住送出時的餐點

![img](https://i.imgur.com/x22JzTM.gif)

-------------------------

## 如果在 function component 也想要獲取最新狀態怎麼辦?

想要在 function component 擁有像 class component 的 this.state 一樣的東西可以使用 `useRef` 的 hook，useRef 的值是 mutable 的，並且當 rerender 的時候不會被刷新。

改寫點餐系統成這個樣子:

```jsx
import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";

function OrderSystem() {
  const [content, setContent] = useState("");

  const showContent = () => {
    alert("Your order: " + lastestOrder.current);
  };
  const lastestOrder = useRef('');

  const handleSendClick = () => {
    setTimeout(showContent, 3000);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    lastestOrder.current = e.target.value
  };

  return (
    <>
      <h2>點餐系統(Function)</h2>
      <input
        value={content}
        onChange={handleContentChange}
        placeholder="請輸入您要點的餐點"
      />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}
```

如此一來，alert 的值就會讀取到最即時在 input 裡的值了。


--------


# **uncontrolled 跟 controlled component 差在哪邊？要用的時候通常都是如何使用？**

表單元素在 HTML 裡面是一個很有趣的存在，因為它有自己的狀態，這麼說有些抽象，就拿 `input [type=text]` 來說，當使用者在輸入文字時，使用者輸入的資料會綁在 input 元素上，這樣一來當使用者送出表單便可以順利把資料傳送。

雖然表單元素讓瀏覽器控制看起來沒什麼問題，但如果你想要更多呢? 

比如說，
1.你有自己的規則想要檢查使用者的輸入
2.把表單資料送出的時候想要自動在 request 加上一些 header 或者欄位。

----------------

## **將控制權轉交給 react**

其實不只 `input`，諸如 `textarea` 或者是 `select` 等元素也都會有自己的狀態，這個狀態會隨著使用者的動作而更新。

等等，這聽起來跟 react 使用的概念好像喔! 就好像這些元素原本就有 state，當使用者輸入會引發 handler，而 handler 會呼叫 setState，使得在 state 在更新以後這些元素可以即時反映出輸入值一樣。

事實上，把這個概念用 react 實作的表單元素，就叫做 `controlled components`。

## **input**

來個簡單的範例，這個範例是希望可以讓使用者填入名字，然後在送出表單之後 alert 自己的名字。

```jsx
function EnrollForm() {
  const [formContent, setFormContent] = useState({
    username:''
  })
  const handleInputChange = (e) => {
    setFormContent({
      username: e.target.value
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    alert(formContent.username)
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">暱稱</label>
      <input 
        id="username" 
        type="text" 
        placeholder="您的回答" 
        name="username"
        value={formContent.username}
        onChange={handleInputChange}
      />
      <input type="submit" value="Submit" />
    </form>
  ) 
}
```

這邊有幾點可以注意:

1. 首先創建一個 state 準備儲存表單資訊
2. 將 input 的 value 轉交給 state 處理
3. handleInputChange 函式: 這是監聽 input 的內容變化的函式，當 input 的內容一變化，及時反映到 state 的值，同時觸發渲染，讓使用者看到變化。
4. handleSubmit 函式: 監聽 submit 事件，當 submit 事件發生，先將瀏覽器預設的動作給關閉，然後就得到了對 submit 事件 100% 的掌控權!

2、3 步是其中將控制權轉交給 react 的精髓所在。

雖然這麼做要多打程式碼，但現在我們可以輕易地將 input 裡面的值可以交給其他 component 使用，或是搭配其他 handler 做重置表單內容等等的舉動。

最後眼尖的人會發現 label 元素使用了 htmlFor 而不是 for，這是因為 for 關鍵字在 javascript 已經被占用的緣故。

--------------------

## **textarea**

使用 controlled textarea 的方法基本上與 input 沒有太大的差異，只有一些小細節，如果把剛剛的範例用 textarea 呈現會像這樣子：

```jsx
function EnrollForm() {
  const [formContent, setFormContent] = useState({
    username:''
  })
  const handleInputChange = (e) => {
    setFormContent({
      username: e.target.value
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    alert(formContent.username)
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">暱稱</label>
      <textarea
        id="username"
        name="username"
        value={formContent.username}
        onChange={handleInputChange}
      />
      <input type="submit" value="Submit" />
    </textarea>
  ) 
}
```

這邊要注意的是原本 textarea 的值是由他的 child 決定的，像這樣子:
<textarea>
  我是 textarea 裡面的內容
</textarea>

但是在 React 的 textarea component 裡面是由 value 的屬性決定。

----------------------

## **select**

先看一下一般狀況下 select 元素的使用:

```html
<select name="濃湯種類">
  <option value="巧達濃湯">巧達濃湯</option>
  <option value="番茄濃湯">番茄濃湯</option>
  <option selected value="玉米濃湯">玉米濃湯</option>
</select>
``

觀察一下玉米濃湯有 selected 屬性，代表現在選的選項是玉米濃湯，不過在 react 裡使用 select component 會稍微不同：

```jsx
function Selector() {
  const [formContent, setFormContent] = useState({
    purre:'玉米濃湯'
  })
  const handleChange = (e) => {
    setFormContent({
      purre: e.target.value
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Your order: ', formContent.purre)
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="purre">濃湯種類</label>
      <select 
        name="purre"
        id="purre"
        value={formContent.purre}
        onChange={handleChange}
      >
        <option value="巧達濃湯">巧達濃湯</option>
        <option value="番茄濃湯">番茄濃湯</option>
        <option selected value="玉米濃湯">玉米濃湯</option>
      </select>
    </form>
  )
}
```

注意在這個時候 select 有 value 的屬性，這樣一來可以綁定事件在 selector 上就好，比較簡易。

小結一下，不論是 `input [type=text]`、textarea 或者是 selector，只要採用 react 書寫，都適用 value 這個屬性來管理。

-------------------

## **批量處理**

另一個小細節是如何處理多個 input 的狀況，如果要幫每個 input 都寫一個 handler 也太麻煩了吧! 這時候可以幫 input 加上 name 的屬性來讓同一個 handler 統一判斷，範例如下:

```jsx
function Selector() {
  const [formContent, setFormContent] = useState({
    username: ''
    purre: '玉米濃湯'
  })
  const handleInputChange = (e) => {
    setFormContent((formContent) => {
      setFormContent({
        ...formContent,
        [e.target.name]: e.target.value
      })
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Your name: ${formContent.username}\r\nYour order: ${formContent.purre}`)
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">暱稱</label>
      <input 
        id="username" 
        type="text" 
        placeholder="您的回答" 
        name="username"
        value={formContent.username}
        onChange={handleInputChange}
      />
      <label htmlFor="purre">濃湯種類</label>
      <select 
        name="purre"
        id="purre"
        value={formContent.purre}
        onChange={handleInputChange}
      >
        <option value="巧達濃湯">巧達濃湯</option>
        <option value="番茄濃湯">番茄濃湯</option>
        <option selected value="玉米濃湯">玉米濃湯</option>
      </select>
      <input type="submit" value="Submit" />
    </form>
  )
}
```

```js
  const handleInputChange = (e) => {
    setFormContent((formContent) => {
      setFormContent({
        ...formContent,
        [e.target.name]: e.target.value
      })
    }
  }
```

這一段使用了 ES6 `computed property name` 的語法，可以輕鬆愉快的修改 state 的狀態。

---------------------

## **其他小細節**

* `input [type=file]` 在 react 裡是 uncontrolled 的元素喔! 只能讀取無法修改。
* 避免在 value 的地方使用 `undefied` 或者是 `null`，因為會失去對 input 的控制。像下面這個範例，就算沒有定義 onChange 函式，input 還是可以正常輸入...

```
function Example() {
  return (
    <input 
      value={null}
    />
  ) 
}
```

---------------------------------

## **uncontrolled component**

提了這麼多 controlled component 的用法，或許會好奇是不是有需要用到 uncontrolled component 的時候。

比如說有些時候我們可能只是想要很簡單的去取得表單中某個欄位的值，或者是有一些情況下需要直接操作 DOM（音樂播放器中有許多方法是直接綁在 <video> 元素上的)。

想要在 react 中使用 uncontrolled 的話需要 useRef 的協助。 useRef 有幾個特色:

1. useRef 會回傳一個物件，這個物件不會隨著每一次畫面重新渲染而指向到不同的物件，可以一直指向同一個物件
2. 在回傳的物件中，透過 current 屬性可以取得更動後的值

```jsx
  function InputElement() {
    const refContainer = useRef()
    return (
      <input ref={refContainer} />
    )
  }
```

當我們要取值的時候可以這樣寫:

```
const value = refContainer.current.value
```

為甚麼可以這樣寫呢? 想像我們用 document.querySelector 選到該元素後，保存在 useRef 回傳物件的 current 屬性內，因為 current 的值是 mutable 的，所以當我們想取用的時候都會拿到最新的值。









