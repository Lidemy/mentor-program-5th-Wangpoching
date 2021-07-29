## 網頁伺服器架站筆記

### 租虛擬主機

首先註冊 AWS 的帳號以後選擇地區，我選擇美東（俄亥俄）。

![img](https://i.imgur.com/uWbwD8E.png)

選擇 EC2 的服務。

![img](https://i.imgur.com/U2HiYQJ.png)

跑一台 EC2 的虛擬主機試試看吧!

![img](https://i.imgur.com/rf2uzNd.png)

選擇作業系統的映像檔，我選 Ubuntu 的作業系統。

![img](https://i.imgur.com/B6AhlQW.png)

接著選虛擬主機的配備，我乖乖選了免費的那個，畢竟目前還不需要處理能力很強的主機。

![img](https://i.imgur.com/e79dXxv.png)

接著可以按下一步直到第四步，設定硬碟容量，預設 8G，我改成 16G。

![img](https://i.imgur.com/t0f8r1w.png)

下一步要設定防火牆，要開啟特定的 port 才可以連線到自己的 EC2。 除了預設的 SSH 以外因應要架設網頁伺服器所以再加開 HTTPS 以及 HTTP。

![img](https://i.imgur.com/13MOozd.png)

最後要產生一組公/私鑰，並且把私鑰給存起來，之後用 SSH 連線虛擬主機的時候會需要。

![img](https://i.imgur.com/GIjZj14.png)

回到 EC2 的服務頁面，看看在運行中的 instances。

![img](https://i.imgur.com/odqokpL.png)

選擇剛剛租的虛擬主機，裡面有公開的 IPv4 地址。

![img](https://i.imgur.com/k6aQzjn.png)

### 設定虛擬主機環境

因為剛架好的虛擬主機空空的，只有作業系統而已，所以接下來要安裝伺服器還有資料庫的程式。

首先開啟終端機，我使用的終端機是 Git bash，如果想要用圖形化介面登入虛擬主機可以使用 `putty`，輸入存放私鑰的地址以及虛擬主機的
 IPv4 來連線。

```
ssh -i ~/Documents/test.pem ubuntu@18.116.242.227
```

第一次連線確認私鑰是用 SHA256 Hash 的，輸入`yes`

![img](https://i.imgur.com/buWsWXz.jpg)

連線成功，可以看到 IP 顯示 Private IPv4，可以回 AWS EC2 查看。

![img](https://i.imgur.com/HFImU56.png)

第一步先把虛擬主機的系統更新。使用 sudo 可以擁有 root 的權限，apt 是 ubuntu 系統內建的套件管理系統，輸入

```
sudo apt update && sudo apt upgrade && sudo apt dist-upgrade
```

接著安裝另一個套件管理程式`Tasksel`，方便接下來快速安裝伺服器以及資料庫系統，輸入

```
sudo apt install tasksel
```

開始安裝伺服器程式，輸入

```
sudo tasksel install lamp-server
```

安裝好伺服器程式以後應該也會順便裝好資料庫，測試登入資料庫看看，我們試著以 root 的身分連進名叫 mysql 的資料庫輸入

```
sudo mysql -u root mysql
```

成功連進資料庫應該會看到 prefix 變成 `mysql>`，代表接著可以輸入 mysql 語法。

![img](https://i.imgur.com/0QBcI2o.jpg)

到這邊先輸入

```
exit;
```

記得 mysql 的語法結尾要加上分號，因為我比較喜歡圖形化介面，所以測試有安裝 mysql 以後就先跳出來。接著安裝 myphpadmin，這是一個用 php 寫成的 mysql 圖形化管理系統。輸入

```
sudo apt install phpmyadmin
```

看到這個畫面以後按空白鍵選擇把 myphpadmin 裝在 apache server 底下，再按 enter。

![img](https://i.imgur.com/CB8asSH.jpg)

接下來因為我們的資料庫是空的，所以選擇 dbconfig-common 就好，直接按 eneter。

安裝好 phpmyadmin 以後要幫 phpmyadmin 設定一組密碼，因為當我們使用 myphpadmin 操作時，背後的原理是登入使用者 myphpadmin 到 mysql 進行操作。如果不設的話，系統還是會隨機產生一組密碼。

![img](https://i.imgur.com/iNnneZz.jpg)

基本設定到這邊差不多結束了，接著我們希望增加安全性，所以希望幫 mysql 的使用者 root 也設定一組密碼。輸入

```
sudo mysql -u root mysql
```
用 root 登入以後改變 mysql 這個資料庫裡 user 這張表格的設定為 root 要使用密碼登入，輸入 mysql 語法

```
UPDATE user SET plugin='mysql_native_password' WHERE User='root';
```

接著把 user 的設定提取到內存裡，這樣就可以在不重新啟動 mysql 的情況下讓改動生效，這樣可以防止修改 root 設定以後，重開 mysql 無法登入的尷尬情況。輸入

```
FLUSH PRIVILEGES;
exit;
```

接著要設定 root 的密碼，輸入

```
sudo mysql_secure_installation
```

再來要選擇密碼強度，不同的強度有不同規範，我選擇 1，要符合長度大於 8、包含大小寫、包含特殊字元三個規定。

![img](https://i.imgur.com/meZBgIR.jpg)

接著可以一直選擇 yes，到了要不要允許阻擋遠端連線到 mysql，我選擇 no，這邊可以依照個人喜好。

![img](https://i.imgur.com/6habdgZ.jpg)

然後繼續輸入 yes，直到 All done。

![img](https://i.imgur.com/28F7azg.jpg)

最後確定一下有沒有架站成功，在瀏覽器輸入 IPv4/，觀察是不是出現這個畫面。

![img](https://i.imgur.com/htQX8XN.png)

然後在瀏覽器輸入 IPv4/myphpadmin，輸入帳號 root 以及剛剛設定的密碼試試看能不能登入成功。

![img](https://i.imgur.com/xgXXMOJ.png)

### 搬移資料庫

虛擬主機有了，伺服器有了，資料庫也有了，接下來就把以前寄人籬下的資料表都匯進自己的資料庫吧!

首先先登入原本存放資料表的地方，點擊 export，接著選擇 Costom，勾選要輸出的資料表們，匯出格式選 SQL。

![img](https://i.imgur.com/Z8feW9r.png)

拉到最下面匯出。

![img](https://i.imgur.com/0up4q3u.png)

好奇瞧一瞧輸出了甚麼，原來是一堆創建 table 還有插入資料的語法，所以匯入的時候就會執行這些 mysql 語法省得自己輸入到崩潰。

![img](https://i.imgur.com/OmEROq1.png)

再來登入自己的 phpmyadmin，一樣在瀏覽器輸入 IPv4/phpmyadmin。

登入以後選擇或創建一個資料庫來匯入。這邊示範建立一個名叫 boching 的資料庫，global 的編碼我選擇 `utf8_general_ci`，因為這樣可以正常顯示 emogi。

![img](https://i.imgur.com/JErMSVx.png)

接著點擊 import，以檔案匯入剛剛匯出的 SQL 檔，按 GO 執行。

![img](https://i.imgur.com/M5R32jO.png)

成功以後可以看到冒出了好多資料表。

![img](https://i.imgur.com/TsfQMNO.png)

### 遠端連線資料庫

我們輸入 IPv4/phpmyadmin 登入 mysql 的時候，其實不是直接用 3306 port 直接遠端連線，是先透過 HTTP/HTTPS 連線到虛擬主機以後，虛擬主機再用 localhost 連線 3306 port。

如果我們想用 mysql workbench 之類的軟體遠端連線到 mysql，在目前的設定下會失敗。

![img](https://i.imgur.com/8U9kyI9.png)

讓我們來破解一層層的限制吧!

首先回到 AWS，選擇 EC2，選擇剛剛創建的虛擬主機，然後點擊 Security 來設定防火牆。

![img](https://i.imgur.com/LqWBie3.png)

點擊編輯防火牆設定。

![img](https://i.imgur.com/4EWge0L.png)

新增 MYSQL port。

![img](https://i.imgur.com/VLjU79J.png)

很可惜的是這樣還不夠（直接劇透）。因為 mysql 本身還會阻擋遠端連線，那就繼續努力吧!

先連線到虛擬主機

```
ssh -i ~/Documents/test.pem ubuntu@18.116.242.227
```

修改 mysqld.cnf 裡的設定。

```
sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
```

輸入 `/bind-address` 搜尋到 bind-address = 127.0.0.1 那行，在最前面加上 # 或 將 127.0.0.1 改成 0.0.0.0，記得要 wq 喔！

![img](https://i.imgur.com/OvqmQRN.jpg)

然後重啟 mysql。輸入

```
sudo service mysql restart
```

最後一步，我們登入 phpmyadmin 來解除個別使用者的遠端連線限制。點擊 User accounts，編輯 root 使用者的權限，選擇 Any Host。

![img](https://i.imgur.com/8aHMVmc.png)

![img](https://i.imgur.com/cy6rSvE.png)

執行以後，到 SQL 先輸入 FLUSH PRIVILEGES。然後回到 User accounts 繼續完成設定。

### 租域名與設定子網域

大致上終於完成了，接著設定租域名以及設定子網域的部分可以參考[AWS EC2 部署網站：卡關記錄 & 心得](https://nicolakacha.coderbridge.io/2020/09/16/launch-website/)。

因為如果要使用 HTTPS 連線的話要有 SSL 信賴憑證，所以我們把 DNS 設定轉交給 CloudFLare，請參考 [CloudFlare 介紹與設定](https://blog.dcplus.com.tw/marketing-knowledge/ecommence_platform/144759)，這樣我們就有免費的 SSL 憑證了。

### 佈署網頁

大功告成以後就可以把東西都塞進伺服器裡，伺服器預設會去找 /var/www/html/ 下的資料，所以我們先把權限開起來。

連線到虛擬主機後在終端機輸入

```
sudo chown ubuntu /var/www/html
```

現在可以開心地把 github 上的東西直接拉下來了，輸入

```
git clone 'repository 的網址'
```

如果想要圖形化介面傳輸檔案，可以開啟例如 FileZilla 之類的軟體，選擇 SFTP，輸入 IPv4，使用者 ubuntu，並上傳密鑰就可以連線了。

![img](https://i.imgur.com/KHAyRSg.jpg)

登入成功啦，一樣進到 /var/www/html 來把資源丟進來。

![img](https://i.imgur.com/Ird12Xa.jpg)

小提醒，記得把 php 的連線檔改成新的使用者名稱以及密碼喔，這樣基本上就大功告成了。

### PHP 的龜毛小優化

如果有閒情逸致的話可以對伺服器處理 PHP 檔作一些設定。

可以先設定 PHP 的 short cut，就不用每次都寫 `<?php ?>`，可以寫成 `<? ?>`，除此之外還有其他 short cut。

在終端機輸入

```
sudo vim /etc/php/7.2/apache2/php.ini
```

這是伺服器執行 PHP 的設定檔，**把 short_open_tag = 改成 ON**。

先別急著 wq，可以順便設定讓 PHP 噴的錯會顯示在網頁上。

把 **display_errors = 改成 ON**，然後 wq。

最後重啟 apache2 讓改動生效，輸入

```
sudo service apache2 restart
```

### 停用虛擬主機

因為怕資料外流所以我最後把示範的虛擬主機停用。

一樣登入 AWS，並選擇 EC2，點選要停用的虛擬主機，在 Instance state 下拉選單中選擇 Terminate instance。

![img](https://i.imgur.com/qBljCWu.png)

不久以後，就不會再看到被 terminate 的 instance 了。

