import styled from '@emotion/styled'
import PropTypes from 'prop-types'

const RemiderContainer = styled.div`
  display: ${({ $showReminder }) => $showReminder ? 'block' : 'none'};
  padding: 20px;
  position: fixed;
  z-index: 1;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: ${({ theme }) => theme.background.popup};
  box-shadow: ${({ theme }) => theme.boxShadow.primary};
`

const RemiderContent = styled.div`
  color: ${({ theme }) => theme.text.primary};  
`

const Buttons = styled.div`
  margin-top: 10px;
  display: flex;
  button + button {
    margin-left: 3px;
  }
`
const Button = styled.button`
  padding: 5px 20px;
  background-color: ${({ theme }) => theme.button.submit};
  color: ${({ theme }) => theme.text.negative};
  border: transparent;
  border-radius: 3px;
  cursor: pointer;
`

function Reminder({ $showReminder, setShowReminder, handleDeleteArticle, csrfToken }) {
  const handleClick = () => {
    setShowReminder(false)
  }

  return (
      <RemiderContainer $showReminder={$showReminder}>
        <RemiderContent>
          你確定要刪除文章嗎?
        </RemiderContent>
        <Buttons>
          <Button
            onClick={() => {
              handleDeleteArticle(csrfToken)
            }}
          >確定</Button>
          <Button 
            onClick={handleClick}
          >
            取消
          </Button>
        </Buttons>
      </RemiderContainer>
  )
}

Reminder.propTypes = {
  $showReminder: PropTypes.bool,
  setShowReminder: PropTypes.func, 
  handleDeleteArticle: PropTypes.func,
  csrfToken: PropTypes.string
}

export default Reminder
