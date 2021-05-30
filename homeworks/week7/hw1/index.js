window.addEventListener('load',
  () => {
    // 按下 submit 發生的事
    document.querySelector('form').addEventListener('submit',
      (e) => {
        let pass = true
        const nickName = document.querySelector('.nickname-input').value
        const mail = document.querySelector('.mail-input').value
        const phone = document.querySelector('.phone-input').value
        const how = document.querySelector('.how-input').value
        const other = document.querySelector('.other-input').value
        let enrolltype = ''
        if (document.querySelector('#first').checked) {
          enrolltype = document.querySelector('[for="first"]').innerText
        } else if (document.querySelector('#second').checked) {
          enrolltype = document.querySelector('[for="second"]').innerText
        }
        // 處理暱稱空白
        if (!nickName) {
          const div = document.createElement('div')
          div.classList.add('nickname-alert')
          div.innerText = '暱稱不能為空'
          if (document.querySelector('.nickname-alert')) {
            document.querySelector('.nickname-block').removeChild(document.querySelector('.nickname-alert'))
          }
          document.querySelector('.nickname-block').appendChild(div)
          e.preventDefault()
          pass = false
        }
        // 處理電子郵件空白
        if (!mail) {
          const div = document.createElement('div')
          div.classList.add('mail-alert')
          div.innerText = '電子郵件不能為空'
          if (document.querySelector('.mail-alert')) {
            document.querySelector('.mail-block').removeChild(document.querySelector('.mail-alert'))
          }
          document.querySelector('.mail-block').appendChild(div)
          e.preventDefault()
          pass = false
        }
        // 處理電話空白
        if (!phone) {
          const div = document.createElement('div')
          div.classList.add('phone-alert')
          div.innerText = '電話不能為空'
          if (document.querySelector('.phone-alert')) {
            document.querySelector('.phone-block').removeChild(document.querySelector('.phone-alert'))
          }
          document.querySelector('.phone-block').appendChild(div)
          e.preventDefault()
          pass = false
        }
        // 處理怎麼知道的空白
        if (!how) {
          const div = document.createElement('div')
          div.classList.add('how-alert')
          div.innerText = '怎麼知道的不能為空'
          if (document.querySelector('.how-alert')) {
            document.querySelector('.how-block').removeChild(document.querySelector('.how-alert'))
          }
          document.querySelector('.how-block').appendChild(div)
          e.preventDefault()
          pass = false
        }
        // 處理報名類型沒勾
        if (!enrolltype) {
          const div = document.createElement('div')
          div.classList.add('enrolltype-alert')
          div.innerText = '請勾選報名類型'
          if (document.querySelector('.enrolltype-alert')) {
            document.querySelector('.how-block').removeChild(document.querySelector('.enrolltype-alert'))
          }
          document.querySelector('.enrolltype-block').appendChild(div)
          e.preventDefault()
          pass = false
        }
        if (pass) {
          const info = `暱稱：${nickName}\n電子郵件：${mail}\n電話：${phone}\n報名類型：${enrolltype}\n怎麼知道這個活動：${how}\n其他：${other}`
          alert(info)
          return true
        }
      }
    )
  }
)
