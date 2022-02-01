import styled from '@emotion/styled'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector} from 'react-redux'

import Loading from '../../components/Loading'
import { Wrapper } from '../../layout/basicLayout'
import { scrollTop } from '../../utils'
import {
  MEDIA_QUERY_MD,
  MEDIA_QUERY_SM
} from '../../constants/breakpoints'

import { 
  getAboutMeIfNeeded,
  editAboutMe, 
  didInvalidate 
} from '../../redux/usersSlice'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  padding: 30px;
  max-width: 960px;

  ${MEDIA_QUERY_SM} {
    flex-direction: column;
  }
`

const Pillar = styled.div`
  background: ${({ theme }) => theme.background.header};
  min-width: 200px;
  margin-right: 50px;

  ${MEDIA_QUERY_SM} {
    margin-right: 0px;
  }
`

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 200px;
  background: ${({ theme }) => theme.background.searchBox};
  align-items: center;
  justify-content: center;
`

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${({ $background }) => `url(${$background})` } center center / cover no-repeat white;
`

const AvatarUsername = styled.p`
  color: ${({ theme }) => theme.text.searchBox};
  font-size: 20px;
  margin-top: 12px;
`

const LabelContainer = styled.div`
  padding: 20px 25px;
`

const Label = styled.div`
  text-align: center;
  color: white;
  background: ${({ theme }) => theme.button.label};
  font-size: 18px;
  padding: 10px;
  margin-top: 10px;
  border-radius: 10px;
`

const InformationContainer = styled.div`
  width: 100%;
  min-height: 500px;
  border: 1px solid ${({ theme }) => theme.text.primay};
  border-radius: 10px;
  padding: 20px;

  ${MEDIA_QUERY_SM} {
    margin-top: 20px;
  }
`

const InformationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  ${MEDIA_QUERY_MD} {
    align-items: center;
    flex-direction: column;
  }
`

const InformationTitle = styled.h3`
  font-size: 22px;
  color: ${({ theme }) => theme.button.modify};
  margin: 0px;
`

const Buttons = styled.div`
  button + button {
    margin-left: 20px;
  }

  ${MEDIA_QUERY_MD} {
    margin-top: 5px;
  }
`

const ButtonEditInformation = styled.button`
  background: ${({ theme }) => theme.button.modify};
  border: none;
  color: ${({ theme }) => theme.text.negative};
  font-size: 14px;
  height: fit-content;
  padding: 7px 14px;
  cursor: pointer;
`

const InformationBody = styled.div`
  color: ${({ theme }) => theme.text.primary};
  margin-top: 20px;
  padding: 10px;
  width: 100%;
  > div + div {
    margin-top: 20px;
  }
`

const InformationDetail = styled.div`
  font-size: 14px;
`

const DescriptionInput = styled.textarea`
  width: 100%;
  margin-top: 20px;
  padding: 5px;
  color: ${({ theme }) => theme.text.primary};
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.text.primary};
  background-color: transparent;
  overflow-y: scroll;
`

const InformationDetailTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
`

const InformationDetailContent = styled.div`
  font-size: 14px;
  padding: 10px 15px;
  border-bottom: 1px solid ${({ theme }) => theme.text.primary};
`

const ErrorMessage = styled.div`
  width: fit-content;
  color: ${({ theme }) => theme.error};
  margin-bottom: 5px;
`

function AboutMePage() {
  const [errorMessage, setErrorMessage] = useState('')
  const { currentUser, detail } = useSelector(state => state.user)
  const [isEdit, setIsEdit] = useState(false)
  const [descriptionInput, setDescriptionInput] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChangeMode = () => {
    setIsEdit((pre) => !pre)
  }
  const handleChange = (e) => {
    setDescriptionInput(e.target.value)
  }
  const handleFocus = () => {
    setErrorMessage('')
  }

  const updateAboutMe = useCallback(
    async () => {
      try {
        await dispatch(getAboutMeIfNeeded())
      } catch (error) {
        alert(error.message)
        navigate('/home')
      }
    }, [dispatch, navigate]
  )

  const handleSendInformation = useCallback(
    async () => {
      try {
        await dispatch(editAboutMe(descriptionInput)).unwrap()
        dispatch(didInvalidate())
        updateAboutMe()
      } catch (err) {
        setErrorMessage('更新個人資料失敗')
      }
      setIsEdit(false)
    }, [descriptionInput, dispatch, updateAboutMe]
  )

  useEffect(() => {
    setDescriptionInput(detail.description)
  }, [detail.description])

  useEffect(() => {
    scrollTop()
    if (!currentUser) {
      navigate('/')
      return
    }
    updateAboutMe()
  }, [currentUser, navigate, updateAboutMe])

  return (
    <Wrapper>
      <Container>
        {detail.loading && <Loading />}
        <Pillar>
          <AvatarContainer>
            <Avatar $background={detail.avatar}/>
            <AvatarUsername>{detail.name}</AvatarUsername>
          </AvatarContainer>
          <LabelContainer>
            <Label>個人資訊</Label>
          </LabelContainer>
        </Pillar>
        <InformationContainer>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <InformationHeader>
            <InformationTitle>個人資訊</InformationTitle>
            {isEdit ? 
              <Buttons> 
                <ButtonEditInformation 
                  onClick={handleSendInformation}
                >
                  送出編輯
                </ButtonEditInformation>
                <ButtonEditInformation 
                  onClick={handleChangeMode}
                >
                  取消編輯
                </ButtonEditInformation>
              </Buttons> :
              <Buttons> 
                <ButtonEditInformation 
                  onClick={handleChangeMode}
                >
                  編輯個人資訊
                </ButtonEditInformation>
              </Buttons>              
            }

          </InformationHeader>
          <InformationBody>
            <InformationDetail>
              <InformationDetailTitle>Name</InformationDetailTitle>
              <InformationDetailContent>{detail.name}</InformationDetailContent>
            </InformationDetail>
            <InformationDetail>
              <InformationDetailTitle>Email</InformationDetailTitle>
              <InformationDetailContent>{detail.email}</InformationDetailContent>
            </InformationDetail>
            <InformationDetail>
              <InformationDetailTitle>Description</InformationDetailTitle>
              {isEdit ? 
                <DescriptionInput
                  rows={6}
                  value={descriptionInput} 
                  onChange={handleChange}
                  onFocus={handleFocus}
                /> :
                <InformationDetailContent>{detail.description || '待新增'}</InformationDetailContent>
              }
            </InformationDetail>
          </InformationBody>
        </InformationContainer>
      </Container>
    </Wrapper>
  )
}

export default AboutMePage
