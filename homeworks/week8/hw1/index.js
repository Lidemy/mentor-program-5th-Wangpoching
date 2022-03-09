window.addEventListener('load', () => {
  document.querySelector('.lottery-button').addEventListener('click', () => {
    draw((err, data) => {
      // 只要有錯誤就跳系統錯誤
      if (err) {
        alert(err)
        return
      }

      const { className, title } = prizes[data.prize]

      // 換封面
      cleanBanner(document.querySelector('.image__banner'))
      document.querySelector('.image__banner').classList.add(className)

      // 第一次抽
      const introTicket = document.querySelector('.lottery-ticket')
      if (introTicket) {
        document.querySelector('.image__banner').removeChild(introTicket)
        const div = document.createElement('div')
        div.innerText = title
        div.classList.add('prz-msg')
        document.querySelector('.image__banner').prepend(div)
      } else {
        // 重複抽
        document.querySelector('.prz-msg').innerText = title
      }
    })
  })
})
// 寫設定文件
const prizes = {
  FIRST: {
    className: 'first',
    title: '恭喜你中頭獎了！日本東京來回雙人遊！'
  },
  SECOND: {
    className: 'second',
    title: '二獎！90 吋電視一台！'
  },
  THIRD: {
    className: 'third',
    title: '恭喜你抽中三獎：知名 YouTuber 簽名握手會入場券一張，bang！'
  },
  NONE: {
    className: 'none',
    title: '銘謝惠顧'
  }
}
const apiUrl = 'https://dvwhnbka7d.execute-api.us-east-1.amazonaws.com/default/lottery'
const errorMsg = '系統不穩定，請再試一次'

// 移除上一個抽獎結果的 class
function cleanBanner(ele) {
  const { classList } = ele
  for (const [, value] of Object.entries(prizes)) {
    if (classList.contains(value.className)) {
      classList.remove(value.className)
      return
    }
  }
}

// call api
function draw(cb) {
  const request = new XMLHttpRequest()
  request.onerr = function() {
    cb(errorMsg)
  }
  request.open('GET', apiUrl, true)
  request.send()
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      let data
      try {
        data = JSON.parse(request.responseText)
      } catch (e) {
        cb(errorMsg)
        return
      }
      if (!data.prize) {
        cb(errorMsg)
        return
      }
      cb(null, data)
    } else {
      cb(errorMsg)
    }
  }
}
