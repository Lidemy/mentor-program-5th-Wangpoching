// 畫面 load 完成
window.addEventListener('load', () => {
  // 先取得熱門遊戲
  getTopGames((data) => {
    // 並將 navbar 更新成熱門的遊戲
    reNewNav(data)
    // 並更改標題遊戲名稱為最熱門的遊戲名稱
    changeGameName(document.querySelectorAll('a')[0])
    // 最後才抓最熱門遊戲的實況並放上網頁
    getHotStreams(data.data[0].id, reFillStreams)
  })
  // 顯示 navbar 上第一個按鈕被選中
  document.querySelector('a').parentNode.classList.add('active')
  // navbar 代理監聽被點擊 navbar 按鈕
  document.querySelector('.navbar-list').addEventListener('click',
    (event) => {
      if (event.target.tagName === 'A') {
        counter = 0
        paginator = ''
        // 取得被點擊的遊戲的熱門實況並更新到網頁
        getHotStreams(event.target.dataset.id, reFillStreams)
        // 更新 navbar 上最新被選中的按鈕
        document.querySelector('.active').classList.remove('active')
        event.target.parentNode.classList.add('active')
        // 更新目前選擇的遊戲名稱
        changeGameName(event.target)
      }
    }
  )
  window.addEventListener('scroll', debunce(addMoreStreams))
})

// 設定文件
let counter = 0 // 紀錄總共送了幾個 request
let paginator = ''
let allowNextRequest = true
const baseUrl = 'https://api.twitch.tv/helix'
const errorMsg = '系統不穩定，請再試一次'
const TOKEN = '7k2dokrshhz5b2ic18xddvy8g84an2'
const CLIEND_ID = 'xkypa7ouwlhjupibscd4mk8lhwgtgk'
const IMAGE_WIDTH = 300
const IMAGE_HEIGHT = 200
const GAME_LIMIT = 5
const STREAM_LIMIT = 20
const TEMPLATE_HTML = `
      <div class='stream' >
        <img class='cover' src='$large'></img>
        <div class='stream-extra'>
          <div class=stream-details>
            <div class='stream-title'>$title</div>
            <span class='stream-name'>$name</span>
          </div>
        </div>
      </div>
      `

// call api
function draw(url, cb) {
  const request = new XMLHttpRequest()
  request.onerror = function() {
    cb(errorMsg)
  }
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      let data
      try {
        data = JSON.parse(request.responseText)
      } catch (e) {
        cb(errorMsg)
        return
      }
      cb(null, data)
    } else {
      cb(errorMsg)
    }
  }
  request.open('GET', url, true)
  request.setRequestHeader('Client-ID', CLIEND_ID)
  request.setRequestHeader('Authorization', `Bearer ${TOKEN}`)
  request.send()
}

// 取得最熱門的遊戲
function getTopGames(callback) {
  const topGamesUrl = `${baseUrl}/games/top?first=${GAME_LIMIT}`
  draw(topGamesUrl, (err, topGames) => {
    if (err) {
      alert(err)
      return
    }
    callback(topGames)
  })
}

// 取得熱門實況
function getHotStreams(id, callback) {
  allowNextRequest = false
  const topStreamsUrl = `${baseUrl}/streams/?game_id=${id}&first=${STREAM_LIMIT}&after=${paginator}`
  document.querySelector('.desc').innerText = `Top ${20 * (counter + 1)} popular live streams sorted by current viewers`
  draw(topStreamsUrl, (err, data) => {
    if (err) {
      alert(err)
      return
    }
    callback(data)
  })
}

// 將熱門實況更新到 UI 上
function reFillStreams(data) {
  const streamsContainer = document.querySelector('.streams-container')
  if (counter === 0) {
    streamsContainer.innerHTML = ''
  }
  // 實況照熱門順序排列
  for (const stream of data.data) {
    const div = document.createElement('div')
    streamsContainer.appendChild(div)
    div.outerHTML = TEMPLATE_HTML
      .replace(
        '$large',
        stream.thumbnail_url
          .replace('{width}', IMAGE_WIDTH)
          .replace('{height}', IMAGE_HEIGHT)
      )
      .replace('$name', stream.user_name)
      .replace('$title', stream.title)
  }
  paginator = data.pagination.cursor
  allowNextRequest = true
}

// 更改標題遊戲名稱
function changeGameName(game) {
  const currentGame = document.querySelector('.game-name')
  currentGame.innerText = game.innerText
  currentGame.dataset.id = game.dataset.id
}

// 將 navbar 更新成熱門的遊戲
function reNewNav(data) {
  const hyperLinks = document.querySelectorAll('a')
  let i = 0
  for (const game of data.data) {
    hyperLinks[i].innerText = game.name
    hyperLinks[i].dataset.id = game.id
    i++
  }
}

// 載入更多熱門實況
function addMoreStreams() {
  counter++
  const { id } = document.querySelector('.game-name').dataset
  getHotStreams(id, reFillStreams)
}

// debounce
function debunce(func, delay = 1000) {
  let timer = null
  return () => {
    const page = document.documentElement
    // 預先載入
    if (page.scrollHeight - window.innerHeight * 0.05 <= page.scrollTop + window.innerHeight && allowNextRequest) {
      console.log('trigger')
      clearTimeout(timer)
      timer = setTimeout(func, delay)
    }
  }
}
