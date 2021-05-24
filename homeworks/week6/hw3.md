## 請找出三個課程裡面沒提到的 HTML 標籤並一一說明作用。

在 Html5 裡面引入了**語意化標籤**，可以讓搜尋引擎更好的了解一個網頁的架構，這邊提供三個補充的語意化標籤。

1. <main>：main 拿來放網頁的主要資訊。每個頁面只能有一個 <main> 標籤，所以可以很好的用來展現網頁的獨特性。
2. <aside>：通常用來放無外資訊，很多網站的側邊會有廣告獲推薦文章等等會放在 <aside> 裡。
3. <article><section>：網頁的幾個主要區塊可以使用 <section> 分割，而 <article> 通常包裹文章，比較細節沒意義的分割則使用 <div>。

## 請問什麼是盒模型（box modal）
先畫一下盒模型的圖

![img](https://i.imgur.com/A3EqXgy.png)

從這張圖可以看出來盒模型由內到外有四層，那通常在 css 的屬性可以設定寬高，那麼寬高是指哪裡呢？事實上，有一個屬性叫做 **box-sizing**，在這邊我們來看看把 box-sizing 調整成不同的屬性會發生甚麼事。

### 情況一： content-box
.box {
	box-sizing: content-box
	height: 100px;
	width:　100px;
	padding: 5px;
	border: 5px;
}

那結果會像下面這張圖

![img](https://i.imgur.com/Ksi7fHz.png)

### 情況二： border-box
.box {
	box-sizing: border-box
	height: 100px;
	width:　100px;
	padding: 5px;
	border: 5px;
}

那結果會像下面這張圖

![img](https://i.imgur.com/BsYluIB.png)

### 總結

1. 從上面的例子可以看出 content-box 的寬高設定是 content 的寬高，所以可以想像成 padding 以及 border 是往外延伸的。
2. 從上面的例子可以看出 border-box 的寬高設定是包含到 border 的寬高，所以可以想像成 padding 以及 border 是往內延伸的。
3. 無論是 content-box 或是 border-box，margin 都是往外延伸的。
4. background 指的是 content 加上 padding 的範圍，無關乎是哪種 box-sizing 模式。
5. 內容是放在 content 裡的，這也無關乎是哪種 box-sizing 模式。

## 請問 display: inline, block 跟 inline-block 的差別是什麼？

display 屬性有三種，接下來會一一介紹。

### block

block 的代表有 <h1>~<h6>、<div>。首先要知道的是 block 的元素**一個會佔一整行**，準確地說，雖然一個 block 元素的寬度通常沒有一整行這麼長，但下一個元素會從**下一行開始填充**。

假設有三個一模一樣的 block 元素，那結果會長得像這樣。

.box {
	display: block;
	width: 100px;
	height: 100px;
	background: red;
	margin: 10px;
	padding: 0px;
	box-sizing: content-box;
}

![img](https://i.imgur.com/qJc7Ba5.png)

稍微整理一下：
* 一個 block 元素無論寬高下一個元素都從下一列開始排。
* block 元素很乖，無論設 padding 或是 margin 都可以拉開元素間的距離。

### inline

block 的代表有 <span>、<a>。首先要知道的是 inline 的元素**不會改變自己的上下位置**。

假設有三個 inline 元素，那結果會長得像這樣。

.box1 {
	display: inline;
	width: 100px;
	height: 100px;
	background: red;
	margin: 10px;
	padding: 100px;
	box-sizing: content-box;
}

.box1 {
	display: inline;
	width: 100px;
	height: 100px;
	background: orange;
	margin: 10px;
	padding: 100px;
	box-sizing: content-box;
}

.box1 {
	display: inline;
	width: 100px;
	height: 100px;
	background: green;
	margin: 10px;
	padding: 100px;
	box-sizing: content-box;
}

![img](https://i.imgur.com/8SB9CKZ.png)

稍微整理一下：
* 一個 inline 元素無論寬高如何調整，寬高都是本身裡面內容的大小。
* inline元素比較傲嬌，無論設 padding 或是 margin 都只可以拉開左右元素間的距離，設上下的 padding 或是 margin 雖然有效果但不會影響到上下層元素。
* 總之 inline 元素的內容只會左右動不會上下動。
* inline 元素是先水平填充的，這一點跟 block 不同。
* 想想通常 <span>　還有　<a> 標籤都是在一段文字裡去加強某一段文字的效果，想想看如果　highlight 的文字把上下行的文字都擠開了，那排版會大崩潰。

### inline-block

inline-block 融合了　block 及　inline 兩者的特長，一起來看看。

假設有三個 inline 元素，那結果會長得像這樣。

.box1 {
	display: inline-block;
	background: red;
	height: 100px;
	width: 100px;
	margin: 10px;
	padding: 20px;
	box-sizing: content-box;
}

.box1 {
	display: inline-block;
	background: orange;
	height: 100px;
	width: 100px;
	margin: 10px;
	padding: 20px;
	box-sizing: content-box;
}

.box1 {
	display: inline-block;
	background: green;
	height: 100px;
	width: 100px;
	margin: 10px;
	padding: 20px;
	box-sizing: content-box;
}

![img](https://i.imgur.com/qQlM6pp.png)

稍微整理一下：
* inline-block 元素是水平優先填充的。
* inline-block 元素上下左右都可以撐開周圍的元素，width 以及 height 也可以調整。
* inline-block 的示意圖，虛線的框框代表 width 以及 height，都是 100px，雖然比例畫的很爛。

## 請問 position: static, relative, absolute 跟 fixed 的差別是什麼？

### static 

.static {
  position: static;
}

![img](https://i.imgur.com/Qsxg4SD.png)

### relative

.relative1 {
  position: relative;
}
.relative2 {
  position: relative;
  top: -20px;
  left: 20px;
  width: 500px;
}

![img](https://i.imgur.com/baah6nP.png)

### fixed

.fixed {
  position: fixed;
  bottom: 50%;
  right: 50%;
  width: 200px;
}

![img](https://i.imgur.com/g53hTlQ.png)

### absolute

.relative {
  position: relative;
  width: 600px;
  height: 400px;
}
.absolute {
  position: absolute;
  top: 120px;
  right: 0;
  width: 300px;
  height: 200px;
}

![img](https://i.imgur.com/C95e1WN.png)

