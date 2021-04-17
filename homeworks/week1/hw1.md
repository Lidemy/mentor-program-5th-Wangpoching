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
git branch newbranchname
git checkout newbranchname
```
或者
```
git checkout -b newbranchname
```

6. **寫好作業以後提交 commit**
```
git add filename
git commit -am "commitmsg"
```
7. **將本機的 new branch 給 push 到 Github 上**
```
git push origin newbrnchname
```
8. **如果作業還有改動，重複步驟 6 ~ 7**
9. 在 Github 上發起 pull request 的請求，請求將 new branch 合併到 master
10. 將 PR 的 url 貼到作業區繳交
11. **待助教將 Github 上的 new branch 合併回 master 以後將本機端的 new branch 刪除**
```
git branch -d newbranchname
```

備註 : 在本機端操作的步驟以粗體表示
