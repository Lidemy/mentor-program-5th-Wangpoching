import $ from 'jquery'

// 逃脫字元
export function escape(string) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  }
  const reg = /[&<>"'/]/ig
  return string.replace(reg, (match) => (map[match]))
}

// 現在時間（ 新增留言 )
export function date() {
  const today = new Date()
  const date = `${today.getFullYear()}-'${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
  const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
  const dateTime = `${date} ${time}`
  return dateTime
}

// XHR
export function ajax(url, method, data, cb) {
  const input = {}
  input.type = method
  input.url = url
  if (data) {
    input.data = data
  }
  $.ajax(input).done((res) => {
    cb(res, null)
  }).fail((error) => {
    cb(null, error)
  })
}

// 添加留言到 DOM
export function addComment2DOM(container, comment, id, isAppend = true, apper = true) {
  const html = `
    <div class="col-8 comment mb-3 ${apper ? '' : 'hide'}">
      <div class="toast" data-id = "${id}" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">${escape(comment.nickname)}</strong>
          <small>${escape(comment.created_at)}</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${escape(comment.content)}
        </div>
      </div>
    </div>
  `
  if (isAppend) {
    container.append(html)
  } else {
    container.prepend(html)
  }
}
