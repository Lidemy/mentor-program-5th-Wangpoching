#!/bin/bash
##這個script可以產出n個 .js 檔案，每個檔案依序以 1~n 為檔名
declare -i number=1 # 指定整數變數 number 為 1
while [ ${number} -le $1 ] # 當 number 小於第一個 argument
do
	touch "${number}.js" # 創建 number.js 檔案
	number=${number}+1 # number += 1
done # 結束
echo "檔案建立完成" # 印出完成訊息

```
#!/bin/bash

for (( i=1; i<=$1; i=i+1 ))
do
  touch "${i}.js";
done
echo "檔案建立完成";
```
