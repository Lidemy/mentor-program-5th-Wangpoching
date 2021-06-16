## 資料庫欄位型態 VARCHAR 跟 TEXT 的差別是什麼

在新增 SQL 的 TABLE 欄位的時候，會遇到 **TEXT** 、 **VARCHAR** 以及 **CHAR** 的選擇，是個壤人困擾的問題。

首先來比較 VARCHAR 以及 CHAR。CHAR 以及 VARCHAR 都可以設定一個 length 的參數，不過兩者對於 length 的解釋稍有不同。對於 CHAR 來說，length 代表**每筆資料都固定是 legth 的長度**；對於 VARCHAR 來說，length 代表**每筆資料不能超過 length 的長度**，所以說，VARCHAR 可以解釋成 length-variable CHAR （長度可變的 CHAR）。

再來看看 TEXT，text 沒辦法設定 length，所以它的彈性最大。

**TEXT** 、 **VARCHAR** 以及 **CHAR** 還有不同的地方 - 最大儲存空間，底下來比較一下 (XAMPP version 8.0.7)。

1.**CHAR**：A fixed length string (0 - 255）
2.**VARCHAR**：A variable-length string (0 - 65535)
3.**TEXT**：A TEXT column with a maximum length of 65,535 (2^16 - 1) characters, stored with a two-byte prefix indicating the length of the value in bytes

string 代表的是 byte (8 bits)，而不同的編碼需要花費不同數目的 bytes 去存取一個 character，所以 TEXT 很明顯的擁有最大的存取長度。

最後來看看他們的使用時機。

1. 長度常常變化的用 varchar
2. 知道固定長度的用 char
3. 太長的字串只能用 varchar 或者 text
4. 能用 varchar 的地方不用 text

為甚麼長度常常變化的地方要用 varchar 呢? 因為在 VARCHAR 的設定上我們只是給它一個最大值，然后系統會根據實際數據量來分配適合的空間。所以相比 CHAR 而言，可以占用更少的儲存空間。


## Cookie 是什麼？在 HTTP 這一層要怎麼設定 Cookie，瀏覽器又是怎麼把 Cookie 帶去 Server 的？

在瀏覽器與 sever 的溝通中，sever 並不會去記憶瀏覽器來訪的歷史，白話來說，就是 **server 是個臉盲**，你不管來過幾遍他都不會記得，再打個比方，server 不像早餐店的阿姨，早餐店的阿姨會記得你最愛吃的東西，不過在網路世界裡就不是這樣了，而這樣麻煩的地方在哪裡呢? 

舉個例子，假設有一個購物網站，如果 server 沒有辦法記住你是誰，第一次你訂了一台電風扇，第二次你再訂了一台冷氣，結果發現購物車裡只剩冷氣，因為 server 不知道上次買冷氣的是你，解決辦法就只能在一個 request 裡面一次選好所有的商品然後結帳。

那如果要讓 server 記住客戶端的狀態，有甚麼辦法呢？有一個好辦法是每次客戶在要買新的商品的時候，要一併把之前買的商品資訊也帶上去。不過這樣可能會有幾個問題。

1. 感覺很不厚道耶！還要叫客人存歷史資訊，不能存在 server 那嗎?
2. 客戶可以騙人，假如商品是有限量的，明明上次只搶到一份商品，下次客戶卻竄改成他搶到 10 份。

所以更好的方法是**身分驗證**，當客戶登入以後，server 會發給客戶一組 ID，之後客戶只要帶著這組 ID，server 便可以在資料庫撈到這個 ID 對應的使用者，而每次使用者進行的操作都會被存在對應的欄位裡（server 端)。

最後，要怎麼實作身分驗證呢？在 server 裡可以帶上 set-cookie 的 header，這個 header 包含了主要的內容以及適用的 domain 等等，而下次瀏覽器再次造訪這個 domain 時，就會把可以帶上的內容都放在 cookie 的 header 裡送出去，這樣一來當 server 收到的時候就可以做身分驗證了。

舉例來說，有一個留言板在登入後，server 會給瀏覽器一組 ID，然後在背後的資料庫裡在這組 ID 後面紀錄使用者名稱。

在處理登入的頁面 (handle_login.php)，server 請瀏覽器設置 cookie （一組 ssid）

![img](https://i.imgur.com/qhtDl0D.jpg)

server 的資料庫以 ssid 為名建立檔案並存入相關資訊（這裡以使用者名稱為例），注意這是 php 實作的方式而已。

![img](https://i.imgur.com/2IuvMKk.jpg)

導到主畫面以後，瀏覽器便帶著 cookie 這個 header，裡面的內容包含 ssid

![img](https://i.imgur.com/nVBmFcZ.jpg)

cookie 的內容包含 key 還有 value，也設定了在甚麼 domain 瀏覽器應該要帶上這個 cookie

![img](https://i.imgur.com/jh59Eu4.jpg)




## 我們本週實作的會員系統，你能夠想到什麼潛在的問題嗎？

1. 目前想到還可以設置一個管理員專用的畫面，介面跟主畫面很像，可以刪除留言。
2. 註冊可以加頭貼。


