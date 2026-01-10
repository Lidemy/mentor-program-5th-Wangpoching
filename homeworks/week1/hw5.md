
## 請解釋後端與前端的差異。
如果給前端還有後端一個比喻，前端可以想像成客人上牛排館。看菜單以後，點了一分半熟沙朗牛排，到此為止都是`前端的部分`；之後廚房將客人的菜單閱讀過後做出料理，這邊是`後端的範疇`，最後將沙朗牛排端給客人，這邊又`回到了前端`。
* 如果以 Line 機器人來說，前端指的是使用者介面的設計，諸如按鍵的設計、免責聲明、版型等等；後端可能是一個 API，API 可能會使用到資料庫，最後回傳訊息給使用者。
* 如果以網路的架構來說，前端指的是本機端，後端指的是網頁 sever 與資料庫。


## 假設我今天去 Google 首頁搜尋框打上：JavaScript 並且按下 Enter，請說出從這一刻開始到我看到搜尋結果為止發生在背後的事情。

1. 瀏覽器發出 request 到 DNS 伺服器詢問域名 google.com 的 IP位址是甚麼
2. DNS 回傳 response ， 瀏覽器解析 response 得知 google.com 的 IP 位址
3. 瀏覽器發出 request 到 google.com 的 IP位址，並且 request 的內容夾帶了搜尋的關鍵字 (想像寄了一封信，信封寫了 IP 位址，信件內容是關鍵字)
4. google 的主機利用關鍵字搜尋資料庫，並將查詢到的資料做成封包送回我們的電腦
5. 電腦的瀏覽器解析封包內的檔案呈現給使用者


## 請列舉出 3 個「課程沒有提到」的 command line 指令並且說明功用

### **cut**
cut 可以`逐行`擷取字串。

```
選項與參數：
-d  ：後面接分隔字元。與 -f 一起使用；
-f  ：依據 -d 的分隔字元將一段訊息分割成為數段，用 -f 取出第幾段的意思；
-c  ：以字元 (characters) 的單位取出固定字元區間；
```
其中 `-d` 與 `-f` 通常用在有特定分隔字元的大坨字串；而 `-c` 用在一行一行排列整齊的訊息，與其說不如實際往下看看實際範例吧!

1. **將 PATH 變數取出，取出特定路徑**
如果把環境變數打印出來，呈現出的資料是這樣的:
`/c/Users/RAZER/bin:/mingw64/bin:/usr/local/bin:/usr/bin:/bin:/mingw64/bin:/usr/bin:/c/Users/RAZER/bin:/c/Program Files/Zulu/zulu-17/bin:/c/Program Files (x86)/Common Files/Oracle/Java/java8path`

```bash
echo ${PATH}
```

我們可以發現每一個路徑都是用 **:** 分隔，因此我們可以下這樣的指令來獲取第 2 個路徑:

```bash
echo ${PATH} | cut -d ':' -f 2
```

2. **擷取連續字串**

如果想要得到資料夾底下的檔案的權限，可以擷取每一列的第 2 到第 10 個字。
```cmd
ls -l | cut -c 2-10
```

3. **擷取不連續字串**

擷取不連續字串時用逗點分開。
```cmd
ls -l | cut -c 2-3,5-6,8-9
```

4. **排除字串**

如果想擷取大部分的字串，可以設定不要的字串就好（一樣適用連續與不連續）。
```cmd
ls -l | cut -c 2-10 --complement
```

5. **輸出分隔的字串**

如果輸入是逗點分隔檔（.csv），可以設定分隔符號，再搭配前面的用法逐行擷取不同的欄位（一樣適用連續與不連續）。
```cmd
cut -d , -f 2 test.csv
```

### **sed**

#### sed 簡介

sed 是「stream editor」的縮寫，進行串流 (stream) 的編輯，處理串流資料的意義在於不用將整個檔案存到記憶體，而是**一行一行的處理**，以節省空間以及加快速度。

sed 的用法大概如下 `sed [options] [scripts] [inputFile]`，這邊用 Talor Swift 的 Red 的部分歌詞做示範，將部分的歌詞存進 red.txt 裡，內容如下:

```
Loving him is like
Driving a new Maserati down a dead end street
Loving him is like
Trying to change your mind once you're already flying through the free fall

Losing him was blue like I'd never known
Missing him was dark grey, all alone
Forgetting him was like trying to know somebody You never met
But loving him was red
Loving him was red
```

#### 常用的 options
---------------------------
1. **-n（沉默模式）** 
注意在沉默模式下，不會打印出結果。

```cmd
sed -n 's/him/her/1' red.txt
```

![Imgur](https://i.imgur.com/wrbANHB.jpg)

2. **-e （編輯模式）**

注意編輯模式只會打印結果，不會修改原始檔案，並且如果沒有輸入 option，-e 是預設的。

```cmd
sed -e 's/him/her/1' red.txt
```

![Imgur](https://i.imgur.com/L6xEvvR.jpg)

3. **-f（讀取檔案腳本）**

注意這個模式會讀取存放在檔案中的 sed 程式腳本然後打印出來。
現在假設寫一個腳本 sed_command.txt，內容是

```
s/him/her/
s/was/is/
```

接著在終端機輸入：
```cmd
sed -f sed_command.txt red.txt 
```

![Imgur](https://i.imgur.com/xFeaQ2d.jpg)

4. **-i（修改模式）**

注意 cat 出來的 red.txt 檔案裡每一行的第一個的 `him` 已經被取代成 `her`了，原始檔案被改變了。
註： 之後的範例還是維持原始的 red.txt 檔，也就是說做了一次 `sed -i 's/her/him/1' red.txt` 讓檔案恢復原狀。

```
sed -i 's/him/her/1' red.txt
cat red.txt
```

![Imgur](https://i.imgur.com/wqK43mG.jpg)

#### 常用的 script
---------------------------
1. **a（append）**

在第一行`後面`加上 `an apple`。

```cmd
sed '1a an apple' red.txt
```

![Imgur](https://i.imgur.com/AeNChuj.jpg)

2. **i（insert）**

在第一到第三行的`前面`都插入 `an apple`。

```cmd
sed '1,3i an apple' red.txt
```

![Imgur](https://i.imgur.com/tYnolJC.jpg)

3. **c（change）**

將第二行改成 `Living in the heaven`。

```cmd
sed '2c Living in the heaven' red.txt
```

![Imgur](https://i.imgur.com/qAxTWAB.jpg)

4. **d**（delete） 
刪除第一到第五行（刪除第一段）。

```cmd
sed 1,5d red.txt
```

![Imgur](https://i.imgur.com/OyYiLzw.jpg)

5. **s**（substitute） 

沿用介紹 `-e` 時所用的例子，這邊將每一行的第一個 `him` 給取代成 `her`，取代的語法可以寫成通式 s/regexp/replacement/[flags]，在這個例子裡 flags 是 1，代表每一行的第一個，下面會補充常用的 flags。

```cmd
sed 's/him/her/1' red.txt
```

![Imgur](https://i.imgur.com/L6xEvvR.jpg)

如果只想改動第一行:
```cmd
sed '1 s/him/her/1' red.txt
```

#### 常用的 flags
---------------------------
* [0-9]：只搜尋或者取代第 N 個字串
* g：全部取代
* I：忽略大小寫
* w：只顯示符合的結果（行），如果和其他 flags 使用要放在最後面。

### **exit**

```
exit
```
可以將終端機給關閉。



