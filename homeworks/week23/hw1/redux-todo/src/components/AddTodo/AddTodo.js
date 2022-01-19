import styled from '@emotion/styled/macro'
import { useState } from 'react'
import { MEDIA_QUERY_MD } from '../../constants/breakpoints'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: strech;
`

const InputContainer = styled.div`
  position: relative;
  width: 100%;
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

const Reminder = styled.span`
  width: 100px;
  background-color: #189BA3;
  color: #fff;
  font-family: 'Quicksand', "Microsoft JhengHei", sans-serif;
  text-align: center;
  font-size: 15px;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  top: -50px;
  left: 50%;
  transform: translate(-50%, 0);
  opacity: 0;
  transition: all 0.2s;
  :after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #189BA3 transparent transparent transparent;    
  }
`

const ToggleAllButton = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  height: 20px;
  min-width: 20px;
  border: 2px solid #189BA3;
  border-radius: 3px;
  margin-left: 15px;
  margin-right: 10px;
  background-color: ${({ $checked }) => $checked ? '#189BA3' : 'transparent'};
  padding: 0;
  transition: all 0.2s;
  :hover ${Reminder} {
    opacity: 0.8;
  }
`

export default function AddTodo({ todosCount, completedCount, addTodo, toggleAllTodos }) {
  const [input, setInput] = useState('')
  const handleAddTodo = (e) => {
    const { value } = e.target
    if (e.key !== 'Enter' || !value) return
    addTodo(value)
    setInput('')
  }
  const handleChange = (e) => {
    setInput(e.target.value)
  }
  const handleToggleTodos = () => {
    toggleAllTodos()
  }
  return (
    <Container>
      {!!todosCount && <ToggleAllButton
        $checked={completedCount === todosCount}
        onClick={handleToggleTodos}
      >
        <Reminder>
        {completedCount === todosCount ? '全部未完成' : '全部完成'}
        </Reminder>
      </ToggleAllButton>}
      <InputContainer>
        <Input
          value={input}
          onKeyDown={handleAddTodo}
          onChange={handleChange}
          placeholder="Add something to do here <(￣︶￣)>?"
        />
        <Underline />
      </InputContainer>
    </Container>
  )
}

