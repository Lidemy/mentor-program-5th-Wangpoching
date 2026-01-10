#!/bin/bash
##這個script可以印出個人資訊
wget -q "https://api.github.com/users/$1" #輸入名稱以獲取個人資訊 json （-q：hide output）
#獲取有"login": 出現的行，以：為分隔符取第2欄，取出 " 之後 ", 之前的資訊
# grep -P: Perl regexp syntax
# grep -o: Print  only  the  matched  (non-empty)  parts of a matching line
# /X(?=",")/ => 我要找 X 而其後方必須為 Y => ?= 就是 lookahead 的意思
name=$(grep -m1 '"login": ' $1 | cut -d : -f 2 | grep -oP '[^"]+(?=",)' )
desc=$(grep -m1 '"bio": ' $1 | cut -d : -f 2 | grep -oP '[^"]+(?=",)' )
loc=$(grep -m1 '"location": ' $1 | cut -d : -f 2 | grep -oP '[^"]+(?=",)' )
blog=$(grep -m1 '"blog"' $1 | cut -d : -f 2 | grep -oP '[^"]+(?=",)' )
echo ${name} #打印資訊
echo ${desc}
echo ${loc}
echo ${blog}

```
#!/bin/sh

# 附註：
# 底下寫法其實滿差的，因為一旦原始的資料變了或是欄位的順序錯了就會掛掉
# 但一時找不太到支援度高的寫法怎麼寫，所以只能先求有再來求好QQ

username=$1;

data=$(curl --silent https://api.github.com/users/$username);
echo $data | grep -o '"name": ".*", "company' | sed 's/"name": "//g' | sed 's/", "company//g';
echo $data | grep -o '"bio": ".*", "twitter_username' | sed 's/"bio": "//g' | sed 's/", "twitter_username//g';
echo $data | grep -o '"location": ".*", "email' | sed 's/"location": "//g' | sed 's/", "email//g';
echo $data | grep -o '"blog": ".*", "location' | sed 's/"blog": "//g' | sed 's/", "location//g';
```

```
#!/bin/bash

i=$1
url="https://api.github.com/users/${i}"

# -s 可以避免進度條
response=$(curl -s "$url")

profile=$(echo "$response" | grep -oE '"[^"]+": "[^"]+"')

name=$(echo "$profile" | grep "name" | awk -F ': ' '{print $2}')
bio=$(echo "$profile" | grep "bio" | awk -F ': ' '{print $2}')
location=$(echo "$profile" | grep "location" | awk -F ': ' '{print $2}')
blog=$(echo "$profile" | grep "blog" | awk -F ': ' '{print $2}')

echo "name: $name"
echo "bio: $bio"
echo "location: $location"
echo "blog: $blog"

exit 0
```


