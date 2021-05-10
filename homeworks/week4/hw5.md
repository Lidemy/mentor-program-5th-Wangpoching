## 請以自己的話解釋 API 是什麼
我的認知是 API 的功能就像菜單一樣，餐廳提供菜單，不過餐廳提供的不是食物，而是**服務**。我覺得有幾個地方可以講得更清楚一些。
1. 為甚麼要提供 API
2. 誰可以是 API 的提供者
首先，很重要的一點是，透過 API，提供者可以決定他們想要被使用的服務，**使用者只能使用 API 提供的服務**，其中一個主要的原因是提供者可以基於隱私問題或是方便管理的問題而不讓使用者直接接觸到後台。關於第二個問題，API 的定義可以很廣，舉個例子來說，作業系統會提供一些 API 讓它上層的應用程式可以去使用，像是幾乎所有程式語言都有 I/O 的功能，這是因為這些程式語言使用了作業系統提供的 API。

## 請找出三個課程沒教的 HTTP status code 並簡單介紹
4xx 開頭的 HTTP status code 是指 client 發生錯誤，下面列出三個課程裡沒提到的。
405 不被接受的 HTTP 動詞
406 需要 Proxy 驗證
414 要求的 URL 太長

## 假設你現在是個餐廳平台，需要提供 API 給別人串接並提供基本的 CRUD 功能，包括：回傳所有餐廳資料、回傳單一餐廳資料、刪除餐廳、新增餐廳、更改餐廳，你的 API 會長什麼樣子？請提供一份 API 文件。
### **ALL**

### **回傳所有餐廳資料**

##### 使用範例：
curl -X GET 'https://api.restaurants/list'

##### 回應範例：
[
  {'ID1'：'NAME1'}
  {'ID2'：'NAME2'}
  {'ID3'：'NAME3'}
  ...
]

-----------------------

### **NAME**

### **回傳單一餐廳資料**

##### 使用範例：
curl -X GET 'https://api.restaurants/{ID}'

##### 回應範例：
{'ID1'：'NAME1'}

-------------------------------

### **DELETE NAME**

### **刪除餐廳**

##### 使用範例：
curl -X DELETE "https://api.restaurants/{ID}"

-------------------------------

### **ADD NAME**

### **新增餐廳**

##### 使用範例
curl -X POST -H "Content-Type: application/json" -d '{"name" : name}' "https://api.restaurants"

--------------------------------

### **CHANGE NAME**

### **更改餐廳**

##### 使用範例
curl -X PATCH -H "Content-Type: application/json" -d '{"name" : name}' "https://api.restaurants/{ID}"


