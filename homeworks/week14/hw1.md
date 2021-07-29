## 短網址系統架構

系統架構如下圖

![imgur](https://i.imgur.com/NDJPycF.png)

### 圖例

* LB: load balancer
* AS: application server
* KGS: key generating service

### API 設計

API 有兩種，一種是輸入短網址請求協助跳轉，另一種是輸入長網址獲取短網址。

### 架構設計

當 client 發送請求時，先透過 load balancer (LB) 將工作分配給空閒的 application server (AS) ，其中為了避免 single point failure ，所以備有備援的 load balancer。

如果是收到短網址的 API，AS 會先去 Cache 資料庫搜尋對應的長網址並返回 302 跳轉，如果沒有在 Cache 找到則到 Url 資料庫搜尋，Url 資料庫為了因應大量的儲存空間，所以進行切分。在 Url 資料庫找到長網址以後以 key/value 的形式放進 Cache 資料庫。

如果是收到長網址的 API，AS 會向 key generating service (KGS) ，為了避免 single point failure ，所以備有備援的 KGS。為了加速產生短網址的速度，設計在離線狀態下先隨機生成短網址並存在 key 資料庫，KGS 會先向 key 資料庫拿一些短網址存在內存方便快速轉交給 AS。最後 AS 將短網址/長網址存進 Url 資料庫並返回長網址。

### 過期數據刪除與回收

過期數據的處理也是以離線方式進行，在每個禮拜流量最少的時間，將已經被標記過期的短網址/長網址組合從 Url 資料庫移除，同時提醒 key 資料庫有新的短網址可以重新使用。
