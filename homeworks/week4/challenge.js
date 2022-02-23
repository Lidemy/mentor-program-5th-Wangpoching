const request = require('request')
const process = require('process')

const Accept = 'application/vnd.twitchtv.v5+json'
const Client = 'xkypa7ouwlhjupibscd4mk8lhwgtgk'
const BASE_URL = 'https://api.twitch.tv/kraken'

function handleGetStreams(name, num) {
  const limit = 100
  let offset = 0
  const streams = []

  function getStreams() {
    offset += 100
    const url = `${BASE_URL}/streams/?game=${name}&limit=${limit}&offset=${offset}`
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
      if (streams.length > num) {
        for (let i = 0; i < info.streams.length; i++) {
          streams.push(info.streams[i])
        }
      } else {
        const slicedStreams = streams.slice(0, num)
        for (let i = 0; i < slicedStreams.length; i++) {
          console.log(slicedStreams[i].channel.name, slicedStreams[i].viewers)
        }
        getStreams()
      }
    })
  }

  getStreams()
}

handleGetStreams(process.argv[2], 200)
