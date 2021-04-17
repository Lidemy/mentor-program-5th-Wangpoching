## 跟你朋友介紹 Git
如果想了解 Git，首先得知道它是拿來做版本控制的一套軟體。大部分的人一定都做過版本控制，比如說研究生在寫論文時，會有很多個版本，除了自己有許多個版本以外，指導老師也會提供意見修改，最後研究生可能會希望保留修改的每一個版本，並且把指導老師修改過的版本與自己的最新版本作合併。我們以研究生寫論文的例子來看看，Git 可以如何幫我們做版本控制。

### Git 基本操作

首先，在終端機輸入：
```
git init
```
然後查看資料夾底下多了一個 .git 的資料夾，代表這個資料夾已經被 Git 納入了版本控制。

![Imgur](https://i.imgur.com/wGq1l2m.jpg)

接著，研究生將初稿給放進資料夾內，內容是 "this is my theses."。

![Imgur](https://i.imgur.com/1aiNbPm.jpg)

選擇將論文的初稿加入版本控制，在終端機輸入：
```
git add thesis
```

現在想要確定一下目前版本控制檔案的狀態，在終端機輸入：
```
git status
```
會看到有一個新的檔案 thesis 準備要被提交 (commit)。

接著只要把剛剛 add 進來的檔案提交給 Git 管理便可以了，在終端機輸入：
```
git commit -am "student first commit"
```
在這次的 commit 標註 student first commit 方便未來知道這是研究生的第一次提交版本。

如果幾天當研究生校稿時，發現第一個字沒有大寫，因此將字首改成大寫以後完成第二版。
這時候可以先確認兩個版本的差別，在終端機輸入，
```
git diff
```

![Imgur](https://i.imgur.com/lqQN5gl.jpg)

確認沒有問題以後，重複上面的步驟，在終端機輸入：
```
git commit -am "student second commit"
```
值得注意的是這邊不用再輸入 git add thesis，因為 git commit 的 -am 便包含了 add 以及 commit 的功能，但是要小心如果有新增檔案或是刪除檔案的異動還有要先 git add 再 git commit 才行。

### Git branch

接著要談到 branch ， branch 的中文是分支，現在假設研究生將第二個版本拿給指導老師改，那麼指導老師會新開一個 branch 來做修改。
要新開一個名叫 teacher 的 branch 並進入這個 branch， 在終端機輸入：
```
git branch teacher
git checkout teacher
```

指導教授發現了 theses 應該改成 thesis，教授修改以後將修改後的版本提交給 Git 版本控制，在終端機輸入：
```
git commit -am "teacher first commit
```

目前的大致情況，請參考下面這張圖。

![Imgur](https://i.imgur.com/EJgmdlJ.png)

現在為了將指導教授做的改動加進自己的版本裡，先移動回研究生自己的 branch ，再使用 Git 的合併功能，在終端機輸入：
```
git checkout master
git merge teacher
```
![Imgur](https://i.imgur.com/D0vWzQc.jpg)

master 是研究生自己 branch 的名稱，合併完成以後可以確認 thesis 的內容是不是已經變成 "This is my thesis."，並且在終端機輸入：
```
git log
```
查看所有的 commit 紀錄，可以看見研究生的 commit 以及 指導教授的 commit 都在 master 這個 branch 裡面了。

![Imgur](https://i.imgur.com/5XH476f.jpg)

目前的大致情況，請參考下面這張圖。

![Imgur](https://i.imgur.com/9TOlMru.png)

最後把 teacher 的 branch 給刪除，在終端機輸入：
```
git branch -d teacher
```
並且在在終端機輸入：
```
git branch -v
```
![Imgur](https://i.imgur.com/Hgqas6q.jpg)

檢查是否剩下 master 這個 branch。

最後的大致情況，請參考下面這張圖。

![Imgur](https://i.imgur.com/pPhTfm3.png)

### Github (git push & git pull)
剛剛拿來給 Git 做版本控制的資料夾叫作一個 repository (倉庫)，Github 就是一個 Github 公司提供的空間讓我們可以把很多 repository 給放在上面。
首先在 Github 上創建一個 repository，步驟可以參考[這個連結](https://learning.lidemy.com/reports)。
接著要將本機端被 Git 控管與剛剛在 Github 上剛創建好的 repository 連動，在終端機輸入：
```
git remote add origin "url"
```
在 url 的地方輸入 repository 的所在位置，現在本機端以及遠端的橋樑已經建立好了，接著要把本地的 master branch 給放到遠端，在終端機輸入：
```
git push -u origin master
```
現在 Github 上的 repository 裡就可以看到最新本的論文以及學生及教授的修改紀錄。

![Imgur](https://i.imgur.com/cXXKIQF.jpg)
![Imgur](https://i.imgur.com/XSHJF3u.jpg)

如果在 Github 上的 thesis 加了一行日期 2021/4/16，

![Imgur](https://i.imgur.com/i9Xil6F.jpg)

那麼本機端的 thesis 會新增這個改動嗎? 答案是不會，此時在終端機輸入：
```
git pull origin master
```
完成本機端的改動。

在終端機輸入：
```
git log
```
發現 Github 最新的版本 (Update thesis) 也出現在本機端了。

![Imgur](https://i.imgur.com/pkWLwEs.jpg)

### 複習

最後複習學到的 Git 指令

* git init：將資料夾給 Git 管理
* git add "filename"：將資料夾內要做版本控制的候選檔案挑選出來
* git commit -am "commitmessage"：提交版本
* git status：查看目前檔案的改動狀態
* git diff：檢查目前與最新版本的差別
* git branch "branchname"：創建新 branch
* git checkout "branchname"：移動到不同的 branch
* git merge "branch being merged"：將別的 branch 合併到當前的 branch
* git log：查看當前 branch 的所有 commit 紀錄
* git branch -d "branchname"：刪除特定的 branch
* git branch -v：查看所有的 branch