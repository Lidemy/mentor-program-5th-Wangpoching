import styled from '@emotion/styled/macro';
import { useContext } from 'react';
import { TodoContext } from '../TodoApp/TodoApp.js'
import { MEDIA_QUERY_MD } from '../../constants/breakpoints'

const Container = styled.div`
  position: relative;
`
const Underline = styled.div`
  position: absolute;
  bottom: -1px;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #189BA3;
  transition: all 0.2s;
`

const Input = styled.input`
  width: 100%;
  background-color: #FFFDE7;
  border: inherit;
  padding: 10px;
  color: #189BA3;
  font-family: 'Quicksand', "Microsoft JhengHei", sans-serif;
  font-size: 20px;
  :focus {
    outline: inherit;
    font-size: 20px;
    & + ${Underline} {
      left: 0;
      width: 100%;      
    }
  }
  ${MEDIA_QUERY_MD} {
    font-size: 10px;
  }  
`

export default function InputBox() {
  const { inputTodoRef, handleAddTodo } = useContext(TodoContext)
  return (
    <Container>
      <Input
        onKeyDown={handleAddTodo}
        ref={inputTodoRef}
        placeholder="Add something to do here <(￣︶￣)>?"
      />
      <Underline />
    </Container>
  )
}

