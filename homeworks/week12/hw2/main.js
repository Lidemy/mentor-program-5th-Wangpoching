/* eslint-env jquery */
// 逃脫字元
function escape(string) {
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

// 0：All, 1：Done，2：Unone
function stateFilter(data, state) {
  let filteredData
  if (state === 1) {
    filteredData = data.filter((todo) => todo.isDone)
  } else if (state === 2) {
    filteredData = data.filter((todo) => !todo.isDone)
  } else {
    filteredData = data
  }
  return filteredData
}

// 渲染畫面
function render(data, state) {
  // 計算未完成待辦事項件數
  const unDone = data.filter((todo) => !todo.isDone)
  const unDoneNum = unDone.length
  // 篩出要渲染的代辦事項
  const filteredData = stateFilter(data, state)
  const container = $('.todos')
  // 渲染
  container.empty()
  for (const todo of filteredData) {
    container.prepend(`
      <li class="${escape(todo.isDone ? 'completed' : '')}" data-id=${typeof todo.id === 'number' ? todo.id : escape(todo.id)}>
        <label>
            <input class="todo" type="checkbox" ${escape(todo.isDone ? 'checked="checked"' : '')} />
            <div>${escape(todo.content)}</div>
        </label>
        <div class="btn__delete"><div>
      </li>
    `)
  }
  $('.uncomplete-count').text(`${typeof unDoneNum === 'number' ? unDoneNum : escape(unDoneNum)} items left`)
}

// xhr
function ajax(url, method, data, cb) {
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

$(window).ready(() => {
  // back to login
  function back() {
    window.location.href = 'http://mentor-program.co/mtr04group3/Wangpoching/todo/login.php'
  }
  let lastId = 0
  let state = 0
  let todos = []
  // 拿上一次的 todos
  if ($('.access-token').length > 0) {
    const url = 'http://mentor-program.co/mtr04group3/Wangpoching/todo/get_todo.php'
    const accessToken = $('.access-token').val()
    ajax(url, 'POST', { access_token: accessToken }, (res, err) => {
      if (err) {
        alert('error')
        back()
        return
      }
      if (!res.todos) {
        alert(res.message)
        back()
        return
      }
      try {
        todos = JSON.parse(res.todos)
      } catch (e) {
        alert(e)
        back()
        return
      }
      if (todos.length) {
        lastId = todos[todos.length - 1].id
      }
      render(todos, state)
    })
  }

  // 新增
  $('.input__text').keyup((e) => {
    const target = $('.input__text')
    if (e.key === 'Enter') {
      const todo = target.val()
      target.val('')
      if (!todo) return
      lastId += 1
      todos.push({
        id: lastId,
        content: todo,
        isDone: false
      })
      render(todos, state)
    }
  })

  // 刪除
  $('.todos').on('click', '.btn__delete', (e) => {
    const deletedId = $(e.target).closest('li').data('id')
    todos = todos.filter((todo) => todo.id !== deletedId)
    render(todos, state)
  })

  // 完成/未完成
  $('.todos').on('click', '.todo', (e) => {
    const target = $(e.target)
    const selectedId = target.closest('li').data('id')
    for (const todo of todos) {
      if (todo.id === selectedId) {
        todo.isDone = !todo.isDone
        break
      }
    }
    render(todos, state)
  })

  // 狀態改變（ All, Done, Undone ）
  $('.complete-type').click((e) => {
    const states = $('.complete-type').children()
    states.eq(state).removeClass('active')
    $(e.target).addClass('active')
    state = $(e.target).data('id')
    render(todos, state)
  })

  // 全選
  $('.select-all').click((e) => {
    const target = $(e.target)
    target.toggleClass('active')
    if (target.hasClass('active')) {
      for (const todo of todos) {
        todo.isDone = true
      }
    } else {
      for (const todo of todos) {
        todo.isDone = false
      }
    }
    render(todos, state)
  })

  // 刪除已完成
  $('.clear-select').click(() => {
    todos = todos.filter((todo) => !todo.isDone)
    render(todos, state)
  })

  // 儲存
  $('.btn-save').click(() => {
    const packedTodo = JSON.stringify(todos)
    const url = 'http://mentor-program.co/mtr04group3/Wangpoching/todo/save_todo.php'
    const data = { todos: packedTodo }
    if ($('.access-token').length > 0) {
      data.access_token = $('.access-token').val()
    }
    ajax(url, 'POST', data, (res, err) => {
      if (err) {
        alert('connect error')
        return
      }
      if (!res.ok) {
        alert(res.message)
        return
      }
      if (res.access_token) {
        $(`<input type="hidden" class="access-token" value="${escape(res.access_token)}">`).insertBefore('.clear-select')
        alert(`Please remember your access token : ${escape(res.access_token)}`)
      } else {
        alert('saved')
      }
    })
  })
})
