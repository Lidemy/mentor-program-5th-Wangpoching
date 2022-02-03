import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import { MEDIA_QUERY_SM } from '../../constants/breakpoints'

import { logout, selectCurrentUser } from '../../redux/usersSlice'

const MenuContainer = styled.ul`
  margin: 0 0 0 0;
  list-style-type: none;
  padding: 60px 0px;
  position: fixed;
  top: 0px;
  right: 0px;
  width: 450px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  background-color: rgb(0, 81, 195);
  box-shadow: rgb(0 0 0 / 10%) 0px 0px 30px;
  transition: all 0.5s ease 0s;
  z-index: 100;
  transform: ${({ $showMenu }) => $showMenu ? 'translateX(0%);' : 'translateX(100%);'}

  ${MEDIA_QUERY_SM} {
    width: 90%;
  }
`

const MenuOption = styled.li`
`

const ToolbarLink = styled(Link)`
  position: relative;
  width: fit-content;
  text-decoration: none;
  font-size: 30px;
  color: rgb(239, 242, 245);
  :after {
    position: absolute;
    bottom: -5px;
    left: 50%;
    content: "";
    width: 0;
    height: 2px;
    background: rgba(255, 255, 255, 0.7);
    transition: all 0.5s ease 0s;
  }
  :hover:after {
    left: 0;
    width: 100%;
  }
`

const LogoutButton = styled.button`
  background: transparent;
  border: none;
  position: relative;
  width: fit-content;
  font-size: 30px;
  color: rgb(239, 242, 245);
  :after {
    position: absolute;
    bottom: -5px;
    left: 50%;
    content: "";
    width: 0;
    height: 2px;
    background: rgba(255, 255, 255, 0.7);
    transition: all 0.5s ease 0s;
  }
  :hover:after {
    left: 0;
    width: 100%;
  }
`

function Menu({ showMenu, setShowMenu }) {
  const { currentUser } = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const handleCloseMenu = (e) => {
    setShowMenu(false)
  }
  const handleLogout = () => {
    setShowMenu(false)
    dispatch(logout())
  }

  return (
    <MenuContainer $showMenu={showMenu}>
      <MenuOption>
        <ToolbarLink to='/home' onClick={handleCloseMenu}>
          Home
        </ToolbarLink>
      </MenuOption>
      {currentUser && (
        <MenuOption>
          <ToolbarLink to='/me' onClick={handleCloseMenu}>
            About me
          </ToolbarLink>
        </MenuOption>
      )}
      <MenuOption>
        <ToolbarLink to='/articles' onClick={handleCloseMenu}>
          Articles
        </ToolbarLink>
      </MenuOption>
      {currentUser && (
        <MenuOption>
          <ToolbarLink to='/write' onClick={handleCloseMenu}>
            Post
          </ToolbarLink>
        </MenuOption>
      )}
      {currentUser && (
        <MenuOption>
          <LogoutButton 
            onClick={handleLogout}
          >
            Logout
          </LogoutButton>
        </MenuOption>
      )}
      {!currentUser && (
        <MenuOption>
          <ToolbarLink to='/' onClick={handleCloseMenu}>
            Login
          </ToolbarLink>
        </MenuOption>
      )} 
    </MenuContainer>
  )
}

Menu.propTypes = {
  showMenu: PropTypes.bool.isRequired,
  setShowMenu: PropTypes.func.isRequired
}

export default Menu

