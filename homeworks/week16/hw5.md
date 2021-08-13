## 這週學了一大堆以前搞不懂的東西，你有變得更懂了嗎？請寫下你的心得。

這個禮拜學了很多跟 JavaScript 有關的知識，其實都離不開 JavaScript 的運行原理。

### V8 引擎

V8 引擎在啟動時會產生給 JavaScript 專屬的特定環境，稱為「執行環境」 (Execution Context)。

### 執行環境

執行環境是一個抽象的概念，任何 JavaScript 程式碼被執行、讀取的地方，例如 function 裡或是全域 ，都是執行環境。

### 執行環境堆疊 (Call Stack)

執行環境的堆疊可以想像成大胃王比賽，盤子疊的老高的場景，選手要吃只能從最上面拿，要放新的食物也會被放到最頂端。

### 執行環境初始化

要讓程式碼可以順利在執行環境內執行，需要走幾個步驟：

1. 創造全域環境物件/arguments 物件
2. 創造 this 物件
3. 記憶體指派流程

### Scope

Scope 是變數可以被取用/使用的範圍，也就是當前的 Execution Context，如果在 function 產生的執行環境內找不到某個變數，會向外部環境尋找看看該變數有沒有在外面被宣告，循著 ScopeChain 尋找。 ScopeChain 是由語彙環境 (Lexical Environment) 所決定的，也就是說變數的尋找順序是根據**function 在哪個 Execution Context 被定義**所決定的。

### 記憶體指派流程 (Hoisting)

在 Execution Context 被初始化的時候，為所宣告的變數保留記憶體空間，但還不會指派程式碼寫入的值，只會給初始值 undefined。也會為一般的函式宣告（ 使用 function 關鍵字宣告的函式 ）保留記憶體空間，且會將整個函式內容存入記憶體空間。

### 其他

#### JS 的物件導向

在 JavaScript 裡的語法糖 new，要可以為有執行 constructor 的功能，並且還要使得實例對象的方法都指向 class 本身所定義的方法。

所以在底層 new 大概是這樣的實作:

ES6 
```
class Dog {
  constructor(name) {
   this.name = name
  }
  sayHello() {
    console.log('hello')
  }
}

var puppy = new Dog('Peter')
puppy.sayHello()
```

ES5
```
// constructor
function Dog(name) {
  this.name = name
}

// new
function new(name) {
  var obj = {}
  Dog.call(obj, name)
  obj.__proto__ = Dog.prototype
  return obj
}
Dog.prototype.sayHello = function() {
  console.log(this.name)
}


var puppy = new('Peter') //puppy = obj = {name: 'Peter', __protot__: Dog.prototype}
puppy.sayHello()

```
#### this 在不同情境下的解讀

this 跟其他的變數有根本性的差別，除了 this 以外的變數是由語彙環境 (Lexical Environment) 所決定的，但是 this 卻是根據在哪裡被呼叫的。如果是直接被呼叫，this 會指向全域物件。

this 在物件導向裡則和其他語言相同，指向 class 的實例。









