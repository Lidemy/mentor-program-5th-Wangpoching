# 20 週網站優化報告

## 待優化網站原始碼

https://github.com/Lidemy/lazy-hackathon

## [WebPageTest](https://www.webpagetest.org/)報告網址

### 原始報告

![img](https://i.imgur.com/kEEBvPG.jpg)

### 最終報告

![img](https://i.imgur.com/ehMwNGg.jpg)

----------------------------------------------------

## 第一步：刪除冗餘的程式碼

### index.html

* 把出師表刪掉
* 刪掉註解
* 刪除用不到的外部資源
  1. CSS
    * 刪除 material-icons.css 的 link
  2. JS
    * bootstrap 的元件有用到要保留
    * 網站的幻燈片使用 slick 套件所以保留
    * jquery 與 slick 相依要保留
    * 網站的打字效果用到 typed.js 所以保留
    * vue/angular/glide/sweetalert/material-component-web.js 沒用到都刪除

### index.js

幫 index.js 瘦身，裡面太多奇怪的東西了，一大堆分類的演算法，以下列出要保留還有修正的部分。
* typed 功能
* slick 功能
* hashchange 功能
* scroll 以後 nav 會縮小的功能
* addEventListener 的 capture 參數預設值是 false，可以刪掉
其他的放心刪掉。

### 結果

因為需要載入資源的變少了，Document Complete Time 大概快了一秒，不過 domContentLoaded 從 2.7 秒進步到 1.37 秒，也就是說完成 DOM Tree 以及 CSSOM Tree 解析的時間變快了，但因為圖片太肥大，所以要完整載完網頁還要很久

![img](https://i.imgur.com/bblIxTE.jpg)

## 第二步：估計 CRP 的 number / size / path number

CRP(Crital Rendering Path) 會影響到第一次渲染的時間，所以先對 CRP 的幾個面向進行評估。

* 數量
* 大小
* 需要幾次同步的發起請求

### CRP 數量 ( 11 個 )

```
  <link href="https://fonts.googleapis.com/css?family=Arvo|Noto+Sans+TC&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./css/bootstrap.css">
  <link rel="stylesheet" href="./js/slick/slick.css">
  <link rel="stylesheet" href="./js/slick/slick-theme.css">
  <link rel="stylesheet" href="./css/style.css">
  <script src="./js/jquery-3.4.1.js"></script>
  <script src="./js/bootstrap.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.10/typed.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.js"></script>
  <script src="./js/index.js"></script>
```

5 個外部的 CSS 以及 5 個外部的 Javascript 檔案，再加上 HTML 本身，所以`CRP 的數量是 11 個`。

### CRP 大小 ( 約等於 203 KB )

![img](https://i.imgur.com/rURJwgV.jpg)

* HTML: 4.0 KB
* CSS
  * style.css : 4.7 KB
  * slick-theme.css : 1.1 KB
  * slick.css : 707 B
  * bootstrap.css : 26.3 KB
  * css 字體 : 33.5 KB
* JS
  * index.js : 916 B
  * slick.js : 13.6 KB
  * typed.js : 6.9 KB
  * bootstrap.js : 26.0 KB
  * jquery-3.4.1.js : 84.9 KB

### CRP 同步請求數量 ( 2 個 )

![img](https://i.imgur.com/pto0wlU.png)

這張圖模擬了第一次渲染的流程，第一次送出 request 獲取 html，接著在解析 DOM 文件時，會對找到的外部 CSS / JS 送出 request ，因為這些外部資源不用互相等待下載完成，所以合計為一次同步請求，所以瀏覽起總共需要發起兩次的同步請求。

## 第三步：初步壓縮資源 ( 約等於 81 KB )

要加快第一次渲染的速度，可以先從讓關鍵資源的 Bytes 減少。

* html
  * 使用 `gulp-htmlmin`
* css
  * 使用 `sass`, `node-sass` 轉成 css
  * 使用 `postcss`, `autoprefixer` 當作 css loader 並且加上前綴（適用個別瀏覽器的前綴）
  * 使用 `cssnano` 壓縮 css，建議在開發的時候先不要用，發布時再用
  * 記得要自己幫 mask 相關的屬性加上前綴，postcss / autoprefixer 似乎不支援

以下附上 gulp.file。

```
const { src, dest } = require('gulp')
const sass = require('gulp-sass')(require('node-sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano'); // 載入 cssnano 套件
const uglify = require("gulp-uglify");
const htmlmin = require('gulp-htmlmin');

function css(cb) {
  return src('./src/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()])) // 陣列方式啟用插件
    .pipe(dest('./dist'));
}

function js(cb) {
  return src("./src/*.js")
    .pipe(uglify())
    .pipe(dest("./dist"));
}

function html(cb) {
  return src("./src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("./dist"));  
}

exports.css = css
exports.js = js
exports.html = html

```

再次實測資源的大小，結果如下。

![img](https://i.imgur.com/q6KpRdQ.jpg)

* HTML: 4.0 KB
* CSS
  * style.css : 4.7 KB => 3.4 KB
  * slick-theme.css : 1.1 KB => 895 B
  * slick.css : 707 B => 735 B
  * bootstrap.css : 26.3 KB => 22.8 B
  * css 字體 : 33.5 KB （沒壓縮）
* JS
  * index.js : 916 B =>　398 B
  * slick.js : 13.6 KB => 2.8 KB
  * typed.js : 6.9 KB => 3.5 KB
  * bootstrap.js : 26.0 KB => 15.5 KB
  * jquery-3.4.1.js : 84.9 KB => 31.3 KB

最後總計大約資源大小是 81 KB，與原來的 203 KB 相比，節約了大約 60%

### 結果

因為需要載入資源的變小了，domContentLoaded 從 2.7 秒繼續進步到 0.897 秒，但因為圖片還沒處理，所以要完整載完網頁還要 55 秒左右。

![img](https://i.imgur.com/wp6OeKb.jpg)


## 第四步 調整圖片大小

### 重新取樣

想要把圖片尺寸到正常而且不失真的狀態，可以觀察圖片在網頁最大的像素大小。舉例來說，在 dev tool 將可視區域拉寬，觀察參賽隊伍的圖片，會發現最大的寬度是 255px。

考慮到 retina 螢幕解析度為兩倍的情況，可以將參賽隊伍的圖片調整成 510px 而不會失真。

這邊使用 photoshop 來重新取樣，底下列出重新調整大小的圖片：

圖片區
* 參賽隊伍區的圖片，最大寬度是 255px
  * 800px => 510px
* 評審介紹區幻燈片的大圖，最大寬度是 750px
  * 1920px => 1500px
* 評審介紹區幻燈片的小圖，最大寬度是 92px
  * 800px => 184px

icon
* 各標題旁邊的 icon 圖片，寬度是 20px
  * 128px =>　40px
* 歷屆成績區的 icon 圖片，寬度是 80px
  * 512px => 160px
* 社群分享的 icon 圖片，寬度是 30px
  * 128px => 60px

其他
* nav-bar 的 logo，寬度是 160px
  * 520px =>　320px
* add-circular-outline-button 有兩個區域用到，比較大的寬度是 20px
  * 128px => 40px

### 背景大圖轉檔

滿版的圖片不重新取樣，因為瀏覽網頁的裝置可能很大，但是可以將 png 轉成 jpg，因為採用不同的方式編碼，所以可以瘦身。

到此為止 image 資料夾大小從 29.7 MB 下降到 16.3 MB，節約了將近一半的大小!

### 所有圖片再次用 tinypng 壓縮

tinypng 的原理是把相近色給併為一個顏色，這也是一個可以有效降低圖片資料量的方法! 到 [tinypng](https://tinypng.com/) 的官網把所有圖再壓過一次。

這次 image 資料夾的大小下降到 3.7 MB，較上個步驟又節約了 85% 的大小，相近色合併的效果超級威。

### 結果

再次跑 [WebPageTest](https://www.webpagetest.org/)，結果如下：

![img](https://i.imgur.com/B84ZpUG.jpg)

整個網頁載入的時間下降到只要 10 秒左右，原本要 55 秒，進步神速!

## 第五步 Lazy loading

所謂的 Lazy Loading 是指當資源進入 viewport 時才會下載，有許多工具可以使用，因為原本就有引入了 jQuery，所以就使用 jQuery 提供的 [Lazy loading](http://jquery.eisbehr.de/lazy/)。

### img tag

1. 引入 `<script src="./js/jquery.lazy.min.js"></script>`
2. 把 img 的 class 新增 `lazy`
3. 把 img 的 src 屬性名稱本身改成 `data-src`

EX.src = "xxx" => data-src = "xxx"

4. 在 DOM 解析完後執行

```js
  $('.lazy').Lazy();
```

背後的原理是因為瀏覽器認不出 data-src，等到圖片進入 viewport 會觸發事件，這時候 jQuery 才會把 data-src 換成 src 屬性，瀏覽器便會在這個時候下載圖片。

### css 背景圖片

這個稍微麻煩一些，但原理跟 img 相同。

1. 在容器上加上 id。ex. id="bg-image"
2. 在 css 添加規則使得在有該 id 下沒有背景圖。

EX. #bg-image { background-image:none }

3. 在 DOM 解析完後執行

```js
  const lazyloadBackgrounds = document.querySelectorAll('#bg-image');
  var backgroundObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var background = entry.target;
        background.removeAttribute('id');
        backgroundObserver.unobserve(background);
      }
    });
  });

  lazyloadBackgrounds.forEach(function(background) {
    backgroundObserver.observe(background);
  });
```

在容器進入 viewport 時會被偵測到，這時候把 id 給刪除，原本被 { background: none } 蓋過的規則就會被採用，瀏覽器在這時候便會下載背景圖片。

最後再把 mask-image 也比照辦理就完成所有圖片的 Lazy Loading 了。

### 結果

推測這次的優化應該會效果顯著，最後結果如下：

![img](https://i.imgur.com/GPJxwjL.jpg)

只要 4 秒! 把圖片 Lazy Loading 又優化了一半以上的速度!

## 第六步 使用 webp 圖檔以及 Lazyloading

webp 格式的圖檔在**大部分的瀏覽器**都有支援，把 png 以及 jpg 檔換成 webp 能再大幅壓縮檔案大小。

### 轉檔

 1. 使用 npm 套件 [Imagemin WebP](https://www.npmjs.com/package/imagemin-webp)
 2. 基礎語法

 ```cmd
  npx cwebp a.jpg -o a.webp 
 ```

 將所有圖轉成 webp 後 image 資料夾的大小下降到 1.8 MB，又將資料夾的大小變為原本的一半。

### img tag 的 Lazy Loading

 因為不是所有瀏覽器都支援 webp，所以可以利用 picture tag 讓瀏覽器自行判斷要載入 webp 或是 png/jpg，可以參考 [MDN 的說明](https://developer.mozilla.org/zh-TW/docs/Web/HTML/Element/picture)。

 1. 引入新的 plugin `<script src="./js/jquery.lazy.picture.min.js"></script>`
 2. 用下面的範例插入圖片

 ```
 <picture class="lazy" data-src="./image/team_a.jpg" data-srcset="./webp/team_a.webp" data-type="image/webp" />
 ```
3. 仍然要記得執行

```js
  $('.lazy').Lazy();
```
### CSS 背景圖的 Lazy loading

我們可以採用跟之前一樣的邏輯，先在元素上添加一個屬性當作遮罩，然後偵測元素進入 viewpoint 的事件。一旦偵測到便將遮罩刪掉，讓 background image 的屬性被瀏覽器採用。

但是我們還需要考慮到瀏覽器是否支援 webp，所以必須先檢查瀏覽器能否正確載入 webp。

* 在 html 中幫有背景圖的元素加上屬性遮罩
* 在 DOM 建立完後執行，如果瀏覽器支援 webp 會加上 webp 類別，否則加上 no-webp 類別。

```js
  // 挑出有遮罩的元素
  const lazyloadBackgrounds = document.querySelectorAll('#bg-image'); 
  const lazyloadIcons = document.querySelectorAll('#icon-image');

  // 寫一個會回傳 promise 的函數，偵測載入測試用的 webp 是否成功
  const detectWebp = () => new Promise((resolve) => {
      const imgSrc = 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA';
      const pixel = new Image();
      pixel.addEventListener('load', () => {
          const isSuccess = (pixel.width > 0) && (pixel.height > 0);
          resolve(isSuccess);
      });
      pixel.addEventListener('error', () => { resolve(false); });
      pixel.setAttribute('src', imgSrc); // 開始載入測試圖
  });

  // 儲存 promise 的結果
  const hasSupport = await detectWebp();

  // 幫元素加上 class，webp 或者 no-webp
  lazyloadBackgrounds.forEach((ele) => {
    ele.classList.add(hasSupport ? 'webp' : 'no-webp');
  })
  lazyloadIcons.forEach((ele) => {
    ele.classList.add(hasSupport ? 'webp' : 'no-webp');
  })
```

* 在 scss 寫 mixin，沒有遮罩且 webp 類別存在會載入 webp，沒有遮罩且 np-webp 類別存在會載入原圖。

```
@mixin bg-webp($url, $type) {
    &.no-webp {
        background-image: url('./../image/'+ $url + '.' + $type);

        &#bg-image{
            background-image: none;
        }
    }

     &.webp {
        background-image: url('./../webp/'+ $url + '.webp');

        &#bg-image{
            background-image: none;
        }
    }
}

```
### 結果

這次優化的結果如下：

![img](https://i.imgur.com/79zspkB.jpg)

較上一階段文件全部載入的時間快了一點。

## 第七步 自動偵測冗碼以及打包資源

### css

css 裏頭最胖的肯定是 bootstrap 了，但是因為網頁是別人設計的網頁所以不知道要怎麼挑選客製化的 bootstrap。所幸 [gulp-uncss](https://github.com/ben-eb/gulp-uncss#gulp-uncss) 可以自動偵測 html 裡用到的 class，幫 css 瘦身。

之後用 [gulp-concat](https://www.npmjs.com/package/gulp-concat) 打包，順序無妨。

### js

* js 裡最胖的是 jQuery，因為沒有要用 ajax，所以改成載壓縮過的 slim 版本
* 使用 gulp-concat 打包，值得注意的是可以依照這樣的順序寫在 gulpfile 的 src 裡打包，雖然 js 有 hoisting 的特性，但這樣依照相依性的順序會比較安全
  1. jquery
  2. jquery-lazy
  3. jquery-lazy-picture
  4. typed
  5. slick
  6. slick-theme
  7. index
* 使用 defer，請不要使用 async，因為裡面有一些程式碼是需要在 DOM 解析完後才執行。

### 結果

這次的結果優化在 domInteractive，因為所有 js 都用 defer 處理。下面是結果：

![img](https://i.imgur.com/XC6ZAhx.jpg)

## 第八步 sprite 雪碧圖

為了可以讓圖片的 request 減少，通常會把大小一樣的圖拼成雪碧圖 (sprite)，再利用 `background(mask)-position`的 css 把圖片切割。

下面以 footer 的四個 icon 來示範。

### photoshop 製作雪碧圖

之前有將這四個 icon 統一取樣成 60px * 60px 的大小，所以先開一個 240px * 60px 的圖層。

![img](https://i.imgur.com/zNSytOb.jpg)

接著選擇 檢視 -> 新增參考線配置 -> 4 欄 1 列

![img](https://i.imgur.com/NjArIdF.jpg)

一一將圖片載入並「水平置中 垂直置中」在每一個格子裡

![img](https://i.imgur.com/6XylVYV.jpg)

輸出 png 以後記得再轉成 webp。

### 設置 mask-position

* mask-size 設置為 cover
* 設置 mask-position
```
.footer__social-media {
    display: flex;
    align-items: center;
    .footer__social-icon {
        @include size(30px);
        @include icon(#bbb);
        margin-left: 5px;
        cursor: pointer;
        &:hover {
            background: #eee;
        }
        &.icon-fb {
            -webkit-mask-position: 0 0;
            @include icon-webp('sprite-community', 'png')
        }
        &.icon-twitter {
            -webkit-mask-position: (100% / 3) 0;
            @include icon-webp('sprite-community', 'png')
        } 
        &.icon-ig {
            -webkit-mask-position: (100% / 3 * 2) 0;
            @include icon-webp('sprite-community', 'png')
        }
        &.icon-g-plus {
            -webkit-mask-position: 100% 0;
            @include icon-webp('sprite-community', 'png')
        }
    }
}
```
### background(mask)-size

這邊筆記一下為甚麼 mask-size 與 mask-position 要這樣設定，`cover`屬性會使得背景圖整個「不變形」、「寬高等比例」、「在必要時局部裁切」的鋪滿整個容器空間。

因為在網頁上裝社群 icon 的容器大小是 30px * 30px，背景圖的大小是 240px * 60px，為了要填滿整個容器，背景圖的高度重新取樣為 30px，又因為背景圖的寬高比不能變，所以寬度變為 120px。 這個情況使得`背景圖的高度與容器相同、背景圖的寬度是容器的四倍`。

### background(mask)-position

要知道決定背景圖與容器相對位置的方法，首先要知道`容器本身作為個固定的座標系統`，如下圖，容器的左上角為座標 (0,0)，往右往下為正。

![img](https://i.imgur.com/2jKzT7C.png)

接著我們決定要把`背景圖的左上角`放在座標的哪個位置上，假設我們把背景圖放在 (0,0)，就會像下圖這樣，可以順利將 sprite 圖的第一張顯示出來。

![img](https://i.imgur.com/14pyqzC.png)

但是用百分比當參數的話又是怎麼回事呢? 第二張 icon 使用了 `mask-position: (100% / 3) 0`，百分比使用了下列的公式來轉換成座標:

`(容器長[寬]度-背景長[寬]度) x 百分比 = 座標`

100% / 3 就是三分之一，也就是說 mask-position 的 X 座標是 (30-120) * (1/3) = -30

把背景圖的左上角放置在 (-30,0) 的位置可以顯示第二張 icon，如下圖。

![img](https://i.imgur.com/M0o5gGs.png)

### 結果

沒有甚麼差別，可能是因為這次是用台灣的伺服器跑的，因為新加坡的有好幾百個在排隊等...

![img](https://i.imgur.com/ehMwNGg.jpg)

## 心得

### 可以再優化的地方

這次的步驟是參考這個網頁的原始製作者 [yakim-shu](https://github.com/Lidemy/lazy-hackathon/issues/7) 的優化流程的，如果說還有甚麼可以做的，我想到以下兩點：

* css 分割，將不同的 RWD 分開成不同檔案，並以 media 屬性讓瀏覽器可以在需要時動態載入
* cache，如果要知道 cache 的相關資訊可以參考[循序漸進理解 HTTP Cache 機制](https://blog.huli.tw/2017/08/27/http-cache/)

### 流程整理

這次主要做的事情有:

* html/js/css 刪除冗碼
* js/css 壓縮與打包、html 壓縮
* 圖片壓縮
* sprite
* js defer
* Lazy loading

這些流程不外乎是`減低資源大小`、`減少瀏覽器請求次數`以及避免 `DOM/CCSOM 的 block`。其中圖片是載入速度的瓶頸所在，所以這次也在處理圖片上學到了最多。

本來以為這個挑戰可以很快完成，但是其實碰到的問題很多，一方面不熟悉工具，另一方面因為不是自己寫的網頁，所以只要動到 scss 都很容易不小心壞掉 XD

推薦大家都一定要來玩!




