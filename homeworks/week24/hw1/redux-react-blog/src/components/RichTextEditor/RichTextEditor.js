import styled from '@emotion/styled'
import 'draft-js/dist/Draft.css'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Loading from '../../components/Loading'
import useRichTextEditor from '../../hooks/useRichTextEditor'
import { MEDIA_QUERY_SM } from '../../constants/breakpoints'

import { selectCurrentUser } from '../../redux/usersSlice'
import { 
  getSingleArticleIfNeeded,
  saveArticle, 
  didInvalidate, 
  selectSingleArticle,
} from '../../redux/articlesSlice'

const AddArticleForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  div.DraftEditor-root {
    margin-bottom: 20px;
    padding: 15px 10px;
    width: 100%;
    height: 500px;

    ${MEDIA_QUERY_SM} {
      height: 400px;
    }
  }
  div.DraftEditor-editorContainer {
    height: 100%;
  }
  div.public-DraftEditor-content {
    height: 100%;
  }
`

const PageTitle = styled.div`
  margin-bottom: 20px;
  text-align: center;
  font-size: 24px;
  color: ${({ theme }) => theme.text.primary};

  ${MEDIA_QUERY_SM} {
    margin-bottom: 15px;
    font-size: 20px;
  }
`

const TitleInput = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  width: 100%;
  border: 1px solid transparent;
  border-radius: 3px;
  color: ${({ theme }) => theme.text.primary};
  background-color: ${({ theme }) => theme.background.primary};
  box-shadow: ${({ theme }) => theme.boxShadow.primary};
  transition: 0.3s;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
  }
`

const RichTextEditorContainer = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  width: 100%;
  border: 1px solid transparent;
  border-radius: 3px;
  color: ${({ theme }) => theme.text.primary};
  background-color: ${({ theme }) => theme.background.primary};
  box-shadow: ${({ theme }) => theme.boxShadow.primary};
  transition: 0.3s;
`

const RichTextEditorDiv = styled.div`
  overflow-y: scroll;
  border-radius: 5px;
  border: 3px solid #e7cbd9;
`

const ToolbarButtons = styled.div`
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-self: flex-start;
  background-color: ${({ theme }) => theme.background.toolbar};
`

const ButtonSave = styled.button`
  padding: 10px 40px;
  background-color: ${({ theme }) => theme.button.submit};
  color: ${({ theme }) => theme.text.negative};
  border: transparent;
  border-radius: 3px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    opacity: 0.9;
  }
`
const ErrorMessage = styled.div`
  width: fit-content;
  color: ${({ theme }) => theme.error};
  margin-bottom: 5px;
`

function RichTextEditor() {
  const [errorMessage, setErrorMessage] = useState('')
  const { currentUser } = useSelector(selectCurrentUser)
  const { loading, article } = useSelector(selectSingleArticle)
  const [ articleTitle, setArticleTitle ] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  let isEditingPage = true
  if (location.pathname === '/write') {
    isEditingPage = false
  }

  const [
    Editor, 
    EditorState,
    convertToRaw,
    convertFromRaw,
    editorState, 
    setEditorState, 
    renderInlineStyleButton, 
    renderBlockTypeButton, 
    handleKeyCommand, 
    createState,
    inlineStyles,
    blockTypes
  ] = useRichTextEditor()




  const handleChange = (e) => {
    setArticleTitle(e.target.value)
  }

  const handleSave = useCallback(
    async () => {
      const content = editorState.getCurrentContent()
      if (!articleTitle || !content.getPlainText()) {
        setErrorMessage('標題及內容不可空白')
        return
      }
      const contentToSave = JSON.stringify(convertToRaw(content))
      const plainContent = content.getPlainText('\u0001')
      try {
        await dispatch(saveArticle({id, articleTitle, contentToSave, plainContent, isEditingPage})).unwrap()
        dispatch(didInvalidate())
        navigate(isEditingPage ? `/article/${id}` : '/articles')
        return
      } catch (err) {
        setErrorMessage(err.message)
      }
    }, [convertToRaw, editorState, id, navigate, articleTitle, dispatch, isEditingPage]
  )

  const handleFocus = () => {
    setErrorMessage('')
  }

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        dispatch(getSingleArticleIfNeeded(Number(id)))
        if (currentUser !== article.authorUid) {
          navigate(`/article/${id}`)
          return
        }
      } catch (err) {
        setErrorMessage('載入文章內容失敗')
      }
    }
    // 如果不是本人就返回
    if (loading) return
    if (!currentUser) {
      navigate('/home')
      return
    }
    // 為了防止直接在 write/edit 之間切換，只要 location 有變就要先清空
    setErrorMessage('')
    setArticleTitle('')
    setEditorState(EditorState.createEmpty())
    if (isEditingPage) {
      console.log('Hi!')
      fetchArticle()
      setArticleTitle(article.title)
      setEditorState(createState(convertFromRaw(JSON.parse(article.content))))
    }
  }, 
  [
    currentUser, 
    loading, 
    location, 
    isEditingPage, 
    EditorState, 
    convertToRaw, 
    convertFromRaw, 
    createState, 
    id, 
    navigate, 
    setEditorState,
    article,
    dispatch
  ])

  return (
    <AddArticleForm>
      {loading && <Loading />}
      <PageTitle>{isEditingPage ? '編輯' : '撰寫'}</PageTitle>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <TitleInput 
        value={articleTitle} 
        onChange={handleChange} 
        onFocus={handleFocus}
      />
      <RichTextEditorContainer>
        <RichTextEditorDiv>
          <ToolbarButtons>
            {inlineStyles.map((style, index) => {
              return renderInlineStyleButton(style, index)
            })}
            {blockTypes.map((type, index) => {
              return renderBlockTypeButton(type, index)
            })}
          </ToolbarButtons>
          <Editor
            editorState={editorState}
            handleKeyCommand={handleKeyCommand} 
            onChange={setEditorState}
            onFocus={handleFocus}
          />
        </RichTextEditorDiv>
      </RichTextEditorContainer>
      <ButtonSave 
        onClick={(e) => {
          e.preventDefault()
          handleSave()
        }}
      >
        Submit
      </ButtonSave>
    </AddArticleForm>
  )
}

export default RichTextEditor