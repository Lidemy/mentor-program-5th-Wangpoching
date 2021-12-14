import { useState, useRef, useEffect, useCallback } from 'react';
  
const useTodoApi = () => {
  let id = useRef(1)
  const [ todos, setTodos ] = useState(() => {
    let todoData = window.localStorage.getItem("todos") || ""
    if (todoData) {
      todoData = JSON.parse(todoData)
      id.current = todoData[todoData.length - 1].id + 1
    } else {
      todoData = []
    }
    return todoData
  })
  useEffect(() => {
    window.localStorage.setItem('todos', JSON.stringify(todos))
  })
  //
  const inputTodoRef = useRef(null);
  const handleAddTodo = useCallback((e) => {
    if (e.key !== 'Enter') return
    const { value } = inputTodoRef.current
    setTodos([...todos, {
      id: id.current,
      isDone: false,
      content: value,
      isShow: true
    }])
    id.current ++
    inputTodoRef.current.value = ''
  }, [todos, setTodos, id, inputTodoRef])
  return [ id, todos, setTodos, inputTodoRef, handleAddTodo ]
}

export default useTodoApi


