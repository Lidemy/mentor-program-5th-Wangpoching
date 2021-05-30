window.addEventListener('load',
  () => {
    // 輸入框
    document.querySelector('.input__text').addEventListener('keyup',
      (e) => {
        if (e.key === 'Enter') {
          const todo = document.querySelector('.input__text').value
          if (!todo) return
          const li = document.createElement('li')
          document.querySelector('.input__text').value = ''
          li.innerHTML = `
              <label>
                <input class='todo' type='checkbox' />
                <div></div>
              </label>
              <div class='btn__delete'><div>
            `
          li.querySelector('.todo+div').innerText = todo
          document.querySelector('ul').prepend(li)
        }
      }
    )
    // 刪除 & 勾選特效
    document.querySelector('ul').addEventListener('click',
      (e) => {
        if (e.target.classList.contains('btn__delete')) {
          e.target.closest('li').outerHTML = ''
        } else if (e.target.classList.contains('todo')) {
          e.target.closest('li').classList.toggle('completed')
        }
      }
    )
  }
)
