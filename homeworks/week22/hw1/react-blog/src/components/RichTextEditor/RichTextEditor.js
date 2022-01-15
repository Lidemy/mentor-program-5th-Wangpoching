import styled from '@emotion/styled'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context'
import { useState, useEffect, useContext, useCallback } from 'react'
import Loading from '../../components/Loading'
import { auth } from '../../firebase'
import { getIdToken } from '../../utils'
import { saveArticle, getArticle } from '../../WebAPI'
import useRichTextEditor from '../../hooks/useRichTextEditor'
import { MEDIA_QUERY_SM } from '../../constants/breakpoints'
import 'draft-js/dist/Draft.css'

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
  const [article, setArticle] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { user, loading } = useContext(AuthContext)
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
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
    setArticle((article) => {
      return {
        ...article,
        title: e.target.value
      }
    })
  }

  const handleSave = useCallback(
    async (isEdit) => {
      const IdToken = await getIdToken(auth)
      const { title } = article
      const content = editorState.getCurrentContent()
      if (!title || !content.getPlainText()) {
        setErrorMessage('標題及內容不可空白')
        return
      }
      setIsLoading(true)
      const contentToSave = JSON.stringify(convertToRaw(content))
      const plainContent = content.getPlainText('\u0001')
      try {
        const res = await saveArticle(IdToken, id, title, contentToSave, plainContent, isEdit)
        if (!res.ok) {
          setErrorMessage(`${isEdit ? '編輯文章' : '新增文章'}失敗`)
          setIsLoading(false)
          return
        }
        return navigate(isEdit ? `/article/${id}` : '/articles')
      } catch (err) {
        setErrorMessage(`${isEdit ? '編輯文章' : '新增文章'}失敗`)
        setIsLoading(false)
      }
    }, [article, convertToRaw, editorState, id, navigate]
  )

  const handleFocus = () => {
    setErrorMessage('')
  }

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await getArticle(id)
        if (!response.ok) {
          setErrorMessage('載入文章內容失敗')
          setIsLoading(false)
          return
        }
        const body = await response.json()
        if (user.uid !== body.data.authorUid) navigate(`/article/${id}`)
        setArticle(body.data)
        setEditorState(createState(convertFromRaw(JSON.parse(body.data.content))))
        setIsLoading(false)    
      } catch (err) {
        setErrorMessage('載入文章內容GG')
        setIsLoading(false)
      }
    }
    // 如果不是本人就返回
    if (loading) return
    if (!user) navigate('/')

    // 為了防止直接在 write/edit 之間切換，只要 location 有變就要先清空
    setErrorMessage('')
    setArticle('')
    setEditorState(EditorState.createEmpty())

    if (isEditingPage) {
      setIsLoading(true)
      fetchArticle()
    }
  }, 
  [
    user, 
    loading, 
    location, 
    isEditingPage, 
    EditorState, 
    convertToRaw, 
    convertFromRaw, 
    createState, 
    id, 
    navigate, 
    setEditorState
  ])

  return (
    <AddArticleForm>
      {isLoading && <Loading />}
      <PageTitle>{isEditingPage ? '編輯' : '撰寫'}</PageTitle>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <TitleInput 
        value={article && article.title} 
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
          handleSave(isEditingPage)
        }}
      >
        Submit
      </ButtonSave>
    </AddArticleForm>
  )
}

export default RichTextEditor