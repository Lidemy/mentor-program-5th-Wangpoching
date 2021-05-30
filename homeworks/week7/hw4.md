## 什麼是 DOM？
（Document Object Model, DOM）是一個樹狀的結構，像是 HTML 或是 XML 都是採用這樣的樹狀結構，這邊用一段 HTML 代碼打個比方。

```
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>DEMO</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<script src="./index.js"></script>
	<style>
		.outer {
			background:  red;
			width: 200px;
			height:  200px;
			margin-bottom: 10px;
		}

		.inner {
			background: blue;
			width: 50%;
		}
		.inside {
			background: black;
			border-radius: 50%;
		}
		a {
			color: white;
		}
		.outer2 {
			background:  green;
			width: 200px;
			height:  200px;
		}
	</style>
</head>
<body>
	<div class= "outer">
		<div class="inner">
			<a href="google.com">點我拜託</a>
		</div>
	</div>
	<div class= "outer2">
	</div>
</body>
</html>
```

如果畫成樹狀圖的話，大概是長這樣。不過請記得這個結構，因為後面還會用它來當範例。

![img](https://i.imgur.com/UXjq1fp.png)

## 事件傳遞機制的順序是什麼；什麼是冒泡，什麼又是捕獲？

假設我們現在在所有元素身上都裝上 click 事件的監聽器，寫法是這樣子。

```
window.addEventListener('load',
	function() {
		document.querySelector('.outer').addEventListener('click',
			function() {
				console.log(".outer")
			}
		)

		document.querySelector('.inner').addEventListener('click',
			function() {
				console.log(".inner")
			}
		)
		document.querySelector('a').addEventListener('click',
			function() {
				console.log("a")
			}
		)
		document.querySelector('.outer2').addEventListener('click',
			function() {
				console.log(".outer2")
			}
		)			
	}
)
```

現在我們點擊了超連結，我們預測 console 裡會印出 a，因為超連結的監聽器接收到了一個 click 事件，不過 console 印出

```
a
.inner
.outer
window
```

所以我們猜測一個 event 可能是像下圖這樣傳遞的。

![img](https://i.imgur.com/UXjq1fp.png)

不過其實這只是事件傳遞的一部分過程而已，其實在我們點選超連結的時候，事件的傳遞流程是這樣子的。

![img](https://i.imgur.com/IJmWdeI.png)

其中橘色的部分從 window 一路往下尋找到 a 元素，這一段叫做 **capturing phase**，可以想像成是一個出發去海底捕獲目標元素過程，當找到目標元素後，這個階段叫作 **targeting phase**，最後可以想像要回到海上，過程就像在海底吐一個泡泡，泡泡上升回到海面的過程因為四周水壓降低而膨脹，所以這個階段叫 **bubbling phase**。知道了事件傳遞的流程以後，有人可能會問，既然 addEventListener 只會監聽從 targeting 到 bubbling 這段過程，有甚麼辦法可以監聽到 capturing 的事件呢？

答案就是 addEventListener 函式的第三個參數，默認是 false ，會在 targeting 到 bubbling 階段添加監聽器；當改為 true 的時候則會在 capturing 到 targeting 階段添加監聽器，所以我們將剛剛的 javascript 程式碼再修改一下。

```
window.addEventListener('load',
	function() {
		window.addEventListener('click',
			function() {
				console.log("bubbling: window")
			}
		)
		document.querySelector('.outer').addEventListener('click',
			function() {
				console.log("bubbling: .outer")
			}
		)

		document.querySelector('.inner').addEventListener('click',
			function() {
				console.log("bubbling: .inner")
			}
		)
		document.querySelector('a').addEventListener('click',
			function(e) {
				e.preventDefault()
				console.log("bubbling: a")
			}
		)
		document.querySelector('.outer2').addEventListener('click',
			function() {
				console.log("bubbling: .outer2")
			}
		)
		window.addEventListener('click',
			function() {
				console.log("capturing: window")
			}, true
		)
		document.querySelector('.outer').addEventListener('click',
			function() {
				console.log("capturing: .outer")
			}, true
		)

		document.querySelector('.inner').addEventListener('click',
			function() {
				console.log("capturing: .inner")
			}, true
		)
		document.querySelector('a').addEventListener('click',
			function(e) {
				e.preventDefault()
				console.log("capturing: a")
			}, true
		)
		document.querySelector('.outer2').addEventListener('click',
			function() {
				console.log("capturing: .outer2")
			}, true
		)				
	}
)

``` 

當我們再次點擊超連結，這時候 console 印出

```
capturing: window
capturing: .outer
capturing: .inner
capturing: a
bubbling: a
bubbling: .inner
bubbling: .outer
bubbling: window
```

這次的流程大概是這樣的，成功監聽到了整個 event 的傳送流。

![img](https://i.imgur.com/KbDSIbV.png)


## 什麼是 event delegation，為什麼我們需要它？

想像一下如果在 .inner 底下有一百個 a 元素，而我們想要監聽這些 a 元素的點擊事件，想到要加一百次 eventListener 在每一個 a 身上就心很累，怎麼辦呢？如果這時候想到剛剛介紹的事件傳遞流就好辦啦！因為所有 a 的事件都會在 bubbling 的過程中傳遞到 .inner，所以我們只需要在 .inner 放上一個點擊事件的監聽器，就可以統計底下的 a 總共被點擊了幾次。

這邊示範 .inner 底下有三個 a 元素的程式碼。HTML 程式碼像這樣。

```
<!DOCTYPE html>

<html>
<head>
	<meta charset="utf-8">
	<title>DEMO</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<script src="./index.js"></script>
	<style>
		.outer {
			background:  red;
			width: 200px;
			height:  200px;
			margin-bottom: 10px;
		}

		.inner {
			background: blue;
			width: 50%;
		}
		.inside {
			background: black;
			border-radius: 50%;
		}
		a {
			color: white;
		}
		.outer2 {
			background:  green;
			width: 200px;
			height:  200px;
		}
	</style>
</head>

<body>
	<div class= "outer">
		<div class="inner">
			<a href="google.com">點我</a>
			<a href="google.com">點我</a>
			<a href="google.com">點我</a>
		</div>
	</div>
	<div class= "outer2">
	</div>
</body>
</html>
```

我們在 javascript 的程式碼為 .inner 放上點擊事件的監聽器，並且統計點擊目標是 a 元素的事件總共有幾次。

```
window.addEventListener('load',
	function() {
		let num = 0
		document.querySelector(".inner").addEventListener('click',
			function(e) {
				if (e.target.tagName === "A") {
					e.preventDefault()
					num++
					console.log(num)
				}
			}
		)
	}
)
```

## event.preventDefault() 跟 event.stopPropagation() 差在哪裡，可以舉個範例嗎？

最後要來介紹 **event.preventDefault()** 以及 **event.stopPropagation()**，如果眼尖的人可能會發現，前面的範例裡只要在 a 元素放上點擊事件的監聽器時，都會在裡面寫上 event.preventDefault()，作用是可以停止瀏覽器的預設動作，我們可以防止點擊 a 元素時網頁自動跳轉。如果好奇 event.preventDefault()會不會中斷 event 事件的傳遞，答案顯然是不會，因為上面的範例雖然取消了超連結的跳轉，但 console 還是成功印出了完整的事件流。

再來要介紹 **event.stopPropagation()** ，這邊有幾個問題，首先，event.stopPropagation() 會造成 preventDefault 的效果嗎? 我們在 .outer 的 capturing 階段中斷事件流，觀察一下網頁是否還是會跳轉。

```
window.addEventListener('load',
	function() {
		window.addEventListener('click',
			function() {
				console.log("bubbling: window")
			}
		)
		document.querySelector('.outer').addEventListener('click',
			function() {
				console.log("bubbling: .outer")
			}
		)

		document.querySelector('.inner').addEventListener('click',
			function() {
				console.log("bubbling: .inner")
			}
		)
		document.querySelector('a').addEventListener('click',
			function() {
				console.log("bubbling: a")
			}
		)
		document.querySelector('.outer2').addEventListener('click',
			function() {
				console.log("bubbling: .outer2")
			}
		)
		window.addEventListener('click',
			function() {
				console.log("capturing: window")
			}, true
		)
		document.querySelector('.outer').addEventListener('click',
			function(e) {
				e.stopPropagation()
				console.log("capturing: .outer")
			}, true
		)

		document.querySelector('.inner').addEventListener('click',
			function() {
				console.log("capturing: .inner")
			}, true
		)
		document.querySelector('a').addEventListener('click',
			function() {
				console.log("capturing: a")
			}, true
		)
		document.querySelector('.outer2').addEventListener('click',
			function() {
				console.log("capturing: .outer2")
			}, true
		)				
	}
)
```

結果 console 印出了

```
capturing: window
capturing: .outer
```

然後跳轉。 從這個實驗基本上可以理解事件流與瀏覽器的預設動作是分開的，當我們點擊超連結，事件流完整跑完一次，然後瀏覽器執行預設動作跳轉網頁，不過在事件傳遞的過程中，如果有監聽器引發了 event.preventDefault() ，那事件流結束以後，瀏覽器便知道不要執行預設的動作。當然，如果事件提早結束了，但是 event.preventDefault() 被掛在後面的監聽器上，那麼瀏覽器便不知道要停止預設行為。
