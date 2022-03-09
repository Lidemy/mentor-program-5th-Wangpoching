window.addEventListener('load', () => {
  // 初始化
  show()
  // 開始計算
  document.querySelector('.btn').addEventListener('click', () => {
    // 清空數字
    count = 0
    update()
    show()
    // 檢查數字範圍是否合法
    const input = Number(document.querySelector('.input').value)
    if (!isValidNumber(input)) {
      document.querySelector('.warning').classList.add('show')
    } else {
      // 跑迴圈
      repeat(input)
    }
  })
  // 當使用者要輸入的時候就清除警告
  document.querySelector('.input').addEventListener('focus', () => {
    document.querySelector('.warning').classList.remove('show')
  })
})

// 檢查是不是數字
function isValidNumber(text) {
  if (typeof text === 'number' && !isNaN(text)) {
    if (text >= 10 && text <= 1000) {
      return true
    }
  }
  return false
}

// 主程式

// 設定文件
let count = 0
const prizes = ['first', 'second', 'third', 'none']
const delay = 200
const errorMessage = 'error'
const apiUrl = 'https://dvwhnbka7d.execute-api.us-east-1.amazonaws.com/default/lottery'

// request
function draw(cb) {
  const request = new XMLHttpRequest()
  request.open('GET', apiUrl, true)
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      let data
      try {
        data = JSON.parse(request.response)
      } catch (err) {
        cb(errorMessage)
        return
      }
      if (!data.prize) {
        cb(errorMessage)
        return
      }
      cb(null, data)
    } else {
      cb(errorMessage)
    }
  }
  request.onerror = function() {
    cb(errorMessage)
  }
  request.send()
}

// 迴圈
function repeat(max) {
  if (count >= max) {
    return
  }
  // 抽一次獎
  draw((error, data) => {
    // 統計抽到的獎項
    const total = document.querySelector('.total')
    const problem = document.querySelector('.error')
    total.dataset.times = Number(total.dataset.times) + 1
    if (error) {
      problem.dataset.times = Number(problem.dataset.times) + 1
    } else {
      data = data.prize.toLowerCase()
      for (const prize of prizes) {
        if (data === prize) {
          const targetPrize = document.querySelector(`.${data}`)
          targetPrize.dataset.times = Number(targetPrize.dataset.times) + 1
          break
        }
      }
    }
    // 計算個獎項機率到小數點第二位
    const beforeCor = []
    for (const target of document.querySelectorAll('span+div')) {
      target.dataset.rate = round(Number(target.previousElementSibling.dataset.times) / Number(total.dataset.times) * 100, 2)
      beforeCor.push(target.dataset.rate)
    }

    // 修正機率百分比到總和一百
    let index = 0
    const afterCor = correction(beforeCor, 100)
    for (const target of document.querySelectorAll('span+div')) {
      target.dataset.rate = round(afterCor[index], 2)
      index++
    }
    show()
  })
  count++
  setTimeout(repeat(max), delay)
}

// 刷新累計次數與機率顯示
function show() {
  for (const element of document.querySelectorAll('span')) {
    element.innerText = element.dataset.times
  }
  for (const element of document.querySelectorAll('span+div')) {
    element.innerText = element.dataset.rate
  }
}

// 累計次數與機率歸零
function update() {
  for (const element of document.querySelectorAll('span')) {
    element.dataset.times = 0
  }
  for (const element of document.querySelectorAll('span+div')) {
    element.dataset.rate = 0
  }
}

// 四捨五入到小數第 digit 位
function round(num, digit) {
  return Math.round(num * (10 ** digit)) / (10 ** digit)
}

// 百分比總和校正
function correction(arr, total) {
  const reducer = (accumulator, currentValue) => accumulator + currentValue
  if (arr.reduce(reducer) === total) {
    return arr
  }
  let tempTotal = total
  const temp = []
  for (const i in arr) {
    if (arr[i] === 0) {
      temp.push(999999)
    } else {
      temp.push(arr[i])
    }
  }
  const minIndex = temp.indexOf(Math.min(...temp))
  for (const i in temp) {
    if (Number(i) !== minIndex && temp[i] !== 999999) {
      tempTotal -= temp[i]
    }
  }
  arr[minIndex] = tempTotal
  if (tempTotal <= 0) {
    arr[minIndex] = 0
  }
  return correction(arr, total)
}
