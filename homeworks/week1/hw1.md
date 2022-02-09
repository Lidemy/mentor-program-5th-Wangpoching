## 交作業流程 

1. 接受邀請以便擁有在 Github 上 Lidemy 底下的個人資料夾 
2. **將個人資料夾從 Github 上 clone 回本機端 (此時本機端的資料夾自動與 Github 上的資料夾 remote)**
```
git clone url
``` 
3. 以後要交作業的時候 只要從這個步驟開始就好 
4. **進入資料夾底下**
5. **在自己的本機端開新的 branch 並 switch 到新的 branch** 
``` 
git branch newBranchName
git checkout newBranchName
```
或者
```
git checkout -b newBranchName
```
6. **寫好作業以後提交 commit**
```
git add filename
git commit -am "commitMsg"
```
7. **將本機的 new branch 給 push 到 Github 上**
```
git push origin newBranchName
```
8. **如果作業還有改動，重複步驟 6 ~ 7**
9. 在 Github 上發起 pull request 的請求，請求將 new branch 合併到 master
10. 將 PR 的 url 貼到作業區繳交
11. 助教將 Github 上的 new branch 合併回 master 並將將 Github 上的 new branch 刪除
12. **將 Github 上的 master 給 pull 到本地的 master，如此一來本地與 Github 上的 master 都已經有最新的改動了**
```
git pull origin master
```
13. **最後記得把本地端的 new branch 刪掉即可**
```
git branch -d newBranchName
```
備註 : 在本機端操作的步驟以粗體表示
