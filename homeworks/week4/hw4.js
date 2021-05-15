const request = require('request')

const options = {
  url: 'https://api.twitch.tv/kraken/games/top',
  headers: {
    Accept: 'application/vnd.twitchtv.v5+json',
    'Client-ID': 'xkypa7ouwlhjupibscd4mk8lhwgtgk'
  }
}

function infoParser(error, response, body) {
  if (error) {
    console.log(error)
  } else if (!error && response.statusCode >= 200 && response.statusCode < 300) {
    let info
    try {
      info = JSON.parse(body)
    } catch (err) {
      console.log(err)
      return
    }
    for (let i = 0; i < info.top.length; i++) {
      console.log(`${info.top[i].viewers} ${info.top[i].game.name}`)
    }
  }
}

request(options, infoParser)
