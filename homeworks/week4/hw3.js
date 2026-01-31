/*
你的好麻吉小立是一個很愛到處旅遊的人，在前一陣子才靠著便宜的 bug 機票以及特價的商務艙玩遍了許多地方。不過小立一直有個困擾，那就是他希望了解更多跟國家有關的知識，因此他來請你幫忙寫一個搜尋國家資訊的小程式。

這個程式很簡單，只要輸入國家的英文名字，就能夠查詢符合的國家的資訊，會輸出以下幾項：

國家名稱
首都
使用的貨幣名稱
電話國碼
*/
const process = require('process')
const request = require('request')
const queryString = require('query-string').default

const ACCESS_KEY = '4cbe5c691eac8d66626dd4ca6de22836'
const BASE_URL = 'https://api.countrylayer.com/v2'

const getCountries = (name) => {
  const queryParams = queryString.stringify({
    access_key: ACCESS_KEY,
    filters: 'name;capital;callingCodes;currencies'
  })
  request.get({
    url: `${BASE_URL}/name/${name}?${queryParams}`
  }, (err, res, body) => {
    if (err) {
      console.log(err)
    }

    if (res.statusCode === 200) {
      let countries
      try {
        countries = JSON.parse(body)
      } catch (parseErr) {
        console.log(parseErr)
        return
      }
      console.log('==============')
      for (const country of countries) {
        const { name, capital, currencies, callingCodes } = country
        if (name) console.log(`國家: ${name}`)
        if (capital) console.log(`首都: ${capital}`)
        if (Array.isArray(currencies) && currencies.length > 0) {
          const currencyOutput = []
          currencies.forEach((ele) => currencyOutput.push(ele))
          console.log(`貨幣: ${currencyOutput.join(', ')}`)
        }
        if (Array.isArray(callingCodes) && callingCodes.length > 0) console.log(`國碼: ${country.callingCodes.join(', ')}`)
        console.log('==============')
      }
    } else if (res.statusCode === 404) {
      console.log('找不到國家資訊')
    } else {
      console.log('發生問題')
    }
  })
}

function main() {
  const countryName = process.argv[2]

  if (!countryName) {
    console.log('請輸入國家名稱')
    console.log('使用方式: node hw3.js <國家名稱>')
    return
  }

  getCountries(countryName)
}

main()
