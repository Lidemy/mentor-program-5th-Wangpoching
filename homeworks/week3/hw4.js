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
  //  整理輸入成一個數字
  const str = lines[0]
  let ans = 'True'
  let index = str.length - 1
  for (let i = 0; i < Math.floor(str.length / 2); i++) {
    if (str[i] !== str[index]) {
      ans = 'False'
      break
    }
    index -= 1
  }
  console.log(ans)
}
