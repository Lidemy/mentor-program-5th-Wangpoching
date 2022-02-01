import styled from '@emotion/styled'
import Menu from '../Menu'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ReactComponent as Search } from '../../images/search_white.svg'
import { ReactComponent as Hamburger } from '../../images/hamburger_black.svg'
import { ReactComponent as LightModeIcon } from '../../images/light_mode_black.svg'
import { ReactComponent as DarkModeIcon } from '../../images/dark_mode_black.svg'
import { MEDIA_QUERY_SM } from '../../constants/breakpoints'
import { toggleTheme } from '../../redux/themesSlice'

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 50px;
  height: 100px;
  position: relative;

  ${MEDIA_QUERY_SM} {
    justify-content: space-evenly;
    flex-direction: column;
    height: 200px;
    padding: 0 30px;
  }
`

const Logo = styled(Link)`
  font-size: 32px;
  font-weight: 900;
  text-decoration: none;
  color: ${({ theme }) => theme.primary};
`

const ToolBar = styled.div`
  display: flex;
  align-items: center;
`

const SearchIcon = styled(Search)`
  fill: currentcolor;
`

const KeywordSearchForm = styled.form`
  display: flex;
`

const TextInput = styled.input`
  padding: 8px 10px 8px 20px;
  width: 90px;
  background-color: ${({ theme }) => theme.background.searchBox};
  color: ${({ theme }) => theme.text.searchBox};
  border: transparent;
  border-radius: 20px 0px 0px 20px;
  ::placeholder {
    color: ${({ theme }) => theme.text.searchBox};
    opacity: 1;
  }
`
const SeacrchButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0px 20px 0px 0px;
  background-color: ${({ theme }) => theme.background.searchBox};
  color: ${({ theme }) => theme.text.searchBox};
  border: transparent;
  border-radius: 0px 20px 20px 0px;
  cursor: pointer;
`

const DropDownButton = styled.div`
  position: relative;
  margin-left: 30px;
  width: 50px;
  height: 50px;
  background-color: ${({ theme }) => theme.button.menu};
  border-radius: 50%;
  box-shadow: rgb(0 81 195 / 10%) 0px 0px 30px;
  cursor: pointer;
  transition: all 0.3s ease 0s;

  ${MEDIA_QUERY_SM} {
    margin-left: 20px;
  }
`

const HamburgerIcon = styled(Hamburger)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const FreezeFrame = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 3;
  display: block;
`

const ThemeToggler = styled.div`
  position: relative;
  margin-left: 30px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 7px 13px;
  width: fit-content;
  list-style: none;
  color: rgb(239, 242, 245);
  border: 3px solid ${({ theme }) => theme.text.primary};
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease 0s;
  svg {
    fill: ${({ theme }) => theme.toggler.fill};
  }
`

const ToggleButton = styled.div`
  position: absolute;
  top: 0;
  right: ${({ theme }) => theme.toggler.right};
  background: ${({ theme }) => theme.text.primary};
  height: 90%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  z-index: 1;
  transform: translate${({ theme }) => theme.toggler.translate};
  transition: all 0.5s linear 0s;
`

function Header() {
  const [showMenu, setShowMenu] = useState(false)
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!keyword) return
    setKeyword('')
    navigate(`/search/${keyword}`)
  }
  const handleChange = (e) => {
    setKeyword(e.target.value)
  }
  const handleClick = () => {
    setShowMenu((pre) => !pre)
  }
  const handleChangeTheme = () => {
    dispatch(toggleTheme())
  }

  return (
    <HeaderContainer>
      <Logo to="/home">Forum</Logo>
      <ToolBar>
        <KeywordSearchForm
          onSubmit={handleSubmit}
        >
          <TextInput 
            type="text"
            value={keyword}
            placeholder={'Search'}
            onChange={handleChange}
          />
          <SeacrchButton>
            <SearchIcon/>
          </SeacrchButton>
        </KeywordSearchForm>
        <ThemeToggler  onClick={handleChangeTheme}>
          <ToggleButton />
          <LightModeIcon></LightModeIcon>
          <DarkModeIcon style={{marginLeft: '20px'}}></DarkModeIcon>
        </ThemeToggler>
        <DropDownButton>
          <HamburgerIcon onClick={handleClick}/>
        </DropDownButton>
      </ToolBar>
      <Menu 
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />
      {showMenu && <FreezeFrame onClick={handleClick}/>}
    </HeaderContainer>
  );
}

export default Header
