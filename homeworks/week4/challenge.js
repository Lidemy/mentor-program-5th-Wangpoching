/*
寫一個 node.js 的程式並串接 Twitch API，接收一個參數是遊戲名稱，輸出那個遊戲底下最受歡迎的前 200 個實況的名稱與 id。
GetGameId(gameName)
  getTopStreams 被呼叫
  │
  ├─ collected = []  ← 建立共享陣列
  │
  ├─ step(null) 第一次
  │  └─ collected.push([stream1, stream2, ...])  // collected 現在有 100 筆
  │
    ├─ step(cursor1) 第二次
    │  └─ collected.push([stream101, stream102, ...])  // collected 現在有 200 筆
    │
    └─ callback(null, collected)  // 回傳完整的 200 筆
*/
const request = require('request')

const BASE_URL = 'https://api.twitch.tv/helix'
const BEARER_TOKEN = process.env.TWITCH_TOKEN || 'gakm8109xrv8dca7ke4i6yw25vzey5'
const CLIENT_ID = process.env.TWITCH_CLIENT_ID || 'xkypa7ouwlhjupibscd4mk8lhwgtgk'

// 取得遊戲 ID
function getGameID(name, callback) {
  const url = `${BASE_URL}/games?name=${encodeURIComponent(name)}`

  request.get(
    {
      url,
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        'Client-Id': CLIENT_ID
      }
    },
    (err, res, body) => {
      if (err) return callback(err)
      if (res.statusCode !== 200) return callback(new Error(`HTTP ${res.statusCode}: ${body}`))

      let json
      try {
        json = JSON.parse(body)
      } catch (e) {
        return callback(e)
      }

      const data = json.data || []
      if (data.length === 0) return callback(null, null)
      callback(null, data[0].id)
    }
  )
}

// 取得一頁 streams
function getGameStreamsPage(gameId, cursor, callback) {
  const url = `${BASE_URL}/streams?game_id=${gameId}&first=100${cursor ? `&after=${cursor}` : ''}`

  request.get(
    {
      url,
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        'Client-Id': CLIENT_ID
      }
    },
    (err, res, body) => {
      if (err) return callback(err)
      if (res.statusCode !== 200) return callback(new Error(`HTTP ${res.statusCode}: ${body}`))

      let json
      try {
        json = JSON.parse(body)
      } catch (e) {
        return callback(e)
      }

      const streams = json.data || []
      const nextCursor = json.pagination?.cursor
      callback(null, streams, nextCursor)
    }
  )
}

// 拿到前 N 個 streams（遞迴分頁）
function getTopStreams(gameId, limit, callback) {
  const collected = []

  function step(cursor) {
    // 已經拿夠了就停
    if (collected.length >= limit) {
      return callback(null, collected.slice(0, limit))
    }

    getGameStreamsPage(gameId, cursor, (err, streams, nextCursor) => {
      if (err) return callback(err)

      collected.push(...streams)

      // 沒有下一頁 or 這頁沒資料 -> 結束
      if (!nextCursor || streams.length === 0) {
        return callback(null, collected.slice(0, limit))
      }

      // 繼續下一頁
      step(nextCursor)
    })
  }

  step(null)
}

// ---- 主程式 ----
const gameName = process.argv[2]
if (!gameName) {
  console.error('用法: node twitch.js "Apex Legends"')
  process.exit(1)
}

getGameID(gameName, (err, gameId) => {
  if (err) {
    console.error('取得遊戲 ID 失敗:', err.message)
    process.exit(1)
  }

  if (!gameId) {
    console.error(`找不到遊戲: ${gameName}`)
    process.exit(1)
  }

  getTopStreams(gameId, 200, (err, streams) => {
    if (err) {
      console.error('取得 streams 失敗:', err.message)
      process.exit(1)
    }

    streams.forEach((stream) => {
      console.log(`${stream.user_name} ${stream.id}`)
    })
  })
})
