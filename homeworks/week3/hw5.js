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
  const input = []
  for (let i = 1; i < lines.length; i++) {
    input.push(lines[i].split(' '))
  }
  for (let i = 0; i < input.length; i++) {
    if (Number(input[i][2]) === 1) {
      if (input[i][0].length > input[i][1].length) {
        console.log('A')
      } else if (input[i][0].length < input[i][1].length) {
        console.log('B')
      } else {
        for (let j = 0; j < input[i][0].length; j++) {
          if (Number(input[i][0][j]) !== Number(input[i][1][j])) {
            findBig(Number(input[i][0][j]), Number(input[i][1][j]))
            break
          }
          if (j === input[i][0].length - 1 && Number(input[i][0][j]) === Number(input[i][1][j])) {
            console.log('DRAW')
          }
        }
      }
    } else {
      if (input[i][0].length > input[i][1].length) {
        console.log('B')
      } else if (input[i][0].length < input[i][1].length) {
        console.log('A')
      } else {
        for (let j = 0; j < input[i][0].length; j++) {
          if (Number(input[i][0][j]) !== Number(input[i][1][j])) {
            findSmall(Number(input[i][0][j]), Number(input[i][1][j]))
            break
          }
          if (j === input[i][0].length - 1 && Number(input[i][0][j]) === Number(input[i][1][j])) {
            console.log('DRAW')
          }
        }
      }
    }
  }
}

function findBig(a, b) {
  if (a > b) {
    console.log('A')
  } else if (a < b) {
    console.log('B')
  }
}

function findSmall(a, b) {
  if (a > b) {
    console.log('B')
  } else if (a < b) {
    console.log('A')
  }
}
