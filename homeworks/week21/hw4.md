## **為什麼我們需要 React？可以不用嗎？**

### **前言**

就像 jQuery 曾經當紅一時一樣，前端框架或函式庫的出現是為了解決一些不方便，jQuery 是一套 JavaScript 的函式庫，它的重點在於支援跨瀏覽器操作 DOM。那是一個瀏覽器百家爭鳴的年代，各個瀏覽器提供操作 DOM 的方法有些並不一致，在這樣的情況下使得 jQuery 成為當紅炸子雞。 

當瀏覽器漸漸大一統以後，前端開發者們依舊面臨著一些難題，起因於我們往往要因為資料的變化而進行許多取得 DOM 或者變更 DOM 的操作，這主要會造成兩個問題。

1. 網頁規模大且複雜時，事件的管理、資料的變化和關係等都變得複雜，導致維護和 Debug 上越來越困難。
2. 當資料面變化後，在更新到頁面上時，容易造成不必要的頁面更新。

而 React 這個前端框架可以幫助使用者解決上面的兩個問題，所以這也是 React 目前方興未艾的原因。

### **React 的特色**

#### **不用直接操作 DOM**

不論使用瀏覽器原生的 API 操作 DOM 或者是 jQuery，都稱作 **Imperative programming**，
但這樣子的情況容易產生上面提到的缺點，也就是當網頁功能及架構變大及複雜時，會越來越難掌握事件及衍伸的狀態變化，程式碼也容易雜亂無章。

有鑑於此，React 採用的是 `Declarative programming`，我們只要讓 React 知道資料的狀態以及資料如何放進頁面裡，React 會替使用者在資料變動時進行更新 DOM 的操作。如此一來，不僅容易維護程式碼，也可以降低在網頁元素複雜時出現該更新的元素忘記更新的情況。

比如說像下面的範例，我們定義一個代辦事項，當我們想要更改代辦事項的時候，只要將 todo 的 content 內容更新，便可以達到 `document.querySelector('.todo-content').innerHTML = xxx` 的效果。 採用 `Declarative programming` 時使用者只需要很直觀的更新資料而不用操作 DOM，這就是 React 的功勞。

```jsx
let todo = {
  id: id.current,
  isDone: false,
  content: value,
  isShow: true
}

function Todo() {
  return (
    <Content>{todo.content}</Content>}
    <Buttons>
      <EditButton
        type="button"
        onClick={() => {
          if (isEditMode) return
          handleChangeMode()
        }}
      > 
      </EditButton>
      <DeleteButton type="button" onClick={handleDeleteTodo}> 
      </DeleteButton>
    </Buttons>
  )
}

```

這個時候 React 這個命名便顯得有些傳神了，因為 React 可以**及時反映資料的變化在頁面上**。

#### **打造可以被重複利用的元件**

React 也可以讓我們能輕鬆打造可以被重複利用的元件。 這些元件可以在不同的地方被重複使用，比如說很多網站都會有的 Hamburger Menu。

這樣的好處在於我們可以很好的在網頁各處達到一致性的更新，而不用同樣的程式碼，在專案中的多處重複書寫。

#### **單一方向的資料流**

在使用 React 的時候，當我們希望頁面有所變更時，使用的狀態資料就必須更新——這就是所謂的**單一方向的資料流**。

舉例來說，當使用者點擊了一個按鈕，React 會攔截並看看該做什麼。假設我們在此時改變資料的狀態，React 便會根據新的狀態，結合元件，更新 DOM。

下圖以新增代辦事項來說明，動作-資料-畫面的關係。

![img](https://i.imgur.com/kNylcyU.png)

這樣的好處可以讓我們在 Debug 時容易許多。因為我們只需要關注**資料存在何處，以及資料往哪個地方流去**。而不會發生資料更改，但忘記同步更新 DOM 的窘境。

#### Virtual DOM

剛剛提到單一方向的資料流，也就是說當資料改變了，React 便會將頁面重新渲染，然而資料在哪個部分被改變了沒有被納入考慮。

一樣以 Todo List 的例子來說明，假設目前 Todo List 上有 100 個代辦事項，現在我們想要加入一個代辦事項「清理房子」，結果 React 在發現資料更新以後，將這 101 個資料全都重新繪製了一遍。

假如我們不使用 React，可能會使用類似 `parentNode.append(xxx)` 的語法，這樣的狀況下只要在 DOM 上面新增一個元素即可，效能上似乎比使用 React 好了許多。幸好 React 使用了 VirtualDOM 的概念來解決這個問題。

首先，當渲染一個 React App 時，會將 DOM 先複製成一份 JavaScript 物件，而這也就是 VirtualDOM。當資料變化時，會將更新後的結果複製一份新的 VirtualDOM 出來。

最後，React 會拿新舊 VirtualDOM 進行比對，並將有差異的地方到實體的 DOM 中進行更新**這樣的優化過程就是所謂的 reconciliation**。 

下圖展示了 VirtualDOM 到 實際 DOM 的繪製流程（紅色代表更新的部分）。

![img](https://i.imgur.com/Umwj6u8.png)

### **總結**

總的來說，當我們透過 React 在開發時，可以很輕鬆的只關注在資料的管理，因為最後 React 會在背後為我們進行最有效率的 DOM 操作與更新。此外，因為組件可以拆分，讓我們不論在維護專案或是開發新專案都十分方便。

如果再回到前言觀察裡面提到的兩個問題：

1. 網頁規模大且複雜時，事件的管理、資料的變化和關係等都變得複雜，導致維護和 Debug 上越來越困難。
2. 當資料面變化後，在更新到頁面上時，容易造成不必要的頁面更新。

便可以發現都可以透過 React 順利解決!但可不可以不要用 React，當然也是可行的。

## React 的思考模式跟以前的思考模式有什麼不一樣

要知道 React 的思考模式有甚麼特別的地方我們可以用 Todo List 作為範例。 這個 Todo List 要有兩個功能，第一個要可以新增 todo，第二個要可以將 Todo List 的資料傳給後端存取，讓使用者可以在下一次拿到之前儲存的 Todo List。在新增 todo 時，有三種實作方式:

### 作法一: 同時更新 UI 與 資料

![img](https://i.imgur.com/mR1IUMT.png)

```js
$('input').keyDown((e) => {
  if (e.keyCode === 13) {
    // 更新 UI
    $('.todos').prepend(xxx)
    // 更新資料
    todos.push($(e.target).text())
  }
})
```

這個做法看起來不錯，但是問題是當網頁內容很複雜時，可能會發生忘記修改到畫面或是資料的情況，這時候資料與畫面就不一致了。

### 作法二：先更新 UI 才從 UI 取出資料

如果要確保資料與 UI 一致，要如何做到呢? 如果資料永遠由畫面產生，便可以確保畫面與資料一致。如果新增的 todo 的指令沒修改到 UI，那可以確保資料也不會新增一筆 todo 。

![img](https://i.imgur.com/XVverls.png)

```js
let todos = []
function getData() {
  todos = []
  $('.todo').each((todo) => {
    todos.push(todo.text())
  })
  return todos
}
$('input').keyDown((e) => {
  if (e.keyCode === 13) {
    // 更新 UI
    $('.todos').prepend(`<li>{$('input').value}<li>`)
    // 重新獲取資料
    getData()
  }
})
```

### 作法三: 先更新資料才重新畫 UI

如果要確保資料與 UI 一致，另一個方法是確保畫面永遠由資料產生，像下圖這樣。

![img](https://i.imgur.com/STnzAET.png)

```js
let todos = []
function render() {
  $('.todos').empty()
  $('.todos').append(
    todos.map(todo =>Todo(todo)).join('')
  )
}
function Todo(todo) {
  return `<li>{todo}</li>`
}
$('input').keyDown((e) => {
  if (e.keyCode === 13) {
    // 更新資料
    todos.push($('input').value)
    // 重新繪製 UI
    render()
  }
})
```

React 採用的想法正是這一種方式，處理資料還是處理 UI 比較簡單呢? 大部分的情況是處理資料比較簡單，因為它對於人眼比較沒有過多的雜訊，所以 React 採用第三種方式，讓使用者只要處理資料，而複雜的 render 畫面的部分則由 React 處理。

## state 跟 props 的差別在哪裡？

在 React 中 state 與 props 雖然都被定義在 component 中，但是它們的用途卻大相逕庭，下面列舉幾個它們不同的地方。 

### 以位置定義 props 與 state

在一個元件中 props 代表在元件函式中傳入的參數；而 state 則是在元件內自行管理的，可以想像成在函式內定義的變數。

所以 state 如果被當作參數傳給子元件時，它就變成了子元件的 props。

### 可不可以修改

props 是不可修改的，如果要修改 props 必須在父元素修改好再重新傳入到子元素。 下面是範例：

```jsx
/* Parent.js */
function Parent() {
  const [moneyForSister, setMoneyForSister] = useState(40)
  const allocteMoney = () => {
    setMoneyForSister(70)
  }
  return (
    <div>
      <Sister money={moneyForSister} argue={allocateMoney}/>
    </div>
  )
}

export default Parent;
```
```jsx
/* Sister.js */
function Sister({ money, argue }) {
  <div>我是女兒，我拿到{money}<button onClick={argue}>要求提升到70塊</button></div>
}
export default Sister;
```

![img](https://i.imgur.com/yzvttHY.png)

當按下 argue 鍵的時候，moneyForSister 會被改為 70，並觸發 Parent 重新渲染，所以 Sister 也會顯示 70 元。

state 則是可以修改的，不過要注意的是 setState 是非同步進行的。

### state 在渲染後才會更新

```jsx
const [count, setCount] = useState(0)

function increment() {
  setCount(count + 1);
}

function handleIncrementThreeTimes() {
  increment()
  increment()
  increment()
}
```
```jsx
const [count, setCount] = useState(0)

function increment() {
  setCount((preState) => {
    preState ++
    return preState
  });
}

function handleIncrementThreeTimes() {
  increment()
  increment()
  increment()
}
```

在第一個範例裡，當 re-render 完成後顯示的是 1，這是因為呼叫 setState 是非同步的，精確一點的來說，使用 setState 做更新時，實際上更新 state 的值是非同步的。所以在第一個範例裡，每次都更新為 count + 1，其實就是 setCount(1) 做了三次而已。

幸好如果要基於目前 state 的值來更新 state，可以使用在 setState 傳入函數的方式，這邊要釐清的一點是 setState 就算是放入函式一樣是非同步的，只不過如果是傳入函式， **React 會將 state 的值拷貝一次並當做參數來記錄當前 state 的變化**。最後再實際上非同步更新 state 的值，所以最後 re-render 完成後顯示的是 3。 

```jsx
const [count, setCount] = useState(0)

function increment() {
  setCount((preState) => {
    preState ++
    console.log(count)
    return preState
  });
}

function handleIncrementThreeTimes() {
  increment()
  increment()
  increment()
}
```

所以在上面這個範例裡，就算想在 setCount 傳入的函式裡獲取 state 的值，一樣不會立即更新。會在 console 得到

```
count: 0
count: 0
count: 0
```

### 為甚麼 setState 是非同步的

想像 Parent 和 Child 在一個 click 事件中同時呼叫 setState 的例子。如果立即更新畫面要渲染多次，但是如果是刻意等到所有的 component 都在它自己的 event handler 裡呼叫 setState，就可以節省很多效能。