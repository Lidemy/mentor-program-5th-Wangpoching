const request = require('request')
const process = require('process')

const url = `https://restcountries.eu/rest/v2/name/${process.argv[2]}`
request(
  url,
  (error, response, body) => {
    if (error) {
      console.log(error)
    } else if (!error && response.statusCode >= 200 && response.statusCode < 300) {
      let countries
      try {
        countries = JSON.parse(body)
      } catch (err) {
        console.log(err)
        return
      }
      console.log('============')
      for (let i = 0; i < countries.length; i++) {
        console.log(`國家：${countries[i].name}`)
        console.log(`首都：${countries[i].capital}`)
        console.log(`貨幣：${countries[i].currencies[0].code}`)
        console.log(`國碼：${countries[i].callingCodes[0]}`)
        console.log('============')
      }
    } else if (response.statusCode === 404) {
      let countries
      try {
        countries = JSON.parse(body)
      } catch (err) {
        console.log(err)
        return
      }
      if (countries.message === 'Not Found') {
        console.log('Can not find any country.')
      }
    }
  }
)
