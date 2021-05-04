const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin
})

const lines = []

// 讀取到一行，先把這一行加進去 lines 陣列，最後再一起處理
rl.on('line', (line) => {
  lines.push(line)
})

// 輸入結束，開始針對 lines 做處理
rl.on('close', () => {
  solve(lines)
})

// 上面都不用管，只需要完成這個 function 就好，可以透過 lines[i] 拿取內容
function solve(lines) {
  const from = Number(lines[0].split(' ')[0])
  const to = Number(lines[0].split(' ')[1])
  for (let i = from; i <= to; i++) {
    let number = i
    let index = 0
    const res = []
    while (number > 0) {
      res.push(number % 10)
      number = Math.floor(number / 10)
      index += 1
    }
    let triSum = 0
    for (let i = 0; i < res.length; i++) {
      triSum += res[i] ** index
    }
    if (triSum === i) {
      console.log(i)
    }
  }
}
