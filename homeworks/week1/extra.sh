#!/bin/bash
##這個script可以印出個人資訊
wget -q "https://api.github.com/users/$1" #輸入名稱以獲取個人資訊 json （-p：hide output）
name=$(grep '"login": ' $1 | awk -F ": " '{print $2}' | grep -oP '[^"]+(?=",)' ) #獲取有"login": 出現的行，以：為分隔符取第2欄，取出 " 之後 ", 之前的資訊
desc=$(grep '"bio": ' $1 | awk -F ": " '{print $2}' | grep -oP '[^"]+(?=",)' )
loc=$(grep '"location": ' $1 | awk -F ": " '{print $2}' | grep -oP '[^"]+(?=",)' )
blog=$(grep '"blog"' $1 | awk -F ": " '{print $2}' | grep -oP '[^"]+(?=",)' )
echo ${name} #打印資訊
echo ${desc}
echo ${loc}
echo ${blog}



