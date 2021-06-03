window.addEventListener('load',
  () => {
    // 默認在第一頁
    let nIndex = 0
    // 下方直接選頁功能
    document.querySelector('.number-box').addEventListener('click',
      (e) => {
        if (e.target.tagName.toLowerCase() === 'li' && !e.target.classList.contains('cur')) {
          nIndex = e.target.id - 1
          SwitchSlide(nIndex)
        }
      }
    )
    // 左按鈕
    document.querySelector('.left-btn').addEventListener('click',
      () => {
        if (nIndex <= 0) {
          return // 如果是第一張投影片就沒有反應
        }
        nIndex--
        SwitchSlide(nIndex)
      }
    )
    // 右按鈕
    document.querySelector('.right-btn').addEventListener('click',
      () => {
        if (nIndex >= (document.querySelectorAll('li').length - 1)) {
          return // 如果是最後一張投影片就沒有反應
        }
        nIndex++
        SwitchSlide(nIndex)
      }
    )
    // 自動切換功能

    // 滑鼠進投影片停止自動切換
    document.querySelector('.container').addEventListener('mouseleave',
      () => {
        clearInterval(timer)
      }
    )

    // 生成 timer
    let timer

    // 滑鼠移出投影片開始自動切換
    document.querySelector('.container').addEventListener('mouseenter',
      () => {
        // 輪播圖自動切換
        timer = setInterval(
          () => {
            // 向右切換圖片
            nIndex++
            // 已切換到最后一張圖片時，跳回第一張圖片
            if (nIndex > (document.querySelectorAll('li').length - 1)) {
              nIndex = 0
            }
            SwitchSlide(nIndex)
          }, 3000)
      }
    )
  }
)

// 將換圖片的功能包裝起來
function SwitchSlide(nIndex) {
  // 修改容器位置，拿來切換圖片
  document.querySelector('.sildes-box').style.left = `${-nIndex * document.querySelector('.slide').offsetWidth}px`
  // 洗掉所有分頁按鈕上的'cur'
  for (let i = 0; i < document.querySelectorAll('li').length; i++) {
    if (document.querySelectorAll('li')[i].classList.contains('cur')) {
      document.querySelectorAll('li')[i].classList.remove('cur')
    }
  }
  // 當前分頁按鈕加上'cur'
  document.querySelectorAll('li')[nIndex].classList.add('cur')
}
