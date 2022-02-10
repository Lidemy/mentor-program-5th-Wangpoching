## 跟你朋友介紹 Git
如果想了解 Git，首先得知道它是拿來做版本控制的一套軟體。

大部分的人一定都做過版本控制，比如說研究生在寫論文時，會有很多個版本，除了自己有許多個版本以外，指導老師也會提供意見修改，最後研究生可能會希望保留修改的每一個版本，並且把指導老師修改過的版本與自己的最新版本作合併。

我們以研究生寫論文的例子來看看，Git 可以如何幫我們做版本控制。

### Git 基本操作

#### git init

首先，在終端機輸入：
```cmd
git init
```
然後查看資料夾底下多了一個 .git 的資料夾，代表這個資料夾已經被 Git 納入了版本控制。

![img](https://i.imgur.com/McOLKM3.png)

接著，研究生將初稿給放進資料夾內，內容是 "this is my theses."。

![img](https://i.imgur.com/2uaxE9Z.png)

#### git status

現在想要確定一下目前版本控制檔案的狀態，在終端機輸入：
```cmd
git status
```

![img](https://i.imgur.com/TrBUdn5.png)

我們可以發現 thesis 這個檔案沒有被 Git 給追蹤 (tracked)，所以我們必須先將 thesis 讓 Git 追蹤，這樣一來如果之後 thesis 有任何改動都會被記錄下來。

#### git add

選擇將論文的初稿加入版本控制，在終端機輸入：
```cmd
git add thesis
```

再確定一下目前版本控制檔案的狀態，在終端機輸入：
```
git status
```

![img](https://i.imgur.com/P0TecYz.png)

會看到有 thesis 已經可以準備被提交 (commit) 了。

**提交**可以想像成為當前被版本控制的檔案做一次快照 (Snapshot)，這麼一來如果某一天在論文快完成的時候想要看剛開始的版本，便可以透過切換 commit 來達成。

#### git commit

接著要把剛剛 add 進來的檔案提交給 Git，在終端機輸入：
```cmd
git commit -am "student first commit"
```

在這次的 commit 訊息寫上 `student first commit`方便未來知道這是研究生第一次提交的版本。

#### git log

在完成快照以後，可以在終端機輸入：
```cmd
git log
```

![img](https://i.imgur.com/uQL8DK9.png)

透過 git log 可以查看所有的 commit，其中 `2c5a15c2fe86f46e29566ee3f897e4458267e79d` 代表的是這個 commit 的流水號

#### git diff

如果幾天當研究生校稿時，發現第一個字沒有大寫，因此將字首改成大寫以後完成第二版。
這時候可以先確認兩個版本的差別。

在終端機輸入:
```
git diff
```

![img](https://i.imgur.com/dUVpQXC.png)

上面可以看到被改動的地方。

#### git status

在 add 前我們還是使用 git status 檢查一下。

在終端機輸入:
```
git status
```

![img](https://i.imgur.com/J9EhjGE.png)

有趣的是這一次 thesis 並不是 untracked，而是 changes not staged for commit。

這個原因是因為前面就已經 ```git add thesis``` 過了，但即使 Git 已經可以追蹤到 thesis 發生改變，我們仍然需要透過 ```git add thesis``` 告訴 Git，我們想要將這個改動給 commit。


#### 第二次 git add & git commit

確認沒有問題以後，重複上面的步驟，在終端機輸入：
```
git commit -am "student second commit"
```

值得注意的是這邊可以不用再輸入 git add thesis，因為 git commit 的 -am 便包含了 add 以及 commit 的功能，但是要小心如果有新增檔案或是刪除檔案的異動還有要先 git add 再 git commit 才行。

### Git branch

#### 為甚麼要有 branch 的概念

接著要談到 branch ， branch 的中文是分支。

為甚麼要有分支呢? 像上面這樣一條線的開發會遇到甚麼問題呢?

讓我們看看一個軟體開發的案例。

1. 首先發布了一個穩定版本
2. 繼續 commit 新的功能的半成品，但還是把先前的穩定版本讓使用者使用
3. 有一個緊急的 bug 在穩定版被回報，由於只有一個 branch，於是只好繼續在穩定版 + 新功能半成品的 commit 上修 bug。
4. 緊急修完 bug 趕快 release，結果做到一半的功能也一併見光了，Boom!

![img](https://i.imgur.com/Js2y241.png)

如果有兩個 branch，就可以這樣做：

1. 首先發布了一個穩定版本
2. 在穩定版本上開一個新的 branch 進行新功能的開發
3. 緊急的 bug 在穩定版上被使用者回報
4. 在穩定版上修 bug/在新功能 branch 上開發新功能 同時並行
5. 緊急 bug 修復完成，使用者可以操作沒有 bug 的版本
6. 新功能完成合併到穩定版 branch，使用者不僅操作沒有 bug 而且也有完整的新功能

![img](https://i.imgur.com/d32Ma8U.png)


#### Git branch branchName 創建新的分支/ Git checkout branchName 在分之間遊走

現在假設研究生將第二個版本拿給指導老師改，那麼指導老師會新開一個 branch 來做修改。

要新開一個名叫 teacher 的 branch 並進入這個 branch， 在終端機輸入：
```cmd
git branch teacher
```

```cmd
git merge teacher
```

或者直接輸入：
```cmd
git checkout -b teacher
```

為了確定有沒有新增以及跳轉成功，在終端機輸入：
```cmd
git branch -v
```

![img](https://i.imgur.com/peCXHlT.png)

#### 在新的分支 commit

指導教授覺得用驚嘆號比較有氣勢，教授修改以後將修改後的版本提交給 Git 版本控制，在終端機輸入：
```
git commit -am "teacher first commit"
```

現在為了將指導教授做的改動加進自己的版本裡，先移動回研究生自己的 branch ，再使用 Git 的合併功能，在終端機輸入：
```cmd
git checkout master
git merge teacher
```

master 是研究生自己初始的 branch 的名稱，合併完成以後可以確認 thesis 的內容是不是已經變成 "This is my thesis!"。

這時候如果查看查看所有的 commit 紀錄，應該可以看見研究生的 commit 以及 指導教授的 commit 都在 master 這個 branch 裡面了。

合併分支的情況，請參考下面這張圖。

![img](https://i.imgur.com/JEwCXJ4.png)

最後把 teacher 的 branch 給刪除，在終端機輸入：
```
git branch -d teacher
```

### Github (git push & git pull)

#### git remote add

剛剛拿來給 Git 做版本控制的資料夾叫作一個 repository (倉庫)，Github 就是一個 Github 公司提供的空間讓我們可以把很多 repository 給放在上面。

首先在 Github 上創建一個 repository，步驟可以參考[這個連結](https://learning.lidemy.com/reports)。

接著要將本機端被 Git 控管與剛剛在 Github 上剛創建好的 repository 連動，在終端機輸入：
```
git remote add origin [url]
```

#### git push

在 url 的地方輸入 repository 的所在位置，現在本機端以及遠端的橋樑已經建立好了，接著要把本地的 master branch 給放到遠端，在終端機輸入：
```
git push -u origin master
```
現在 Github 上的 repository 裡就可以看到最新本的論文。

![img](https://i.imgur.com/Ed1RMbA.png)

如果在 Github 上的 thesis 加了一行日期 2022/2/16，

![img](https://i.imgur.com/mLWHwsI.png)

#### git pull

那麼本機端的 thesis 會新增這個改動嗎? 答案是不會，此時在終端機輸入：
```
git pull origin master
```
完成本機端的改動。

其實 github 上的 master 與 本地的 master branch 是兩條不同的 branch，所以我們需要進行 git push/merge 的動作來完成像之前 git merge 一樣的動作。

在 pull 完成以後本地與 github 端的 thesis 的內容應該都是：
```
This is my thesis!
2022/2/11
```

### 複習

最後複習學到的 Git 指令

* git init：將資料夾給 Git 管理
* git add [filename]：將資料夾內要做版本控制的候選檔案挑選出來
* git commit -am [commitMessage]：提交版本
* git status：查看目前檔案的改動狀態
* git diff：檢查目前與最新版本的差別
* git branch [branchName]：創建新 branch
* git checkout [branchName]：移動到不同的 branch
* git merge [branch being merged]：將別的 branch 合併到當前的 branch
* git log：查看當前 branch 的所有 commit 紀錄
* git branch -d [branchName]：刪除特定的 branch
* git branch -v：查看所有的 branch

### 補充

上面提到的都只是 Git 的滄海一粟，所以最後再補充一些常常遇到的狀況。

#### commit 了但是 commit message 打錯了

```cmd
git commit --amend
```

此時會進入 vim 編輯器，修改 commit message 內容存檔後就改成功啦!

#### commit 以後又反悔了

```cmd
git reset Head^
```

`Head` 代表當前的 commit，如果沒有特別跳到之前的 commit，基本上 Head 就是最新的，也就是你剛剛 commit 又反悔的那個 commit。

而`^`是前一個的意思，所以意思就是重設到 Head 的前一個 commit 的狀態。

其實如果使用
```cmd
git reset Head~2
```

我們也可以反悔回到前兩個 commit 之前的狀態。

有一個容易搞混的點是：
```cmd
git checkout [commitName]
```
git checkout 除了可以在 branch 間游移，也可以在 commit 間游移。

不過 checkout 只是在 commit 間跳動，並不影響所有的 commit。

可是 git reset 代表反悔，也就是說當我 reset 到某個 commit，他後頭的 commit 就全部都消失了，因為我反悔了嘛!

如果看不太懂 git checkout 與 git reset 的區別，可以參考[這篇文章](https://www.maxlist.xyz/2020/05/03/git-reset-checkout/)
。

#### 我不想讓 Git 追蹤檔案了

如果新增一個檔案，我們會使用：
```cmd
git add [filename]
```
把檔案讓 Git 追蹤。

但如果我反悔了，請輸入：
```cmd
git rm --cached [filename]
```

如此一來不論怎麼改 Git 都不知道了。

#### 我還沒 commit，但我改的東西我不想要了

有時候已經把改動的檔案 git add 以後才發現內容有錯，想要反悔再重新修改檔案怎麼辦?

在終端機輸入：

```cmd
git checkout -- [filename]
```

又是 git checkout!

我們回顧一下 git checkout 可以做甚麼：
1. 切換 branch
2. 切換 commit
3. 回復檔案狀態

#### 改 branch 的名字

這個狀況是常常手殘打錯 branch 的名字怎麼辦?

在終端機輸入：

```cmd
git branch -m [newBranchName]
```

#### 看到別人 github 上的專案好棒，想拿到自己的本地端

在開源的程式碼中，你可能為了協助開發而需要把專案從 gitHub 上抓下來，這時候可以在終端機輸入：

```cmd
git clone [url]
```

但是因為不是自己的專案，所以在 clone 下來的過程中是無法將檔案修該以後 push 回去。

怎麼辦呢? 這時候可以先在 github 專案的右上角找到 `fork` 的功能。

![img](https://i.imgur.com/APm5I8F.png)

按下 fork 以後會在自己的 github 裡有一份專案，這時候再將自己 github 上的專案 clone 下來，就可以進行 git push/git pull 的操作了。

