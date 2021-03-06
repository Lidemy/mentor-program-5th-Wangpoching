function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
}

function mazeDonut(data, width, height, xThick, yThick) {
  const maze = convertDataToMaze(data, width, height, xThick, yThick)
  const { map, portals } = maze
  console.log(map)
  console.log(portals)
  const mazeCopy = JSON.parse(JSON.stringify(map[0]))
  const entryPoint = portals['AA'][0] // eslint-disable-line dot-notation
  mazeCopy[entryPoint[0]][entryPoint[1]] = '#'
  mazeCopy[portals['ZZ'][0][0]][portals['ZZ'][0][1]] = '#' // eslint-disable-line dot-notation
  let counter = 0
  let routes = [[0, entryPoint[0], entryPoint[1]]]
  let temp = []
  while (true) {
    for (const ele of routes) {
      const [depth, row, col] = ele
      const current = map[depth][row][col]

      // 如果看到出口就結束囉!
      if (current === 'ZZ') return counter

      // 如果走到傳送口會被傳送
      if (current !== '.' && current !== 'x' && current !== '#' && current !== 'AA') {
        const portalOPtions = portals[`${current}`]
        // 如果是走到外牆傳送口而且不是在最外層迷宮
        if (arrayEquals([row, col], portalOPtions[0]) && depth > 0) {
          const transLocation = [depth - 1, ...portalOPtions[1]]
          temp.push(transLocation)

          // 把走過的地方變成牆壁
          map[depth][row][col] = 'x'
          map[depth - 1][transLocation[1]][transLocation[2]] = 'x'
          continue
        }
        // 如果是走到內牆傳送口
        if (arrayEquals([row, col], portalOPtions[1])) {
          const transLocation = [depth + 1, ...portalOPtions[0]]
          temp.push(transLocation)

          // 動態加深迷宮深度並且把走過的地方變成牆壁
          map[depth][row][col] = 'x'
          if (!map[depth + 1]) {
            map.push(JSON.parse(JSON.stringify(mazeCopy)))
          }
          map[depth + 1][transLocation[1]][transLocation[2]] = 'x'
          continue
        }
      }

      // 否則
      map[depth][row][col] = 'x'
      // 右
      const currentRight = map[depth][row][col + 1]
      if (currentRight !== 'x' && currentRight !== '#') {
        temp.push([depth, row, col + 1])
      }
      // 下
      const currentBottom = map[depth][row + 1][col]
      if (currentBottom !== 'x' && currentBottom !== '#') {
        temp.push([depth, row + 1, col])
      }
      // 左
      const currentLeft = map[depth][row][col - 1]
      if (currentLeft !== 'x' && currentLeft !== '#') {
        temp.push([depth, row, col - 1])
      }
      // 上
      const currentTop = map[depth][row - 1][col]
      if (currentTop !== 'x' && currentTop !== '#') {
        temp.push([depth, row - 1, col])
      }
    }
    counter += 1
    routes = [...temp]
    temp = []
  }
}

function convertDataToMaze(data, width, height, xThick, yThick) {
  function isLabel(target) {
    return target === 'x' || target === '.' || target === '#'
  }
  function appendKey(container, key, value, isOutter) {
    if (key in container) {
      isOutter ? container[key].splice(0, 0, value) : container[key].splice(1, 0, value)
      return
    }
    container[key] = [value]
  }
  function appendPortals({ map, portals }) {
    const nRow = map[0].length
    const nCol = map[0][0].length

    // Top
    for (let i in map[0][0]) {
      i = Number(i)
      if (!isLabel(map[0][0][i]) && !isLabel(map[0][1][i])) {
        const portalName = `${map[0][0][i]}${map[0][1][i]}`
        map[0][2][i] = portalName
        appendKey(portals, portalName, [2, i], true)
        map[0][0][i] = 'x'
        map[0][1][i] = 'x'
      }
      if (!isLabel(map[0][yThick + 2][i]) && !isLabel(map[0][yThick + 3][i])) {
        const portalName = `${map[0][yThick + 2][i]}${map[0][yThick + 3][i]}`
        map[0][yThick + 1][i] = portalName
        appendKey(portals, portalName, [yThick + 1, i], false)
        map[0][yThick + 2][i] = 'x'
        map[0][yThick + 3][i] = 'x'
      }
    }

    // Bottom
    for (let i in map[0][0]) {
      i = Number(i)
      if (!isLabel(map[0][nRow - 2][i]) && !isLabel(map[0][nRow - 1][i])) {
        const portalName = `${map[0][nRow - 2][i]}${map[0][nRow - 1][i]}`
        map[0][nRow - 3][i] = portalName
        appendKey(portals, portalName, [nRow - 3, i], true)
        map[0][nRow - 2][i] = 'x'
        map[0][nRow - 1][i] = 'x'
      }
      if (!isLabel(map[0][nRow - 3 - yThick][i]) && !isLabel(map[0][nRow - 4 - yThick][i])) {
        const portalName = `${map[0][nRow - 4 - yThick][i]}${map[0][nRow - 3 - yThick][i]}`
        map[0][nRow - 2 - yThick][i] = portalName
        appendKey(portals, portalName, [nRow - 2 - yThick, i], false)
        map[0][nRow - 3 - yThick][i] = 'x'
        map[0][nRow - 4 - yThick][i] = 'x'
      }
    }

    // Left
    for (let i = 0; i < nRow; i++) {
      if (!isLabel(map[0][i][0]) && !isLabel(map[0][i][1])) {
        const portalName = `${map[0][i][0]}${map[0][i][1]}`
        map[0][i][2] = portalName
        appendKey(portals, portalName, [i, 2], true)
        map[0][i][0] = 'x'
        map[0][i][1] = 'x'
      }
      if (!isLabel(map[0][i][2 + xThick]) && !isLabel(map[0][i][3 + xThick])) {
        const portalName = `${map[0][i][2 + xThick]}${map[0][i][3 + xThick]}`
        map[0][i][1 + xThick] = portalName
        appendKey(portals, portalName, [i, 1 + xThick], false)
        map[0][i][2 + xThick] = 'x'
        map[0][i][3 + xThick] = 'x'
      }
    }

    // Right
    for (let i = 0; i < nRow; i++) {
      if (!isLabel(map[0][i][nCol - 2]) && !isLabel(map[0][i][nCol - 1])) {
        const portalName = `${map[0][i][nCol - 2]}${map[0][i][nCol - 1]}`
        map[0][i][nCol - 3] = portalName
        appendKey(portals, portalName, [i, nCol - 3], true)
        map[0][i][nCol - 2] = 'x'
        map[0][i][nCol - 1] = 'x'
      }
      if (!isLabel(map[0][i][nCol - 3 - xThick]) && !isLabel(map[0][i][nCol - 4 - xThick])) {
        const portalName = `${map[0][i][nCol - 4 - xThick]}${map[0][i][nCol - 3 - xThick]}`
        map[0][i][nCol - 2 - xThick] = portalName
        appendKey(portals, portalName, [i, nCol - 2 - xThick], false)
        map[0][i][nCol - 3 - xThick] = 'x'
        map[0][i][nCol - 4 - xThick] = 'x'
      }
    }
  }

  const maze = {
    map: [Array(height + 4).fill(null).map((row) => Array(width + 4).fill(null))],
    portals: {}
  }
  const { map } = maze
  for (let j = 0; j < (height + 4); j++) {
    for (let i = 0; i < (width + 4); i++) {
      const current = data[(width + 4) * j + i]
      map[0][j][i] = current === ' ' ? 'x' : current
    }
  }
  // 填通道
  appendPortals(maze)
  return maze
}

/*
const data = `
xxxxxxxxxAxxxxxxxxxxx
xxxxxxxxxAxxxxxxxxxxx
xx#######.#########xx
xx#######.........#xx
xx#######.#######.#xx
xx#######.#######.#xx
xx#######.#######.#xx
xx#####  B    ###.#xx
BC...##  C    ###.#xx
xx##.##       ###.#xx
xx##...DE  F  ###.#xx
xx#####    G  ###.#xx
xx#########.#####.#xx
DE..#######...###.#xx
xx#.#########.###.#xx
FG..#########.....#xx
xx###########.#####xx
xxxxxxxxxxxxxZxxxxxxx
xxxxxxxxxxxxxZxxxxxxx
`

const data2 = `
xxxxxxxxxxxxxZxLxXxWxxxxxxxCxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxZxPxQxBxxxxxxxKxxxxxxxxxxxxxxxxx
xx###########.#.#.#.#######.###############xx
xx#...#.......#.#.......#.#.......#.#.#...#xx
xx###.#.#.#.#.#.#.#.###.#.#.#######.#.#.###xx
xx#.#...#.#.#...#.#.#...#...#...#.#.......#xx
xx#.###.#######.###.###.#.###.###.#.#######xx
xx#...#.......#.#...#...#.............#...#xx
xx#.#########.#######.#.#######.#######.###xx
xx#...#.#    F       R I       Z    #.#.#.#xx
xx#.###.#    D       E C       H    #.#.#.#xx
xx#.#...#                           #...#.#xx
xx#.###.#                           #.###.#xx
xx#.#....OA                       WB..#.#..ZH
xx#.###.#                           #.#.#.#xx
CJ......#                           #.....#xx
xx#######                           #######xx
xx#.#....CK                         #......IC
xx#.###.#                           #.###.#xx
xx#.....#                           #...#.#xx
xx###.###                           #.#.#.#xx
XF....#.#                         RF..#.#.#xx
xx#####.#                           #######xx
xx#......CJ                       NM..#...#xx
xx###.#.#                           #.###.#xx
RE....#.#                           #......RF
xx###.###        X   X       L      #.#.#.#xx
xx#.....#        F   Q       P      #.#.#.#xx
xx###.###########.###.#######.#########.###xx
xx#.....#...#.....#.......#...#.....#.#...#xx
xx#####.#.###.#######.#######.###.###.#.#.#xx
xx#.......#.......#.#.#.#.#...#...#...#.#.#xx
xx#####.###.#####.#.#.#.#.###.###.#.###.###xx
xx#.......#.....#.#...#...............#...#xx
xx#############.#.#.###.###################xx
xxxxxxxxxxxxxxxAxOxFxxxNxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxAxAxDxxxMxxxxxxxxxxxxxxxxxxxxx
`
*/

const data3 = `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxGxFxxxxxxxxxZxxxTxxxxxYxxxCxxxxxxxxxYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxExZxxxxxxxxxZxxxQxxxxxIxxxTxxxxxxxxxXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xx#################################.#.#########.###.#####.###.#########.###############################xx
xx#...#.................#...#...#...#.....#...#.....#.....#.#.#.#...#.#...#...#.#.#.#.#...#.#.....#.#.#xx
xx#.#############.#.###.#.###.#####.###.#####.#####.#.#####.#.#.#.###.#.#.#.###.#.#.#.#.#.#.###.###.#.#xx
xx#.#.#.#...#.....#.#.........#.#...#.....#.#.......#.......#.......#...#.#...#.......#.#.#.#.#...#...#xx
xx#.#.#.#.#######.#######.###.#.#.#.###.###.#.###.#########.###.#.#####.###.###.#########.#.#.#.#####.#xx
xx#...#...#.#...#.#.......#.......#.#.#.#.#.....#.#.........#...#.....#.........#.#.....#.#.#.........#xx
xx###.###.#.#.#####.#.#######.#.###.#.#.#.###.#######.#####.#######.#####.#######.#.###.#.#.#.#########xx
xx#.........#.#...#.#...#.#...#.#.#.#.#.....#.....#.#.....#...#...#...#...........#.#.#.#...#.........#xx
xx#########.#.###.#######.#######.#.#.###.#######.#.#.#.###.#####.#.###.#########.###.#.#.###.#######.#xx
xx#...#.#.#.........#.......#.#...#.#...#...#.......#.#...#.....#.....#...#.....#...#.#.#...#...#...#.#xx
xx#.###.#.#.###.#######.###.#.###.#.#.#.#.###.###.#####.###.#.#####.###.#.#.#########.#.#.###.###.#####xx
xx#.....#.....#.#.#.#.#...#...#.....#.#.....#.#.#.#.#...#...#.#.....#.#.#.......#.......#.....#...#...#xx
xx###.###.#######.#.#.#####.#.#####.#.#######.#.###.#.#.###.#.#####.#.###.#.###.###.#.#.#.#######.#.###xx
xx#.....#.....#.......#...#.#.#.....#.....#...#.....#.#...#.#.#...#.....#.#...#.#.#.#.#.#.#.....#.#...#xx
xx#.#.#.#.###########.###.###.#####.#.#######.###.###.###.#####.###.#.###.###.###.#.#####.#.#####.#.###xx
xx#.#.#.......#.#.........#.#.#.#.#.#.#.#.....#.....#...#.#.........#.#.....#...#...#.#...#.#...#...#.#xx
xx#.#####.#####.#####.#.#.#.#.#.#.#.#.#.#####.###.###.###########.#######.#.#.#.###.#.###.#.###.#.#.#.#xx
xx#.#.#.#...#.#...#.#.#.#.....#.#.#.#...#.....#.#...#...#.#.#.......#.#.#.#.#.#.#.#.....#.....#...#.#.#xx
xx###.#.#.###.#.###.###.#.###.#.#.#.#.#.#.###.#.#.###.###.#.#####.#.#.#.#.#######.#.#####.#######.###.#xx
xx#.....#.....#.#.....#.#.#.......#.#.#.#.#.#.......#.#.....#.....#.#...#...........#...........#.#...#xx
xx###.#.#.#.###.#####.#######.###.#.#.#####.#.#####.#.#.#####.#.#.###.#.#.###.#.#########.#.#####.#.#.#xx
xx#.#.#.#.#.#.#.....#.....#.....#...#.......#.#.....#.#.....#.#.#.#.#.#.....#.#.#.....#...#...#...#.#.#xx
xx#.###.#.###.###.###.#.#.#####.#.#.#.#####.###.#####.###.#######.#.#.#.#.###########.###.#####.#.#.###xx
xx#.#.........#.#.#.#.#.#.#.....#.#.#.#.....#.......#.......#.......#.#.#.......#.#.#.#.#...#...#.#...#xx
xx#.#####.#.###.#.#.#.###.#####.#######.#########.#######.#########.#.###########.#.#.#.###.#####.#.###xx
xx#...#...#...#.....#.#.#.#    L       K         T       O         G V        #.#.#.#.....#...#.#.....#xx
xx###.###.#########.###.#.#    I       L         X       K         E Y        #.#.#.#.#####.###.#.#####xx
xx#.........#...#.........#                                                   #.............#...#.#...#xx
xx###.#.#######.###.#.#.#.#                                                   #.###.#.#.#.#.#.#.#.#.###xx
NA..#.#.#...#.#...#.#.#.#..ZV                                                 #...#.#.#.#.#...#.....#.#xx
xx#.#.#.#.###.#.#.#.#.#.###                                                   ###.#.#####.#######.###.#xx
xx#.#.#.#.....#.#.#.#.#...#                                                   #...#.#...#...#...#.#.#..EH
xx#.#.#.#.#.###.#########.#                                                   #.#.###.###.###.###.#.#.#xx
xx#...#...#...............#                                                 PB..#.#.#...#.#...#.#.....#xx
xx###.#.#####.#####.#######                                                   #####.#.#######.#.#.#####xx
xx#...#.#.....#.....#.....#                                                 YX..........#.#...#.#.#.#.#xx
xx###.#########.#.#.#.###.#                                                   #.#.###.###.#.#.#.###.#.#xx
xx#.......#.#...#.#.#...#.#                                                   #.#.#.#.......#...#...#.#xx
xx#.#######.#########.###.#                                                   #####.#.#####.###.#.###.#xx
xx#.#.#.#.#...........#....HM                                                 #.#...#...#.#.#.......#..KL
xx###.#.#.#.###.#####.###.#                                                   #.###.#####.#.#####.###.#xx
ZV..........#.....#.#...#.#                                                   #.#.#...#...#...#.#.....#xx
xx#############.#.#.#.###.#                                                   #.#.#.###.#######.#####.#xx
YB..........#...#...#.#...#                                                   #.....#.....#...#...#...#xx
xx###.###.#######.#########                                                   #.###.###.#.#.###.#.#####xx
xx#...#.....#.....#.#...#.#                                                 HP....#...#.#.......#.#....XC
xx#.#.#####.#######.###.#.#                                                   #.###.#.#.###.#.###.#.###xx
xx#.#.#.#.........#.#.#.#..TQ                                                 #.#.#.#...#...#.#.....#.#xx
xx#####.#####.#.###.#.#.#.#                                                   ###.###################.#xx
xx#.#.......#.#...........#                                                   #.#.....................#xx
xx#.#####.#################                                                   #.#.###.#.###.###.###.###xx
xx#.#......................GY                                               QD..#...#.#...#...#.#...#.#xx
xx#.###.#.#.#####.###.###.#                                                   #.###.#.#.###.###.#.#.#.#xx
xx#.....#.#.#.......#...#.#                                                   #.#...#.#.#...#...#.#.#..VY
xx###.###########.###.#.###                                                   #.#.#.#######.#######.#.#xx
xx#.#...........#...#.#...#                                                   #...#.....#.....#.......#xx
xx#.###.#.###########.###.#                                                   #################.###.###xx
LA......#.#.....#.#.....#.#                                                   #.......#.#...#.#...#...#xx
xx#####.###.#.###.#########                                                   #.###.###.#.###.#########xx
PB....#...#.#.#.....#.#.#..YI                                               LA..#...#.#.....#...#.#.#..AA
xx#.###.#.#.#####.###.#.#.#                                                   ###.###.#.#.###.###.#.#.#xx
xx#...#.#.#...#.....#.....#                                                   #.#.....#.#.#.....#.....#xx
xx#.#######.#####.###.###.#                                                   #.#.###.###.#.#.#####.#.#xx
xx#.#.....#.#.#.#...#...#.#                                                   #.#...#.......#.......#..QD
xx#.#.#.###.#.#.#.###.###.#                                                   #.#######.#.#####.#.#####xx
xx#...#...............#.#.#                                                 UC..#.....#.#.#.#.#.#.#.#..XV
xx#####.###############.###                                                   #.#.###.#####.#.###.#.#.#xx
xx#...#.#...........#.....#                                                   #.#...#...#.....#.#.#...#xx
xx#.#.###.#.#.#.#.#.###.###                                                   #.###.###.###.#.#.###.#.#xx
HP..#.....#.#.#.#.#........YB                                                 #.....#.......#.......#.#xx
xx#####.#.#####.#.#.#######                                                   ###########.#.#####.#.###xx
LI....#.#.....#.#.#.#......XC                                               XV........#...#.#.#.#.#.#.#xx
xx#.#####.#.#########.###.#                                                   #.#####.###.###.#.###.#.#xx
xx#...#.#.#.#.....#.#.#...#                                                   #.#.......#...#.#...#.#.#xx
xx#.###.#####.#.###.#.#####                                                   ###.#######.###.#.#####.#xx
xx#...#...#.#.#.....#.....#                                                   #...#...#.#.#.......#.#..HM
xx###.#.#.#.###.#.#######.#                                                   #.###.#.#.###.#.#####.#.#xx
xx#.....#.......#.........#                                                   #.....#.......#.........#xx
xx###.#.###.###.#.#.###.#.#        N     E     F   C     X   T           T    ###.#####.#####.#.#####.#xx
xx#...#...#.#...#.#.#...#.#        A     H     Z   T     O   Y           N    #.......#...#...#.#.....#xx
xx#.###.#####.#####.#.#.###########.#####.#####.###.#####.###.###########.#####.#.#.#########.#######.#xx
xx#.#.....#...#.....#.#.#...........#.....#...#.....#.....#.........#.........#.#.#.....#.....#.#...#.#xx
xx#####.#####.###.#########.#.#######.#####.#.###.###.#######.#.#######.###.#####.#############.###.#.#xx
xx#.#.#...#.....#.#.......#.#.....#.#.......#.#.#.#.#.....#.#.#.#.....#.#.......#.......#.............#xx
xx#.#.#.###.###.#.#####.#####.#.###.#######.###.#.#.#####.#.###.###.###.###.#.#.#.#.#######.#.###.###.#xx
xx#.......#...#.#.#...........#.#.#...#...#...#.......#...#...#.....#.#.#.#.#.#.#.#...#.....#.#...#...#xx
xx###.#####.###.#######.#.###.###.###.#.#.#.#####.#.#####.#.#####.###.###.#.###.#############.#######.#xx
xx#.#.#.......#.#...#...#.#.....#.#.....#...#.#...#.#...#...#.#.........#...#...#.#...#.#.#...#.#.....#xx
xx#.#.#.###.#####.#.###.#######.#.#.#.###.#.#.#####.###.###.#.###.###.#####.###.#.#.#.#.#.###.#.###.#.#xx
xx#...#.#...#.#...#.#.....#.......#.#.#.#.#.#.......#.#.......#...#...#.......#.#.#.#.#...........#.#.#xx
xx###.###.#.#.#.###.###.#####.#######.#.###.#.#.###.#.###.#.#####.#######.#######.#.#########.#####.#.#xx
xx#.....#.#.#...#.......#.......#.......#.#.#.#...#...#.#.#.#...#...#.......................#.#.....#.#xx
xx###.#################.#####.#######.###.#####.###.###.#.###.#####.#######.#.#####.#.###.###.#####.#.#xx
xx#.....#.#.....#.........#.#.....#...#.#.#.#.#.#.......#...#.....#.#.#.....#.#.#.#.#...#.#.....#...#.#xx
xx###.#.#.###.#.#.#########.#####.###.#.#.#.#.###.###.#####.#.###.#.#.###.#####.#.#########.#.###.###.#xx
xx#.#.#.#.#.#.#...#.#.............#.#.#...#.........#.#...#.#.#.#...#...............#.#.#...#...#...#.#xx
xx#.#####.#.###.###.###.###.#.#.#.#.#.###.#########.###.###.#.#.###.#.###.###########.#.###.#####.#.###xx
xx#.....#.......#.......#...#.#.#.#.#.....#...#.#.....#.....#...#.#.#...#...#...........#.......#.#...#xx
xx#.###.###.#####.#.#.#####.#.###.#.#.#######.#.###.#####.#.#.#.#.###.#######.#######.#####.#####.#####xx
xx#.#...#.#.#.....#.#.#.....#.#...#...#.#...........#.....#.#.#.....#.#...#.........#.#.#.......#.....#xx
xx#####.#.#.###.#.#######.#.#.#######.#.#####.#####.#######.#.#.#####.#.#####.#########.###.#.###.###.#xx
xx#.........#.#.#...#...#.#.#.#.....#.......#.....#.#...#.#.#.#.#...#...#...#.#...#...#.....#.#...#...#xx
xx###.#.#.#.#.#.#.###.#.#####.#####.#.###.#.#####.###.###.#.###.###.#.###.###.#.###.###.#.###.###.#.#.#xx
xx#...#.#.#.#...#.#...#...........#.....#.#.....#.......#.....#...#...................#.#.#...#...#.#.#xx
xx#############################.###########.#####.#.#######.###.###########.###########################xx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxTxxxxxxxxxxxTxxxxxOxTxxxxxxxUxxxGxxxxxxxxxxxXxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxXxxxxxxxxxxxNxxxxxKxYxxxxxxxCxxxYxxxxxxxxxxxOxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`

// const cleanData = data.replace(/\n|\r/g, '')
// const cleanData2 = data2.replace(/\n|\r/g, '')
const cleanData3 = data3.replace(/\n|\r/g, '')

console.log(mazeDonut(cleanData3, 101, 105, 25, 25))
