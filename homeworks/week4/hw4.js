/*
請參考 Twitch API v5 的文件，寫一隻程式去呼叫 Twitch API，並拿到「最受歡迎的遊戲列表（Get Top Games）」，並依序印出目前觀看人數跟遊戲名稱。

在這個作業中，你必須自己看懂 Twitch API 的文件，知道怎麼去申請一個 Application 拿到 ClientID，並且在 API 文件當中找到對的那一個 API（Get Top Games），而且務必記得要在 request header 中帶上 ClientID 跟另一個參數 Accept，值是：application/vnd.twitchtv.v5+json。

還有一件事情要提醒大家，Twitch API 有兩個版本，一個是最新版（New Twitch API，代號 Helix）
*/
const request = require('request')

const BASE_URL = 'https://api.twitch.tv/helix'
const BEARER_TOKEN = 'gakm8109xrv8dca7ke4i6yw25vzey5'
const CLIENT_ID = 'xkypa7ouwlhjupibscd4mk8lhwgtgk'

// 取得 Top 20 遊戲
function getTopGames(callback) {
  request.get({
    url: `${BASE_URL}/games/top?first=20`,
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
      'Client-Id': CLIENT_ID
    }
  }, (err, res, body) => {
    if (err) return callback(err)

    if (res.statusCode === 200) {
      try {
        // callback 放入 Streams 流量加總最高的前 20 個遊戲(broadcast)
        const games = JSON.parse(body).data
        callback(null, games)
      } catch (parseErr) {
        callback(parseErr)
      }
    } else {
      callback(new Error(`HTTP ${res.statusCode}`))
    }
  })
}

// 取得單一遊戲的觀看人數
/*
gameId: 遊戲 ID
viewers: 目前為止觀看遊戲人數加總
cursor: 目前回傳到第幾個 Stream
*/
function getGameViewers(gameId, viewers = 0, cursor, callback) {
  // 單次上限最多只能取前 100 個 Stream
  const url = `${BASE_URL}/streams?game_id=${gameId}&first=100${cursor ? `&after=${cursor}` : ''}`

  request.get({
    url,
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
      'Client-Id': CLIENT_ID
    }
  }, (err, res, body) => {
    if (err) return callback(err)
    if (res.statusCode !== 200) return callback(new Error(`HTTP ${res.statusCode}: ${body}`))

    let json
    try { json = JSON.parse(body) } catch (e) { return callback(e) }

    const streams = json.data || []
    const nextCursor = json.pagination && json.pagination.cursor
    // 將 Streams 的觀看流量累加
    const total = viewers + streams.reduce((sum, s) => sum + (s.viewer_count || 0), 0)

    // 如果還有 cursor 就繼續把總人數再丟到 getGameViewers 繼續加總人數
    if (nextCursor) {
      return getGameViewers(gameId, total, nextCursor, callback)
    }
    // 算到最後才用 callback 處理總人數
    callback(null, total)
  })
}

// 主程式
getTopGames((err, games) => {
  if (err) {
    console.log('錯誤:', err.message)
    return
  }

  console.log('正在查詢觀看人數...\n')

  let completed = 0
  const results = []

  games.forEach((game, index) => {
    getGameViewers(game.id, 0, undefined, (err, viewers) => {
      // 數有多少遊戲統計完成
      completed++

      results.push({
        rank: index + 1,
        name: game.name,
        viewers: err ? 0 : viewers
      })

      // 全部完成後排序並顯示
      if (completed === games.length) {
        results
          .sort((a, b) => b.viewers - a.viewers)
          .forEach((game, idx) => {
            console.log(`${idx + 1}. ${game.name}: ${game.viewers.toLocaleString()} 觀看者`)
          })
      }
    })
  })
})
