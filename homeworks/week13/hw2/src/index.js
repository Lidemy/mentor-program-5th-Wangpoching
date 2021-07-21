/* eslint-disable import/prefer-default-export */
import $ from 'jquery'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js'
import { getNewComments, getAllComments, addComment } from './api.js'
import { date } from './utils.js'
import { getAddCommentForm, getLoadMore } from './templates.js'
import './bootstrap.min.css'
import './main.css'

window.bootstrap = bootstrap
// 初始化
export function init(options) {
  // 起始參數
  let count = 0
  const LIMIT = 5

  const { siteKey } = options
  const { apiUrl } = options
  const containerSelector = `.${options.containerClassName}`
  const loadMoreClassName = `${siteKey}-loadmore`
  const loadMoreSelector = `.${loadMoreClassName}`
  const commentsClassName = `${siteKey}-comments`
  const commentsSelector = `.${commentsClassName}`
  const addCommentFormClassName = `${siteKey}-add-comment-form`
  const addCommentFormSelector = `.${addCommentFormClassName}`
  const wrapperClassName = `${siteKey}-board__wrapper`
  const wrapperSelector = `.${wrapperClassName}`

  // 插入留言板 template
  $(containerSelector).append(getAddCommentForm(addCommentFormClassName, commentsClassName, wrapperClassName))
  // 載入留言
  getNewComments(apiUrl, siteKey, count, LIMIT, true, () => {
    getNewComments(apiUrl, siteKey, count + 1, LIMIT, false, () => {
      count += 1
      const loadMoreHTML = getLoadMore(loadMoreClassName)
      $(commentsSelector).append(loadMoreHTML)
    })
  })

  // 防止按 Enter 送出表單
  $(addCommentFormSelector).submit((e) => {
    e.preventDefault()
  })

  // 新增留言
  $(`${addCommentFormSelector} .btn-submit`).click((e) => {
    const nicknameElement = $(`${addCommentFormSelector} input[name="nickname"]`)
    const contentElement = $(`${addCommentFormSelector} textarea[name="content"]`)
    const data = {
      site_key: siteKey,
      nickname: nicknameElement.val(),
      content: contentElement.val(),
      created_at: date()
    }
    addComment(apiUrl, data, () => {
      // 清空
      nicknameElement.val('')
      contentElement.val('')
    })
  })

  // 載入更多
  $(commentsSelector).on('click', loadMoreSelector, (e) => {
    $(e.target).parent().remove()
    // 顯示留言
    $(`${commentsSelector} [data-id="${count}"].toast`).parent().removeClass('hide')
    // 撈留言（ 隱藏 ）
    getNewComments(apiUrl, siteKey, count + 1, LIMIT, false, () => {
      count += 1
      const loadMoreHTML = getLoadMore(loadMoreClassName)
      $(commentsSelector).append(loadMoreHTML)
    })
  })

  // 刷新
  $(`${addCommentFormSelector} .btn-refresh`).click((e) => {
    e.preventDefault()
    $(commentsSelector).empty()
    count = 0
    // 載入留言
    getNewComments(apiUrl, siteKey, count, LIMIT, true, () => {
      getNewComments(apiUrl, siteKey, count + 1, LIMIT, false, () => {
        count += 1
        const loadMoreHTML = getLoadMore(loadMoreClassName)
        $(commentsSelector).append(loadMoreHTML)
      })
    })
  })

  // 回到頂部
  $(`${wrapperSelector} .btn-gotop`).click((e) => {
    const wrapperParent = document.querySelector(wrapperSelector).parentNode
    // 測試是否有垂直滾動軸
    if (wrapperParent.scrollHeight > wrapperParent.clientHeight) {
      wrapperParent.scrollTop = 0
    } else {
      const currentScrollTop = $(window).scrollTop()
      const rect = wrapperParent.getBoundingClientRect()
      const scrollDistance = rect.top + currentScrollTop
      window.scroll(0, scrollDistance)
    }
  })

  // 移至最底
  $(`${wrapperSelector} .btn-gobottom`).click(() => {
    count = 0
    const wrapperElement = document.querySelector(wrapperSelector)
    const wrapperParent = wrapperElement.parentNode
    $(commentsSelector).empty()
    getAllComments(apiUrl, siteKey, () => {
      // 測試是否有垂直滾動軸
      if (wrapperParent.scrollHeight > wrapperParent.clientHeight) {
        wrapperParent.scrollTop = wrapperElement.offsetHeight - wrapperParent.offsetHeight
      } else {
        const currentScrollTop = $(window).scrollTop()
        const rect = wrapperParent.getBoundingClientRect()
        const scrollDistance = rect.top + rect.height + currentScrollTop - window.innerHeight
        window.scroll(0, scrollDistance)
      }
    })
  })
}
