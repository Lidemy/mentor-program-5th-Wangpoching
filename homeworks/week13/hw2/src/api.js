import $ from 'jquery'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js'
import { ajax, addComment2DOM } from './utils.js'

// 撈新留言
export function getNewComments(apiUrl, siteKey, count, limit, isShow = true, cb) {
  const ERROR = 'Connection Error'
  const url = `${apiUrl}api_get_comment.php?site_key=${siteKey}&offset=${count * 5}&limit=${limit}`
  ajax(url, 'GET', null, (res, error) => {
    if (error) {
      alert(ERROR)
      return
    }
    if (!res.ok) {
      alert(res.message)
      return
    }
    const comments = res.discussions
    if (comments.length === 0) {
      return
    }
    for (const comment of comments) {
      addComment2DOM($(`.${siteKey}-comments`), comment, count, true, isShow)
    }
    // toast 元件
    const toastElList = [].slice.call(document.querySelectorAll(`.${siteKey}-comments [data-id="${count}"].toast`))
    const toastList = toastElList.map((toastEl) => new bootstrap.Toast(toastEl, { autohide: false }))
    toastList.forEach((toast) => toast.show())
    cb()
  })
}

// 撈所有留言
export function getAllComments(apiUrl, siteKey, cb) {
  const ERROR = 'Connection Error'
  const url = `${apiUrl}api_get_comment.php?site_key=${siteKey}`
  ajax(url, 'GET', null, (res, error) => {
    if (error) {
      alert(ERROR)
      return
    }
    if (!res.ok) {
      alert(res.message)
      return
    }
    const comments = res.discussions
    for (const comment of comments) {
      addComment2DOM($(`.${siteKey}-comments`), comment, 'all', true, true)
    }
    // toast 元件
    const toastElList = [].slice.call(document.querySelectorAll(`.${siteKey}-comments [data-id="all"].toast`))
    const toastList = toastElList.map((toastEl) => new bootstrap.Toast(toastEl, { autohide: false }))
    toastList.forEach((toast) => toast.show())
    cb()
  })
}

// 新增留言
export function addComment(apiUrl, data, cb) {
  const ERROR = 'Connection Error'
  const siteKey = data.site_key
  const url = `${apiUrl}api_add_comment.php`
  ajax(url, 'POST', data, (res, error) => {
    if (error) {
      alert(ERROR)
      return
    }
    if (!res.ok) {
      alert(res.message)
      return
    }
    addComment2DOM($(`.${siteKey}-comments`), data, 'new', false, true)
    // toast 元件
    const toastElList = [].slice.call(document.querySelectorAll(`.${siteKey}-comments [data-id="new"].toast`))
    const toastList = toastElList.map((toastEl) => new bootstrap.Toast(toastEl, { autohide: false }))
    toastList.forEach((toast) => toast.show())
    cb()
  })
}
