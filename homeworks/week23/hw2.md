# Redux 是什麼？可以簡介一下 Redux 的各個元件跟資料流嗎？

## Flux

在 Redux 被提出來以前，類似的概念是 Flux，Flux 提出了 Store 的概念。 在 React 裡，因為每個 Component 都有自己的 State，為了共用這些 State，造成了許多麻煩。

例如將 State 往上移到 Parent State，最後 Parent Component 擁有一堆 State。

這樣的方法的好壞見人見智，不過有些人覺得這樣子不太自然，因為他們認為 child 應該擁有自己的 State 才可以做到元件獨立化。

底下是從 [React Flux](https://zh-hant.reactjs.org/blog/2014/07/30/flux-actions-and-the-dispatcher.html) 擷取的 Flux 資料流。

![img](https://i.imgur.com/vse3Db3.png)

我們可以看到存放 State 的地方被移出了 React views，統一存放在 Store。

接著透過 dispatcher 調用 callback 與 Store 互動形成單向的資料流。

## Redux 的資料流

下面用幫 todo-list 新增 todo 的例子來模擬 Redux 的資料流

### **使用者與 UI 互動**

使用者輸入 `Clean House` 以後送出 todo，此時會觸發幫綁在送出鈕上的 EventListerner。

![img](https://i.imgur.com/Vk2kDcL.png)

### **EventLister 調用 dispatch**

當 EventListner 被觸發以後會調用 store 的 dispatch 方法，通過 dispatch 方法，一個 action 便被送了出來。

![img](https://i.imgur.com/KnkrcoZ.png)

### **action 與 state 一起被送進 Root Reducer**

由 dispatch 送出的 action 會交給 rootReducer，rootReducer 裡頭有許多小的 Reducer 分別處理不同的 actions。

action 會被交給有定義這個 action 處理方式的 reducer，除此之外，這個 reducer 還需要知道目前的 state，假設是 `['Cook']` 好了。

![img](https://i.imgur.com/DZxOnKt.png)

補充: 不同的 reducer 可以處理同一個 action，一個 action 可能會更改到 store 的許多狀態，也是合情合理的。

### **產生新的 state**

最後 reducer 會產生新的 state，也就是 `['Cook','Clean House']`，接著重新渲染畫面讓使用者知道已經順利新增 todo。

![img](https://i.imgur.com/ptC4ZCp.png)

---------------------------

# 為什麼我們需要 Redux？

要回答這個問題，我想也許可以先看結果，也就是甚麼樣的專案適合用到 redux。

1. 專案中有大量的狀態需要管理，而且這些狀態都被許多元件共同使用。
2. 狀態更新的很頻繁
3. 更改狀態的邏輯很複雜時
4. 專案的源碼達到一定規模, 而且多人協作

## **Redux 的特性**

知道了甚麼樣的專案適合使用 Redux 以後，可以回頭來看為甚麼 Redux 可以滿足這些需求。

> A Predictable State Container for JS Apps
 
這是官網給 Redux 下的定義。 為甚麼說 Redux 是一個 `Predictable` State Container 呢? 這個問題可以從 [Three Principles](https://redux.js.org/understanding/thinking-in-redux/three-principles) 入手。

### **Single source of truth**

Global state 都被保存在 Single-state tree 中。

```js
// 透過 store 的 getState 方法來拿到 global state
store.getState()
```

### **State is read-only**

State 只能讀取，除非呼叫透過定義好的 action 發起更新請求。

```js
store.dispatch({
  type: 'ADD_TODO',
  payload: {
      id: 1,
      content: 'Clean House',
  }
})
```

### **Changes are made with pure functions**

這些 action 要如何改變 State 統一在 reducer 裡定義。

```js
function todos(state = initialState, {type, payload}) {
  switch (type) {
    case ADD_TODO:
      return [
        ...state,
        {
          id: id++,
          content: payload.content,
          isDone: false
        }
      ]

    case DELETE_TODO:
      return state.filter(todo =>
        todo.id !== payload.id
      )

    case EDIT_TODO:
      return state.map(todo =>
        todo.id === payload.id ?
          { ...todo, content: payload.content } :
          todo
      )

    default:
      return state
  }
}
```

reducer 被設計成可以組合的，因此可以合併成上面提到的 Single Global state，方便隨時彈性的擴充。

```js
import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'

const rootReducer = combineReducers({
  todos,
  visibilityFilter
})
```

## **結論**

我們可以稍微歸納 Redux 的幾個特性:

1. pure function
2. composition
3. predictable state

我們不難發現當 app 的狀態變得複雜或是多人協作的時候為甚麼 Redux 會是一個好選擇，因為通過 Redux，我們可以

* 清楚的定義每個動作對狀態的改變
* 輕易的擴張狀態的複雜度
* 更高效率的追蹤 app 在不同時間的狀態

----------------------

# 該怎麼把 React 跟 Redux 串起來？

## 狀態在組件間的傳遞

在 react 裡改變狀態的方法不外乎這兩種(先不討論 context):

* 由 parent 傳遞的 props 中的改變狀態的方法
* 在本身的組件裡創建 state

我們來看看[這個範例](https://codesandbox.io/s/hand-made-redux-origin-8k9ny)，在這個範例裡面。 App 元件底下有兩個元件，一個叫做 Nav，一個叫 Home。

當我們在 Home 的輸入框中想要達到**送出輸入框的內容來改變 Nav 上面的文字**，你會怎麼做呢? 

如果在 Home 元件創建 state 是不可行的，因為沒有辦法把修改這個 state 的方法先往上傳到 App 再往下傳到 Nav。

唯一可行的辦法是將 state 提升到 App 去，如此一來才可以順利透過 props 往下傳遞。

為了更清楚一點，可以參考這張圖。

![img](https://i.imgur.com/sSdd16t.png)

但是當兩個需要溝通的元件位在元件樹的相鄰很遠的距離呢? 像是這張圖這樣。

![img](https://i.imgur.com/YO8y4Fn.png)

除了辛苦的很上層的父元件傳遞下來還有沒有其他辦法呢?

## 自己想辦法

在進入教學以前，可以先看看[完成版](https://codesandbox.io/s/hand-made-redux-finish-tcqtb)。

### Global State

有一個解決辦法是創造一個 Global State，獨立於 react 的所有元件，大家都可以直接跟這個 Gloabal State 拿。

我們再回到最一開始的範例。

首先創建一個 global state。

```js
// globalState.js
let globalState = {
  navText: "Logo"
};

export { globalState };
````

接著在 Nav 以及 Home 元件都引入 globalState

```js
import { globalState } from './globalState'
```

在 Nav 呈現 navText 

```js
// Home
<Container>
  <Logo>{globalState.navText}</Logo>
</Container>
```

在 Home 加上 click EventListener 處理更新 navText 的內容

```js
// Nav
const handleClick = (e) => {
  const input = document.querySelector("#input");
  globalState.navText = input.value;
};
```

### subscribe

看起來好像可行，但問題是當 Home 不停的改動 navText，Nav 卻不知情，只要 Nav 的 render function 沒有被觸發就不會看到 navText 在畫面上更新。

不然換個想法好了，先把更改 globalState 的方法統一交由 globalState 這裡提供，只要有訂閱 globalState 的元件，就會在元件更改的時候收到通知，至於收到通知以後要做甚麼可以寫在訂閱的 callback function 裡，而這個 callback function 會被帶入新的 globalState!

直接上程式碼

```js
// globalState
const callbacks = [];

// 依序通知(執行所有訂閱者的 callback，並帶入新的 globalState)所有訂閱者
function notify() {
  const newState = JSON.parse(JSON.stringify(globalState));
  for (const callback of callbacks) {
    callback(globalState);
  }
}

// 一旦使用者使用 subscribe 便可以在 globalState 更新時自動執行 callback
export const subscribe = (callback) => {
  callbacks.push(callback);
};

// 要更改 globalState 統一交由 setGlobalState
export const setGlobalState = (state) => {
  globalState = state;
  notify();
};

let globalState = {
  navText: "Logo"
};
```

接著讓 Nav 訂閱一下吧! 而 Home 則需要用到 setGlobalState

```jsx
// Nav
function Nav() {
  const [navText, setNavText] = useState("");
  // 第一次 render 完訂閱 globalState，其中 callback function 則 call 自己的 setState function
  useEffect(() => {
    subscribe((globalState) => {
      setNavText(globalState.navText);
    });
  }, []);
  return (
    <Container>
      <Logo>{navText}</Logo>
    </Container>
  );
}
```

```jsx
// Home
function Home() {
  const handleClick = (e) => {
    const input = document.querySelector("#input");
    // 呼叫 globalState 提供的方法更改 globalState
    setGlobalState({
      navText: input.value
    });
  };
  return (
    <Container>
      <Input id="input" />
      <Button onClick={handleClick}>submit</Button>
    </Container>
  );
}
```

到此為止，已經可以達成元件間不用透過 props 跨組件的溝通了!

### connect

每次要訂閱都要像 Nav 一樣又用 useState 又用 useEffect 好麻煩，如果可以把他們抽成一個方法不是容易多了嗎?

請看程式碼:

```jsx
// globalState
export const connect = (Comp) => {
  // 把 useState 與 useEffect 抽到更高層的 component
  function container() {
    const [state, setState] = useState({});
    useEffect(() => {
      subscribe((globalState) => {
        setState(globalState);
      });
    }, []);
    // 把更新完的 state 用 props 的方式傳到原本的 component
    return <Comp {...state} />;
  }

  // 回傳更高層的 component 
  return container;
};
```

從這邊開始可以開兩個資料夾，一個存放原來的 components，一個存放 connect 過後的 components(或叫 containers)

```jsx
// ./containers/Nav.js
import { connect } from "../globalState.js";
import Nav from "../components/Nav.js";

export default connect(Nav);
```

記得在 App 的地方改成引入 connect 產生的 component 才算成功。

### dispatch

想想還有甚麼可以再優化的地方，如果是多人協作的話，直接動用到 setGlobalState 好像有點可怕，很容易發生在不知情的情況下把 GlobalState 弄成四不像的情況。

不然這樣好了，讓使用者只能使用特定的某些方式去修改 globalState 就不會發生預期外的情況了。

```js
// globalState.js

// 將 setGlobalState 換成 dispatch
export const dispatch = (action) => {
  // 只有指定的 action 可以更改到 globalState
  if (action.type === "UPDATE_NAVTEXT") {
    globalState.navText = action.value;
  }
  notify();
};
```

```jsx
// ./components/Home.js

// 將 setGlobalState 取代成 dispatch
import { dispatch } from "../globalState.js";
/*
....
*/
function Home() {
  const handleClick = (e) => {
    const input = document.querySelector("#input");
    // 發送 UPDATE_NAVTEXT 來更改 globalState
    dispatch({
      type: "UPDATE_NAVTEXT",
      value: input.value
    });
  };
/*
...
*/
}
```

### actionTypes

雖然有點龜毛，但是常常遇到把複雜的字串打錯的情況，像是剛剛的例子裡，action type 的名稱叫做 `UPDATE_NAVTEXT`，如果在 dispatch 時不小心打錯，沒人會知道，因為在 JS 看起來你就是輸入了一些字串，沒什麼問題。

如果把這些動作的種類名稱另外寫在某個檔案再引入，JS 便可以順利偵錯了，因為引入沒有定義的值是會丟出錯誤的。

```js
// actionTypes.js

export const UPDATE_NAVTEXT = 'UPDATE_NAVTEXT'
```

```js
// globalState.js
import { UPDATE_NAVTEXT } from "./actionTypes.js";

export const dispatch = (action) => {
  if (action.type === UPDATE_NAVTEXT) {
    globalState.navText = action.value;
  }
  notify();
};
```

```jsx
// ./components/Home.js
import { UPDATE_NAVTEXT } from "./actionTypes.js";

function Home() {
  const handleClick = (e) => {
    const input = document.querySelector("#input");
    dispatch({
      type: UPDATE_NAVTEXT,
      value: input.value
    });
  };
/*
...
*/
}
```

除了防止 action 的 type 打錯之外，action 除了 type 以外的 attributes 也滿令人頭疼的，因為可能有些 action 的 attribute 叫做 value、有些叫做 text 等等。

為了方便記憶，可以另外新增一個檔案，裡面放了許多定義好的 `action creator`，讓使用者不用辛苦的記 action 裡面有哪些參數。

```js
// actions.js

export const UPDATE_NAVTEXT = 'UPDATE_NAVTEXT'

export const updateNavText = (text) => {
  return {
    type: UPDATE_NAVTEXT,
    value: text
  };
};
```

```jsx
// ./components/Home.js

import { updateNavText } from "../actions.js";

function Home() {
  const handleClick = (e) => {
    const input = document.querySelector("#input");
    console.log(updateNavText(input.value));
    dispatch(updateNavText(input.value));
  };
/*
...
*/
}
```

### reducer

最後還有一點小困擾的地方是在 dispatch function 裡。目前的 dispatch 是這樣定義的。

```js
export const dispatch = (action) => {
  if (action.type === UPDATE_NAVTEXT) {
    globalState.navText = action.value;
  }
  notify();
};
```

當判斷 action type 的條件變多了以後，就很適合另外拆出另一個 function，像這樣子:

```js
const newState = reducer(currentState, action)
```

因為通過許多的條件判斷最後都是為了回傳新的 State，所以這樣寫可以很清楚的看出 dispatch 的邏輯。

所以現在我們會這樣子改:

```js
// globalState.js

export const dispatch = (action) => {
  globalState = reducer(globalState, action);
  notify();
};

function reducer(currentState, action) {
  switch (action.type) {
    case UPDATE_NAVTEXT:
      return {
        ...currentState,
        navText: action.value
      };
    default:
      return currentState;
  }
}
```

至於為甚麼要叫 reducer，因為跟 array 的 reduce 方法有異曲同工之妙!

最後看看[完成版](https://codesandbox.io/s/hand-made-redux-finish-tcqtb)複習一下吧!

## 使用 Redux

上面的範例其實是透過 Redux 的精神實作的，我們來看看如果使用寫好的 Redux 套件要怎麼達到跨組件的溝通吧!

首先安裝 `react-redux` 以及 `redux`。

底下會著重在 redux 如何與 react 連結的部分。

### connect 版本

connect 版本的範例在[這裡](https://codesandbox.io/s/react-redux-connect-version-fhb5q)。

在上層元素使用 Provider 讓底下的元件都可以取用 redux 的 store。

```jsx
import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

接著選取要接收 store 的元件，把它與一個更上層的元件 connect 起來，這個元件會收到最新的 store 變化，並且將 store 還有 dispatch 方法用 props 的方式傳給與它 connect 的元件。

這件事在自己動手做的部分有實際示範過，但是用 react-redux 套件會稍微不一樣。

```jsx
import { connect } from "react-redux";
import { deleteTodo } from "../redux/actions";
import App from "../components/App";

// 第一個函式可以接收到新的 store，返回值會被當作 props
const mapStateToProps = (store) => {
  return {
    todos: store.todosReducer.todos
  };
};

// 第二個函式可以接收到 dispatch 方法，可以利用它返回一些修改 store 的方法，並當作 props
const mapDispatchToProps = (dispatch) => {
  return {
    deleteTodo: (payload) => {
      dispatch(deleteTodo(payload));
    }
  };
};

// 連結! 產生一個上層元件
const connectToStore = connect(mapStateToProps, mapDispatchToProps);

export default connectToStore;
```
### hooks 版本

hooks 版本的範例在[這裡](https://codesandbox.io/s/react-redux-hooks-version-7ecdg)。

hooks 用起來比較簡單，使用 useSelector 以及 useDispatch 來取得 store 以及 dispatch 方法。

```jsx
import "./App.css";
import AddTodo from "./AddTodo";
import { useSelector, useDispatch } from "react-redux";
import { deleteTodo } from "../redux/actions";

function App() {
  // 從 store 取值
  const todos = useSelector((store) => store.todosReducer.todos);
  // 取得 dispatch
  const dispatch = useDispatch();
  return (
    <div className="App">
      <AddTodo />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.id} {todo.name}
            <button
              onClick={() => {
                dispatch(deleteTodo(todo.id));
              }}
            >
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```









