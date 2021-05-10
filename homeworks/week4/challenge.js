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
  if (!error && response.statusCode === 200) {
    const info = JSON.parse(body)
    console.log('"ID" "NAME"')
    for (let i = 0; i < info.channels.length; i++) {
      console.log(`${info.channels[i]._id} ${info.channels[i].name}`)
    }
  }
}

function main() {
  request(offset(0), callback)
  request(offset(1), callback)
}

main()
