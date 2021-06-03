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
  // 準備 input
  const [N, W] = [Number(lines[0].split(' ')[0]), Number(lines[0].split(' ')[1])]
  const arrayW = [0]
  const arrayV = [0]
  for (let i = 1; i < lines.length; i++) {
    arrayW.push(Number(lines[i].split(' ')[0]))
  }
  for (let i = 1; i < lines.length; i++) {
    arrayV.push(Number(lines[i].split(' ')[1]))
  }
  // 初始化（在 0 項物品的情況下，從限重 0 ~ W 的最佳解）
  let initial = []
  for (let i = 0; i <= W; i++) {
    initial.push(0)
  }

  // DP 更新填表
  for (let i = 1; i <= N; i++) {
    const new_ = [0]
    // 如果第 i 個東西大於最大限重，沒得放
    for (let j = 1; j <= W; j++) {
      if (arrayW[i] > j) {
        new_[j] = initial[j]
      }
      // 如果第 i 個東西小於等於最大限重
      if (arrayW[i] <= j) {
        // 放（剩餘重量的最佳解 + 第 i 個東西的重量）vs 不放 （最大限重下前 i - 1 個東西的最佳解）
        new_[j] = Math.max(initial[j - arrayW[i]] + arrayV[i], initial[j])
      }
    }
    // 在 i 項物品的情況下，從限重 0 ~ W 的最佳解
    initial = new_
  }
  console.log(initial[initial.length - 1])
}
