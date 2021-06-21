## **六到十週心得與解題心得**

### **第六週**

----------------------------------

> 進入前端世界的大門

#### **HTML 標記語法的使用**

在前五週之後，第六週開始進入跟瀏覽器相關的部分，瀏覽器可以正確解讀 HTML 的內容，其中比較新穎的內容是 **SEO** 還有 **逃脫字元** 的使用。HTML5 裡新增了許多的 **語意化標籤（Semantic Elements）** ，這些標籤不僅讓開發上更清楚明瞭一些，也可以在 **無障礙網頁** 裡提供更友善的環境。

#### **CSS - 1 正確的選到對象**

只有用 HTML 的標籤寫成的網頁遠遠還不夠，我們需要針對特定的 HTML 元素的樣式進行設定。既然需要選擇元素那麼 **CSS Selector** 肯定是必須先熟練的，以下列出幾基本的 CSS Selector，更多練習可以在[CSS Diner](https://flukeout.github.io/)裡玩個痛快。

1. **A, B** : 同時符合，要同時符合逗號分隔開的元素。
2. **A B** ： 選擇 A 底下的元素 B，而且不管 A 底下的槽狀結構有幾層都會被翻出來找。
3. **A > B** ： 選擇 A 底下的元素 B，但是要注意是**一級血親**才適用而已。
4. **A ~ B** ： 選擇 A 的鄰居 B，注意這邊是 A 右邊同一層的所有鄰居。
5. **A + B** ： 選擇黏在 A 旁邊的 B（沒錯，就是右邊那一位而已） ，如果 A 的右邊那一位不是 B ，就選不到了。

還有很多常見的用法還有注意事項包括 **pesudo-classes**、**nth-of-type**、**nth-child**、還有 **selector 的權重** 等等，就不多提了。

#### **CSS - 2 幫網頁穿新衣**

順利選到元素以後要進行美化，其中有兩個非常重要的觀念 。

1. [盒模型](https://lidemy5thwbc.coderbridge.io/2021/05/25/css/)
2. [定位](https://lidemy5thwbc.coderbridge.io/2021/05/25/css/)

當我們了解盒模型以及不同定位元素的方式以後，可以試著練習一個強大的 display 選項–**flex-box**，這邊推薦[圖解：CSS Flex 屬性一點也不難| 卡斯伯Blog - 前端，沒有極限](https://wcc723.github.io/css/2017/07/21/css-flex/) 以及 [Flexbox Froggy](http://flexboxfroggy.com/)來練習。

最後個人覺得可以把 **word-break** **white-space** **overflow** **text-overflow** 這幾個屬性的功能給熟悉，因為他們在 RWD 上扮演著關鍵角色，除此之外剩下的細節大概上網查都不會有太大的問題。

#### **瀏覽器上好用的小幫手 - devtools**

devtools 的功能非常多樣，最基本的可以在上面修改 html 與 css 以外，也可以利用內建的 consle 頁面寫 Javascript，要觀察各個 response 跟 request 的內容、 查看 cookie、關閉快取等等功能都在裡面，可以說你想的到的功能可能都藏在裡面。除此之外，一些瀏覽器上的插件，比如說 **Dimensions** 還有 **Pesticide with autoupdate** 都是對前端工程師很實用的工具！詳細可以參考[Chrome 網頁除錯功能大解密](https://www.udemy.com/chrome-devtools/)。

#### **作業 - 餐廳網站主頁、表單**

第六週的作業打鐵趁熱，馬上要來切版，老實說看到餐廳網站的設計稿的時候，是很沒信心的，沒想到在跟著胡立的影片切了兩天以後，竟然切出來了，成品在[這裡]
(https://mentor-program.co/mtr04group3/Wangpoching/restaurant/) 
，設計師真的很厲害，作品美哭我。

接著另一個作業要全部自己切了，作業內容要切一個表單，在這個表單裡扎扎實實的練習了
form、input 的種種細節，包括最簡單的輸入文字的輸入框，到複雜一點的 check 欄位，最後費了一番手腳也是把表單切出來了，成品在[這裡](https://mentor-program.co/mtr04group3/Wangpoching/Lazy/)，在切作業的過程中，也開始學習去寫 RWD（Responsive Web Design），這邊可以記錄一下一般以寬度 768px 以上為平板與電腦，而 320px ~ 768px 為手機的版型。

### **第七週**

----------------------------------

> 前端再升級 JavaScript

#### **JavaScript 與瀏覽器的溝通**

在第六週純靜態網頁有了點概念之後，第七周開始引入程式碼讓使用者可以與網頁有些簡單的互動，雖然 css 的動畫可以達成一些簡單的效果但 Javascript 的彈性便更大了。要用 Javascript 選擇網頁上的元素需要了解 **DOM 模型**，DOM 模型基本上就是一個樹狀的結構，每個節點都可以找到自己的 parent 以及向下延伸到 child，當然位在根部以及頂部元素的不符合。

選到元素以後，Javascript 可以控制元素的 css、innertext，甚至也可以創造新的元素或是刪除元素。可以參考[這裡](https://htmldom.dev/)來知道瀏覽器上的 JS 可以拿來做甚麼。

#### **網頁事件處理**

網頁上的 Javascript 更重要的功能是可以處理 **網頁上的事件** ，諸如點擊、滑過、滾動等等，都是可以被偵測到的事件，而這些事件傳遞方式也非常的重要，簡單來說，事件會由 DOM 模型的根部傳到目標元素再回到根部，詳細可以查詢關鍵字，**捕獲與冒泡**。

Javascript 可以偵測到事件以後使用回呼函式（ call back function ），來做出相應的處理。最後，在網頁事件的處理裡面，有常常讓人搞錯的地方是 **preventDefault** 跟 **stopPropagation**，preventDefault 會中止元素預設行為，例如按下 submit 自動提交表單的功能；而 stopPropagation 則是停止事件在 DOM 模型中的傳遞，兩者互不相干，preventDefault 被執行以後不影響事件的傳遞，同樣的雖然事件傳遞被中斷，只要 preventDefault 被執行到一樣會中止預設的行為。 想知道更詳細請參考[這裡](https://lidemy5thwbc.coderbridge.io/2021/05/30/dom/)。

#### **瀏覽器上儲存資料**

在瀏覽器上儲存資料的方法最耳熟能詳的可能就是 cookie 了，server 透過 set-cookie 的 header 讓瀏覽器把 cookie 以 key、value 的方式存成小型文字檔，當瀏覽器再次造訪該 domain 的時候就會把它帶上，cookie 通常被拿來做身分驗證，在登入以後 server 會發一組 ID ，之後瀏覽器再用 cookie 帶上 ID ，server 透過 ID 可以查出它是不是合法的使用者，如果是便不用再次登入。

其他在瀏覽器上儲存資料的方法還有 **LocalStorage** 以及 **SessionStorage** ，這兩個方式不涉及與 server 的互動，透過 JS 可以指定將網頁的資料儲存在瀏覽器中，最常見的可能是ㄧ些部落格就算不小心關掉了還是會自動儲存草稿，這就是因為有設定了把輸入框內的內容及時存到瀏覽器內的功能，而 LocalStorage 以及 SessionStorage 的差別在於 SessionStorage 一旦是在新分頁開啟瀏覽器就會清除內容了，如果上網查詢 session 的定義是 **一段時間** 的意思，所以 SessionStorage 本身就隱含了在狀態結束就關閉的概念。

#### **作業 - 表單驗證、餐廳 FAQ 頁面、To Do List**

第七周的作業非常豐富，包含把第六週的表單做驗證、做餐廳 FAQ 頁面對話框伸縮的功能還有含 CRUD 的功能的代辦事項清單。

在表單驗證的作業裡雖然很快就生出了功能，可是在胡立的作業檢討裡才發現要怎麼把程式的**可重複利用性**提高是很重要的，尤其表單是個很常見的實作，寫一個可重複利用的程式模板會對後續很方便。

餐廳的 FAQ 頁面主要練習的是用 JS 加上 CSS 的 transition 功能做出伸縮效果，切版還是繼續會一直碰到的，如果版面切的漂亮自己就會很樂意加上很多功能。

最後一份作業是仿照之前學員的模板切出代辦事項清單，包括新增以及刪除的功能，雖然功能還不到完整，但也是花了很多時間，主要是在 CSS 的動畫上大費周章。

* [表單驗證](https://mentor-program.co/mtr04group3/Wangpoching/Lazy/form.php)
* [餐廳 FAQ](https://mentor-program.co/mtr04group3/Wangpoching/restaurant/FAQ.html)
* [To Do List](https://lidemy.github.io/mentor-program-5th-Wangpoching/homeworks/week7/hw3/)

#### **挑戰題 - 投影片**

第七周的挑戰題很有趣所以就下海去做了，投影片的功能我主要瞄準三個方向。

1. 左右換頁功能
2. 直接挑選頁碼
3. 自動換頁

我採用的實作原理其實很簡單，投影片的每一頁都是 flexbox 的一個子元素，一個子元素的寬度都佔了瀏覽器畫面的 100% ，透過調整 flexbox 的左邊位置來顯示不同張投影片，不過重點是要先把 flexbox 的 position 設成 absolute 或者 fixed 才可以這樣操作。

投影片的實作在[這裡](https://lidemy.github.io/mentor-program-5th-Wangpoching/homeworks/week7/challenge/)

#### **LIOJ1052 貪婪的小偷**

這周順便寫了 LIOJ1052 貪婪的小偷，如果有興趣的可以看[題目說明](https://oj.lidemy.com/problem/1052)，我原本的想法也是用貪婪法，就是先算出物品的單位價值再依序裝進背包，但問題是我們沒有考慮到 **背包的剩餘空間** ，如果要解決這個問題我們可以採用動態規劃的方法。

假設 DP[i,j] 代表在限重 j 的情況下試圖放入商品 1 ~ i 的最大價值，所以說如果題目有五項商品，背包限重十公斤，那麼 DP[5,10] 就是答案。DP[i,j] 的答案可能有兩種，一種是第 i 項商品超過背包限重，那麼答案便是 DP[i-1,j]；第二種情況要比較不裝（ DP[i-1,j] ）以及裝（ DP[i-1,j-Weight[i]] + Value[i] ），只要一直重複解出 DP 就可以得到正確答案。詳細的概念可以參考[這裡](https://www.youtube.com/watch?v=SE74vZQfvlY)，實作可以參考[這裡](https://www.youtube.com/watch?v=PkWGsbx0Uxw)。

### **第八週**

----------------------------------

> 前端基礎的最後一塊拼圖 - 在瀏覽器上用 JS 發送 request

#### **瀏覽器與伺服器的溝通**

在第四周練習了用 node.js 發 request 來串接 API，而瀏覽器一樣也可以發 request（廢話），不過就是因為有了瀏覽器這個中介而增加了許多麻煩，可以看以下的圖來了解用 node.js 發出 request 的差別還有在瀏覽器上發 request 的差別。

![img](https://i.imgur.com/Huwld3y.png)

其實瀏覽器就是一個很 GUI 的介面，所以它會很像個媽寶，在送 request 的階段會幫我們加一些 header，比如說如果不是傳送簡單請求的話，就會加上 origin 這個 header。當 response 傳回來以後它甚至會畫給你看，沒錯它就是這麼貼心。而我們在用 node.js 時，情況就比較單純，我們可以自己決定要對拿到手的東西做甚麼。

有一種狀況是在瀏覽器上寫 JS 發送請求，比如說我們想寫一個公車動態的網頁，上面的公車資訊我們會發送請求從別的 server 取得資料，有個麻煩是瀏覽器太媽寶了，它會直接把取得的內容重新繪製給你看，但幸好透過 **AJAX** 的技術可以避免這個問題，請看圖。

![img](https://i.imgur.com/qJDfh51.png)

在瀏覽器上的 JS 透過瀏覽器發送請求以後，接著瀏覽器拿到 response，然後轉交給 JS，重點就在這裡，瀏覽器不會畫出結果而是把結果給 JS，最後運用 JS 新增修改 HTML 元素以及更改 CSS 等功能就可以有很客製化的使用方式。不過要注意的是瀏覽器還是很媽寶，一樣會自己幫忙加 header，設 cookie，甚至有時候還不爽把 response 交給 JS 處理，這就牽扯到了 **同源政策** ，這部分的內容整理在[這裡](https://lidemy5thwbc.coderbridge.io/2021/06/05/AJAX/)。

#### **作業 - 餐廳抽獎頁面、顯示 twitch 熱門遊戲實況**

第八週的作業當然是應用這週所學在網頁上發送請求，並自己渲染從別的 sever 取得的資料。

首先要實作餐廳的抽獎功能，而餐廳的抽獎功能是串接[抽獎 API](https://dvwhnbka7d.execute-api.us-east-1.amazonaws.com/default/lottery)，然後更換網頁上的背景顯示抽中的獎項。

第二份作業要串接[twitch API](https://dev.twitch.tv/docs/v5)，這個頁面實在很燃，不僅 navbar 上的熱門遊戲是即時更新的，包括熱門遊戲的熱門實況也是即時更新。

* [餐廳抽獎頁面](https://mentor-program.co/mtr04group3/Wangpoching/restaurant/draw.html)
* [twitch 熱門實況](https://lidemy.github.io/mentor-program-5th-Wangpoching/homeworks/week8/hw2/)

#### **挑戰題 - 實測中獎機率**

第一個挑戰題要預估抽獎 API 的各個獎項出現的機率，其中一個有趣的是**確認輸入是數字**，
還滿實用的所以放在下面，

```
// 檢查是不是數字
function isNumber(text) {
  if (typeof text === 'number' && !isNaN(text)) {
    if (text >= 10 && text <= 1000) {
      return true
    }
  }
  return false
}
```

另外就是搭配 setTimeout 去控制發送 request 的時間差來避免一次發送大量 request 造成錯誤（這邊的 draw 是簡化的表示）

```
// 迴圈
function repeat(max) {
  if (count >= max) {
    return
  }
  draw()
  count++
  setTimeout(repeat(max), delay)
}
```

最後一點可以注意的是在計算百分比的時候通常會**調整百分比最小的數值，使總和達到 100**。

* [餐廳抽獎中獎機率](https://lidemy.github.io/mentor-program-5th-Wangpoching/homeworks/week8/challenge1/prizeRate.html)

#### **挑戰題 - 下滑載入更多**

第二個挑戰題是在 scroll bar 拉到底時，再發 request 到 API 獲得更多實況，要解決的問題在於**如何偵測 scroll bar 拉到底**。

底下提供監聽滾動事件的程式碼，這裡加入了預先載入的功能，在**尚未滑到底部時就先送出 request**，此外為了避免一直監聽到滾動事件，**監聽器設置成用一次就燒毀的**。

```
// 添加一次性滾動監聽器
function addOnceScrollListener() {
  const page = document.documentElement

  // 預先載入
  if (page.scrollHeight - window.innerHeight * 0.05 <= page.scrollTop + window.innerHeight) {
    window.addEventListener('scroll', addMoreStreams, {
      // This will invoke the event once and de-register it afterward
      once: true
    })
  }
}
```
在畫面渲染好時也要加入一個永久性的 scroll event listener

```
window.addEventListener('load', () => {
  window.addEventListener('scroll', addOnceScrollListener)
})
```

最後一個要注意的地方就是因為 request 回來的時間不一，所以在取得新的實況資訊時不能直接補在底部，可以考慮用 [Node.insertBefore](https://developer.mozilla.org/zh-TW/docs/Web/API/Node/insertBefore)來實作，也可以善用[dataset 屬性](https://developer.mozilla.org/zh-TW/docs/Web/API/HTMLOrForeignElement/dataset)來儲存每個直播的排名。

#### **eventloop**

第八週也對 eventloop 有了更深的認識，所謂同步可以想像只有一個工作程序，所以大家都要照順序，**處理完一個才換下一個** ，而非同步的概念是雖然還是要排隊，但是工作會**轉交給不同人處理**，所以不用等前一個人的工作處理完才輪到下一個人的工作開始處理。

在瀏覽器雖然 javascript 只有一個 thread，但是執行環境卻不只有一個 thread，以 setTimeout(function(), x) 的實作方式是讓瀏覽器去開另外一個 thread 去計時，那接下來的工作便可以在 main thread 繼續執行。 而 callback function 則會被放在最後，當 main thread 被清空以後才會排隊被丟進來。

說起來有點抽象，如果看胡立寫的[文章](https://blog.techbridge.cc/2019/10/05/javascript-async-sync-and-callback/)還有[所以說event loop到底是什麼玩意兒？| Philip Roberts | JSConf EU](https://www.youtube.com/watch?v=8aGhZQkoFbQ)肯定會有更深刻的認識。

### **第九週**

----------------------------------

> 前後端串聯

#### **MySQL 語法與 PHP**

第九週開始進入後端的課程，首先安裝了 XAMPP，XAMPP 裡面包含了 Apache server、MySQL 資料庫系統還有 FileZilla，可以說是相當方便。

Apache server 這一套 server 的實作是根據**檔案路徑**的方式，其中如果對 php 檔發送 request，**後端被設計成先執行完 PHP 程式碼才將輸出的內容以 response 傳回去**。 藉由這個特性，我們用 PHP 語法與 MySQL 資料庫系統連線以達成資料庫的 CURD 的功能，除此以外也可以隨時撈出資料庫的資料呈現在前端。

#### **Job Board 職缺報報**

第一個小試身手練習設計一個顯示職缺的網站的，除了首頁以外也包含一個管理員專用的後台，後台可以新增以及編輯職缺，在這個專案裡我對一個網頁該有甚麼功能還有點迷糊，大概就是照著做而已。

下面的圖是 Job Board 職缺報報的架構。

![img](https://i.imgur.com/FuUTkgu.png)

#### **部落格 Blog**

部落格這個專案的架構在首頁有預覽所有文章以及關於我的頁面，管理頁面則包含管理分類以及管理文章的後台，兩個後台都有新增以及編輯的功能。經過部落格的練習我終於對前台還有後台的架構有了初步概念（跟前端與後端不一樣），說起來有點模糊，看下面的圖就知道部落格 Blog 的架構了。

![img](https://i.imgur.com/5M33LJx.png)

值得注意的是後端儲存分類以及文章的資料庫以 category_id 連結，每篇文章都有一個分類，透過文章的 category_id，就可以在分類的資料表裡找到分類的名字，這就是所謂的 **關聯式資料庫**。

在這個實作裡也學到父 select 元素、子 option 元素的用法，可以作出下拉勾選的選單，而有 selected 屬性的 option 會被選為預設，而有 disabled 屬性的 option 不可選。

但是前端的板面 css 太少實在沒什麼動力做下去阿，嘆~ 所幸第十週還有真正的實作！

#### **留言板 - 初階實作篇**

首先先看一下留言板的主要架構，如下圖。

![img](https://i.imgur.com/WcgeJiX.png)

圖看起來有點亂，但是重點是實作了狀態功能，甚麼是狀態功能呢？在這個留言版的意思就是要記得我是登入的狀態呀！首先在**註冊帳號的時候，會把帳密等資訊存到 comment_users 表格裡**，接著在**登入**的時候，會**查詢 users 裡面有沒有符合的帳密，有的話就隨機產生一組 token，把使用者名稱以及 token 一併紀錄在 tokens 表格裡**，登入成功以後會進入主畫面，主畫面裡會使用 token 去查 tokens 表格裡的使用者名稱，然後再到 comment_users 表格裡撈出使用者的暱稱，順便也把 comments 裡的留言都秀出來，如果使用者有新增留言就會寫到 comment_users 表格裡。

對，有點複雜，但重要的地方就是有標粗體的地方，我們可以發現使用者登入的時候會隨機發一組 token ，這樣做的目的在於防止使用者偽造身分，假設使用者只要帶上使用者名稱就可以維持登入狀態，那只要使用者名稱被盜了，就危險了。相對的，因為在每次登入後，都會發給一組新的 token，大大降低了身分被冒用的風險。

關於登出部分的實作也很容易，只要把 tokens 表格裡的相對應行刪掉，就完成了，但這部分沒畫在架構圖裡，怕太複雜。

#### **留言板 - 內建 session 機制**

其實 PHP 就有內建上述的 token 功能，使用 PHP 內建 session 機制每次登入的時候，server 會請瀏覽器帶上一組 ssID，這組 ssID 可以存變數（存在後端），我們把 username 當作變數跟這組 ssID 存在後端，後續的流程便與原本一模一樣了。瀏覽器帶上 ssID 是使用名叫 cookie 的小型文字檔，想了解更多可以參考[這篇文章](https://lidemy5thwbc.coderbridge.io/2021/06/15/mysql-cookie/)。

* [留言板]()

### **總結**

-----------------------------------------------------------------------------

> 回顧這十個禮拜，終於可以串聯前端與後端，接下來便是我們發揮想像力的時間了！
