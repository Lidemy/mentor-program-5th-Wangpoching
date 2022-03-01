window.addEventListener('load',
  () => {
    document.querySelector('.form__wrapper').addEventListener('focusin', () => {
      const alerts = [...document.querySelectorAll('.alert')]
      alerts.forEach((alert) => {
        alert.classList.add('hide')
      })
    })
    // 按下 submit 發生的事
    document.querySelector('form').addEventListener('submit',
      (e) => {
        let pass = true
        const nickName = document.querySelector('.nickname-input').value
        const mail = document.querySelector('.mail-input').value
        const phone = document.querySelector('.phone-input').value
        const how = document.querySelector('.how-input').value
        const other = document.querySelector('.other-input').value
        const enrollTypeBlock = document.querySelector('.enrolltype-block')
        const enrolltypes = [...enrollTypeBlock.querySelectorAll('input')]
        let enrolltype
        enrolltypes.forEach((element) => {
          if (element.checked) {
            enrolltype = element.nextSibling.innerText
          }
        })
        function handleBlank(className) {
          document.querySelector(`.${className}`).querySelector('.alert').classList.remove('hide')
          e.preventDefault()
          pass = false
        }
        // 處理暱稱空白
        if (!nickName) handleBlank('nickname-block')
        // 處理電子郵件空白
        if (!mail) handleBlank('mail-block')
        // 處理電話空白
        if (!phone) handleBlank('phone-block')
        // 處理怎麼知道的空白
        if (!how) handleBlank('how-block')
        // 處理報名類型沒勾
        if (!enrolltype) handleBlank('enrolltype-block')
        if (pass) {
          const info = `暱稱：${nickName}\n電子郵件：${mail}\n電話：${phone}\n報名類型：${enrolltype}\n怎麼知道這個活動：${how}\n其他：${other}`
          alert(info)
        }
      }
    )
  }
)
