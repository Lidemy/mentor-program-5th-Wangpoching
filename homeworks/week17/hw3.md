## 什麼是 MVC？

[express 的 MVC 架構](https://lidemy5thwbc.coderbridge.io/2021/09/10/MVC/)

## 請寫下這週部署的心得

[如何用 Nginx 伺服器代理 express 程式](https://lidemy5thwbc.coderbridge.io/2021/09/09/ngix/)

## 寫 Node.js 的後端跟之前寫 PHP 差滿多的，有什麼心得嗎？

### PHP

PHP + APACHE 的系統是透過檔案系統當作路由，所有的動作都交由 PHP 檔裡的程式碼進行，摻雜了權限驗證、資料處理、HTML 呈現，最後再交由 APACHE 送 HTML 給使用者。

根本就是個惡夢，PHP 裡甚麼都有，看得眼花撩亂，要 debug 都很吐血。

### Node.js

使用 express 當作後端伺服器的體驗真是比 PHP 好一百倍，template engine 裡只有單純的 html 還有已經撈出來的資料，權限驗證也可以分開寫在 Controller 的控制流程裡，撈取資料直接另外操作 Model 物件就好。

因為路由不是跟隨檔案系統，也更加彈性，可以在路由上使用變數，輕鬆創造不同路由
