const request = require('request')
const process = require('process')

function offset(n) {
  const options = {
    url: `https://api.twitch.tv/kraken/search/channels?query=${process.argv[2]}&limit=100&offset=${n}`,
    headers: {
      Accept: 'application/vnd.twitchtv.v5+json',
      'Client-ID': 'xkypa7ouwlhjupibscd4mk8lhwgtgk'
    }
  }
  return options
}

function callback(error, response, body) {
  if (!error && response.statusCode >= 200 && response.statusCode < 300) {
    let info
    try {
      info = JSON.parse(body)
    } catch (err) {
      console.log(err)
      return
    }
    console.log('"ID" "NAME"')
    for (let i = 0; i < info.channels.length; i++) {
      console.log(`${info.channels[i]._id} ${info.channels[i].name}`)
    }
    request(offset(1), (error, response, body) => {
      if (!error && response.statusCode >= 200 && response.statusCode < 300) {
        let info_
        try {
          info_ = JSON.parse(body)
        } catch (err) {
          console.log(err)
          return
        }
        for (let j = 0; j < info_.channels.length; j++) {
          console.log(`${info_.channels[j]._id} ${info_.channels[j].name}`)
        }
      }
    }
    )
  }
}

function main() {
  request(offset(0), callback)
}

main()
