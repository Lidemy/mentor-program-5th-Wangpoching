// 畫面 load 完成
window.addEventListener('load', () => {
  // 先取得熱門遊戲
  getTopGames((data) => {
    // 並將 navbar 更新成熱門的遊戲
    reNewNav(data)
    // 並更改標題遊戲名稱為最熱門的遊戲名稱
    changeGameName(data.top[0].game.name)
    // 最後才抓最熱門遊戲的實況並放上網頁
    getHotStreams(0, data.top[0].game.name, reFillStreams)
  })
  // 顯示 navbar 上第一個按鈕被選中
  document.querySelector('a').parentNode.classList.add('active')
  // navbar 代理監聽被點擊 navbar 按鈕
  document.querySelector('.navbar-list').addEventListener('click',
    (event) => {
      if (event.target.tagName === 'A') {
        counter = 0
        // 取得被點擊的遊戲的熱門實況並更新到網頁
        getHotStreams(0, event.target.innerText, reFillStreams)
        // 更新 navbar 上最新被選中的按鈕
        document.querySelector('.active').classList.remove('active')
        event.target.parentNode.classList.add('active')
        // 更新目前選擇的遊戲名稱
        changeGameName(event.target.innerText)
      }
    }
  )
  window.addEventListener('scroll', addOnceScrollListener)
})

// 設定文件
let counter = 0 // 紀錄總共送了幾個 request
const baseUrl = 'https://api.twitch.tv/kraken'
const errorMsg = '系統不穩定，請再試一次'
const CLIEND_ID = 'xkypa7ouwlhjupibscd4mk8lhwgtgk'
const ACCEPT = 'application/vnd.twitchtv.v5+json'
const TEMPLATE_HTML = `
      <div class='stream $nthRequest' >
        <img class='cover' src='$large'></img>
        <div class='stream-extra'>
          <img class='stream-avatar' src='$logo'></img>
          <div class=stream-details>
            <span class='stream-info'>$status</span>
            <div class='stream-title'>$name</div>
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
  request.setRequestHeader('Accept', ACCEPT)
  request.send()
}

// 取得最熱門的遊戲
function getTopGames(callback) {
  const topGamesUrl = `${baseUrl}/games/top?limit=${5}`
  draw(topGamesUrl, (err, data) => {
    if (err) {
      alert(err)
      return
    }
    callback(data)
  })
}

// 取得熱門實況
function getHotStreams(offset, name, callback) {
  const topStreamsUrl = `${baseUrl}/streams/?game=${encodeURIComponent(name)}&limit=${20}&offset=${offset}`
  const nthRequest = offset / 20
  document.querySelector('.desc').innerText = `Top ${20 * (counter + 1)} popular live streams sorted by current viewers`
  draw(topStreamsUrl, (err, data) => {
    if (err) {
      alert(err)
      return
    }
    callback(data, nthRequest)
  })
}

// 將熱門實況更新到 UI 上
function reFillStreams(data, nthRequest) {
  const streamsContainer = document.querySelector('.streams-container')
  if (nthRequest === 0) {
    streamsContainer.innerHTML = ''
  }
  // 實況照熱門順序排列（防止 response 回來的時間不同

  // 如果是第一次塞在最後面
  if (nthRequest === 0) {
    for (let i = 0; i < data.streams.length; i++) {
      const div = document.createElement('div')
      streamsContainer.appendChild(div)
      div.outerHTML = TEMPLATE_HTML
        .replace('$large', data.streams[i].preview.large)
        .replace('$logo', data.streams[i].channel.logo)
        .replace('$status', data.streams[i].channel.status)
        .replace('$name', data.streams[i].channel.name)
        .replace('$nthRequest', `N${nthRequest * 20 + i}`)
    }
  } else {
    // 如果找的到之前的屁股就塞在他後面
    let refPosition = nthRequest * 20 - 1
    while (refPosition >= 19) {
      if (document.querySelector(`.N${refPosition}`)) {
        for (let i = 0; i < data.streams.length; i++) {
          const div = document.createElement('div')
          const neighbor = document.querySelector(`.N${refPosition + i}`)
          neighbor.parentNode.insertBefore(div, neighbor.nextSibling)
          div.outerHTML = TEMPLATE_HTML
            .replace('$large', data.streams[i].preview.large)
            .replace('$logo', data.streams[i].channel.logo)
            .replace('$status', data.streams[i].channel.status)
            .replace('$name', data.streams[i].channel.name)
            .replace('$nthRequest', `N${nthRequest * 20 + i}`)
        }
        break
      }
      refPosition -= 20
    }
  }
}

// 更改標題遊戲名稱
function changeGameName(gamename) {
  document.querySelector('.game-name').innerText = gamename
}

// 將 navbar 更新成熱門的遊戲
function reNewNav(data) {
  const hyperLinks = document.querySelectorAll('a')
  const topGames = []
  for (let i = 0; i < data.top.length; i++) {
    topGames.push(data.top[i].game.name)
  }
  for (let i = 0; i < hyperLinks.length; i++) {
    hyperLinks[i].innerText = topGames[i]
  }
}

// 載入更多熱門實況
function addMoreStreams() {
  counter++
  const name = document.querySelector('.game-name').innerText
  getHotStreams(20 * counter, name, reFillStreams)
}

// 添加一次性滾動監聽器
function addOnceScrollListener() {
  const page = document.documentElement

  // 預先載入
  if (page.scrollHeight - window.innerHeight * 0.05 <= page.scrollTop + window.innerHeight) {
    window.addEventListener('scroll', addMoreStreams, {
      // This will invoke the event once and de-register it afterward
      once: true
    })
  }
}
