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

function solve(lines) {
  // 整理輸入
  const roadObj = {}
  const H = Number(lines[0].split(' ')[0]) + 2
  const W = Number(lines[0].split(' ')[1]) + 2
  let inputIndex = 0
  let i = 0
  while (i < H) {
    let j = 0
    while (j < W) {
      if (isBorder(inputIndex, H, W)) {
        roadObj[inputIndex] = '#'
      } else {
        roadObj[inputIndex] = lines[i].split('')[j - 1]
      }
      j += 1
      inputIndex += 1
    }
    i += 1
  }
  const initial = W + 1
  const result = {}
  result[initial] = 0
  let temp = [initial]
  let announcer = 0
  while (announcer === 0) {
    const temp2 = []
    for (let i = 0; i < temp.length; i++) {
      if (isRoad(roadObj[temp[i] - W]) && !((temp[i] - W) in result)) {
        result[temp[i] - W] = result[temp[i]] + 1
        temp2.push(temp[i] - W)
      }
      if (isRoad(roadObj[temp[i] + W]) && !((temp[i] + W) in result)) {
        result[temp[i] + W] = result[temp[i]] + 1
        temp2.push(temp[i] + W)
      }
      if (isRoad(roadObj[temp[i] + 1]) && !((temp[i] + 1) in result)) {
        result[temp[i] + 1] = result[temp[i]] + 1
        temp2.push(temp[i] + 1)
      }
      if (isRoad(roadObj[temp[i] - 1]) && !((temp[i] - 1) in result)) {
        result[temp[i] - 1] = result[temp[i]] + 1
        temp2.push(temp[i] - 1)
      }
      if ((W * (H - 1) - 2) in result) {
        announcer = 1
        break
      }
    }
    temp = temp2
  }
  console.log(result[(W * (H - 1) - 2)])
}

function isRoad(n) {
  if (n === '.') {
    return true
  } else {
    return false
  }
}

function isBorder(num, H, W) {
  if ((num + 1) % W === 0) {
    return true
  } else if (num % W === 0) {
    return true
  } else if (num < W) {
    return true
  } else if (num >= W * (H - 1)) {
    return true
  } else {
    return false
  }
}
