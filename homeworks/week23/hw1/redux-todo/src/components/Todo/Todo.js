import styled from '@emotion/styled/macro';
import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@emotion/react'
import PropTypes from 'prop-types';

const Container = styled.li`
  position: relative;
  padding: 12px 24px;
  font-size: 20px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  opacity: ${props => props.theme.isDone? '0.4;' : '1;'}
  :hover {
    background-color:${props => props.theme.isDone? '#FFFDE7;' : 'rgba( 255, 255, 255, 0.9);'} 
  }
`

const Reminder = styled.span`
  width: 60px;
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
  margin-left: -30px;
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

const Checkbox = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  height: 20px;
  min-width: 20px;
  border: 2px solid #189BA3;
  border-radius: 3px;
  margin-right: 10px;
  background-color: transparent;
  padding: 0;
  transition: all 0.2s;
  :hover ${Reminder} {
    opacity: 0.8;
  }
`

const Content = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  display: inline-block;
  margin: 10px 0;
  font-size: 20px;
  :after {
    content: '';
    position: relative;
    top: -12px;
    left: -5%;
    display: ${props => props.theme.isDone? 'block;' : 'none;'}
    width: 110%;
    border-bottom: 1px solid #189BA3;
  }
`

const InputContent = styled.input`
  position: relative;
  display: inline-block;
  margin: 10px 0;
  font-size: 20px;
  background-color: #FFFDE7;
  font-weight: bold;
  font-family: 'Quicksand';
  padding: 0 0 5px 0;
  color: #189BA3;
  border: inherit;
  border-bottom: 3px solid #189BA3;
  :focus {
    outline: inherit;
  }
  :after {
    content: '';
    position: relative;
    top: -12px;
    left: -5%;
    display: ${props => props.theme.isDone? 'block;' : 'none;'}
    width: 110%;
    border-bottom: 1px solid #189BA3;
  }
`

const Buttons = styled.div`
  display: flex;
  margin-left: auto
`

const DeleteButton = styled.button`
  cursor: pointer;
  position: relative;
  font-size: 20px;
  background-color: transparent;
  border: inherit;
  padding: 0;
  transition: all 0.2s;
  :hover ${Reminder} {
    opacity: 0.8;
  }
`

const EditButton = styled.button`
  cursor: pointer;
  position: relative;
  font-size: 20px;
  background-color: transparent;
  border: inherit;
  padding: 0;
  transition: all 0.2s;
  :hover ${Reminder} {
    opacity: 0.8;
  }
`

const DeleteIcon = styled.i`
  padding: 2px;
  color: #189BA3;
`

const CheckIcon = styled.i`
  padding: 2px;
  color: #189BA3;
  z-index: 1
`
const PenIcon = styled.i`
  padding: 2px;
  color: #189BA3;
  z-index: 1
`

function Todo({ todo, deleteTodo, editTodo, toggleTodo }) {
  const { id, isDone, content } = todo
  const [ inputValue, setInputValue ] = useState(content)
  const [ isEditMode, setIsEditModeMode ] = useState(false)

  useEffect(() => {
    if (!isEditMode) return
    document.querySelector('#editTodoBox').focus()
  }, [isEditMode])

  const handleChangeTodoState = useCallback(
    () => {
      toggleTodo(id)
    }, [id, toggleTodo])

  const handleEditTodo = useCallback(
    () => {
      editTodo(id, inputValue)
    }, [id, editTodo, inputValue])

  const handleDeleteTodo = useCallback(
    () => {
      deleteTodo(id)
    }, [id, deleteTodo])

  const handleChangeMode = useCallback(
    () => {
      setIsEditModeMode(!isEditMode)
    }, [isEditMode, setIsEditModeMode])

  const handleChange = (e) => {
    setInputValue(e.target.value)
  }
  const theme = {
    isDone
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Checkbox type="button" onClick={handleChangeTodoState}>
          {isDone? <CheckIcon className="fas fa-check fa-sm" /> : <Reminder>完成</Reminder>}
        </Checkbox>
        {isEditMode? 
          <InputContent
            id="editTodoBox"
            value={inputValue} 
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return
              handleChangeMode()
              handleEditTodo()
            }}
          /> : <Content>{content}</Content>}
        <Buttons>
          <EditButton
            type="button"
            onClick={() => {
              if (isEditMode) return
              handleChangeMode()
            }}
          > 
            <PenIcon className="fas fa-pen fa-sm"></PenIcon>
            <Reminder>編輯</Reminder>
          </EditButton>
          <DeleteButton type="button" onClick={handleDeleteTodo}> 
            <DeleteIcon className="fas fa-times fa-sm"></DeleteIcon>
            <Reminder>刪除</Reminder>
          </DeleteButton>
        </Buttons>
      </Container>
    </ThemeProvider>
  )
}

export default Todo

Todo.propTypes = {
  todo: PropTypes.shape({
      id: PropTypes.number,
      content: PropTypes.string,
      isDone: PropTypes.bool,
      isShow: PropTypes.bool,
    })
};
