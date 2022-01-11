import { useState, useCallback } from 'react'
import styled from '@emotion/styled'
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js'
import { ReactComponent as  NumberedListIcon } from '../images/list_numbered_black.svg'
import { ReactComponent as  BulletedListIcon } from '../images/list_bulleted_black.svg'

const ChangeInlineStyleButton = styled.div`
  text-align: center;
  line-height: 30px;
  height: 30px;
  width: 40px;
  font-weight: ${({ $style }) => $style === 'bold' ? $style : 'normal'};
  font-style: ${({ $style }) => $style === 'italic' ? $style : 'normal'};
  text-decoration: ${({ $style }) => $style === 'underline' ? $style : 'none'};
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  border: none;
  transition: 0.3s;
  background-color: ${({ theme, $selected }) => $selected ? theme.background.toolbarOff : 'transparent'};
`

const ChangeBlockTypeButton = styled.div`
  display: flex;
  text-align: center;
  line-height: 30px;
  height: 30px;
  width: 40px;
  font-size: 15px;
  color: ${({ theme }) => theme.text.primary};
  border: none;
  transition: 0.3s;
  background-color: ${({ theme, $selected }) => $selected ? theme.background.toolbarOff : 'transparent'};
  align-items: center;
  justify-content: center;
  SVG {
    fill: ${({ theme }) => theme.text.primary};
  }
`

const createState = (contentState) => {
  return EditorState.createWithContent(contentState)
}

// render 列表功能按鍵圖案
const renderListIcon = (type) => {
  if (type === 'ordered-list-item') {
    return (
      <BulletedListIcon />
    )
  }
  return (
    <NumberedListIcon />
  )  
}

export const useRichTextEditor = () => {

  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty()
  )

  const inlineStyles = [
    { type: 'BOLD', label: 'B', toolTip: 'Bold', css:'bold'},
    { type: 'ITALIC', label: 'I', toolTip: 'Italic', css:'italic'},
    { type: 'UNDERLINE', label: 'U', toolTip: 'Underline', css:'underline'}
  ]

  const blockTypes = [
    { type: 'ordered-list-item', label: renderListIcon, toolTip: 'Ordered List'},
    { type: 'unordered-list-item', label: renderListIcon, toolTip: 'Unordered List'},
    { type: 'header-one', label: 'H1', toolTip: 'H1'},
    { type: 'header-two', label: 'H2', toolTip: 'H2'},
    { type: 'header-three', label: 'H3', toolTip: 'H3'},
  ]

  // 支援鍵盤快捷鍵
  const handleKeyCommand = useCallback(
    (command, editorState) => {
      const newState = RichUtils.handleKeyCommand(editorState, command)

      if (newState) {
        setEditorState(newState)
        return 'handled'
      }
      return 'not handled'
    }, []
  )

  const renderInlineStyleButton = useCallback(
    (style, index) => {
      const {type, label, toolTip, css} = style
      const currentInlineStyle = editorState.getCurrentInlineStyle()
      let selected = false
      if (currentInlineStyle.has(style.type)) {
        selected = true
      }

      return (
        <ChangeInlineStyleButton
          key={index}
          title={toolTip}
          onMouseDown={(e) => {
            e.preventDefault()
            setEditorState(RichUtils.toggleInlineStyle(editorState, type))
          }}
          $selected={selected}
          $style={css}
        >
        {label}
        </ChangeInlineStyleButton>
      )
    }, [editorState]
  )

  const renderBlockTypeButton = useCallback(
    (style, index) => {
      const {type, label, toolTip } = style
      const currentBlockType = RichUtils.getCurrentBlockType(editorState)
      let selected = false
      if (currentBlockType === type) {
        selected = true
      }
      return (
        <ChangeBlockTypeButton
          key={index}
          title={toolTip}
          onMouseDown={(e) => {
            e.preventDefault()
            setEditorState(RichUtils.toggleBlockType(editorState, type))            
          }}
          $selected={selected}
        >
        {typeof label === 'string' ? label : label(type)}
        </ChangeBlockTypeButton>
      )
    }, [editorState]
  )

  return [
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
  ]
}

export default useRichTextEditor