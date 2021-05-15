// 備註：這個程式碼還需要別的東西才能跑，因為 Twitch API 規則有變
// 所以基本上只是讓大家看個概念而已，概念絕對是相通的，可以自己換成舊的 API 試試看
const request = require('request')
const process = require('process')

const Accept = 'application/vnd.twitchtv.v5+json'
const Client = 'xkypa7ouwlhjupibscd4mk8lhwgtgk'
const BASE_URL = 'https://api.twitch.tv/kraken'

/*
  callback 會根據參數回傳部分實況列表
*/
function getStreams(name, callback) {
  const url = `${BASE_URL}/streams/?game=${name}&limit=100&offset=0`
  request({
    url,
    headers: {
      Accept,
      'Client-ID': Client
    }
  }, callback)
}

getStreams(process.argv[2], (err, res, body) => {
  if (err) {
    return console.log(err)
  }
  let info
  try {
    info = JSON.parse(body)
  } catch (err) {
    console.log(err)
    return
  }
  for (let i = 0; i < info.streams.length; i++) {
    console.log(info.streams[i].channel.name, info.streams[i].viewers)
  }
  const url = `${BASE_URL}/streams/?game=${process.argv[2]}&limit=100&offset=101`
  request({
    url,
    headers: {
      Accept,
      'Client-ID': Client
    }
  }, (err, res, body) => {
    if (err) {
      return console.log(err)
    }
    let info
    try {
      info = JSON.parse(body)
    } catch (err) {
      console.log(err)
      return
    }
    for (let i = 0; i < info.streams.length; i++) {
      console.log(info.streams[i].channel.name, info.streams[i].viewers)
    }
  }
  )
}
)
