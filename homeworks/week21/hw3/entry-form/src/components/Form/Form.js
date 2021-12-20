import styled from '@emotion/styled'
import { ThemeProvider } from '@emotion/react'
import useFormApi from '../../API/useFormApi'

const FormContainer = styled.div`
  padding: 0 0 40px 0;
  box-shadow: 1.8px 2.4px 5px 0 rgba(0, 0, 0, 0.3);
  background: white;
`

const Top = styled.div`
  max-width: 900px;
  margin: 0 auto;
  height: 8px;
  background: #fad312;
`

const Title = styled.h1`
  font-size: 48px;
  font-weight: bold;
  margin: 0 0 30px 0;
  @media(max-width: 768px) {
    font-size: 36px;    
  }
`

const FormInfo = styled.div`
  margin-top: 40px;
  div {
    font-size: 14px;
    line-height: 1.5em;
  }
`

const Remider = styled.div`
  font-size: 16px;
  color: #e74149;
  margin-top: 10px;
`

const InputContainer = styled.div`
  margin-top: 40px;
`

const TextLabel = styled.label`
  display: block;
  font-size: 20px;
  margin: 0 0 0 0;
  ::after {
    margin-left: 5px;
    color: #e74149;
    content: ${({ $required }) => $required ? '"*";' : '"";'};
  }
`

const RadioTitle = styled.h2`
  font-size: 20px;
  font-weight: normal;
  margin: 0 0 0 0;
  ::after {
    margin-left: 5px;
    color: #e74149;
    content: "*";
  }
`

const RadioLabel = styled.label`
  font-size: 14px;
  margin: 0 0 0 0;
`

const TextInput = styled.input`
  width: 300px;
  height: 25px;
  margin-top: 20px;
  font-size:　16px;
  border: solid 1px #d0d0d0;
  @media(max-width: 768px) {
    width: 150px;    
  }
`

const RadioInput = styled.input`
  margin-top: 20px;
  font-size:　16px;
  border: solid 1px #d0d0d0;
`

const LabelDesc = styled.div`
  margin-top: 5px;
  font-size: 14px;
`

const SubmitInput = styled.input`
  background: #fad312;
  padding: 10px 20px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`

const Alert = styled.p`
  margin: 20px 0 0 0;
  font-size: 14px;
`

export default function Form() {

  const [formContent, handleInputChange, handleSubmit] = useFormApi()

  return (
    <FormContainer className={'form__wrapper'}>
      <Top />
      <FormInfo className={'info__wrapper'}>
        <Title>新拖延運動報名表單</Title>
        <div>活動日期：2020/12/10 ~ 2020/12/11</div>
        <div>活動地點：台北市大安區新生南路二段1號</div>
        <Remider>*必填</Remider>
      </FormInfo>
      <InputContainer className={'username__wrapper'}>
        <TextLabel htmlFor="username" $required={true}>暱稱</TextLabel>
        <TextInput 
          id="username" 
          type="text" 
          placeholder="您的回答" 
          name="username"
          value={formContent.username}
          onChange={handleInputChange}
        />
      </InputContainer>

      <InputContainer className={'email__wrapper'}>
        <TextLabel htmlFor="email" $required={true}>電子郵件</TextLabel>
        <TextInput 
          id="email" 
          type="text" 
          placeholder="您的電子郵件" 
          name="email"
          value={formContent.email}
          onChange={handleInputChange}
        />
      </InputContainer>

      <InputContainer className={'phone-number__wrapper'}>
        <TextLabel htmlFor="phone-number" $required={true}>手機號碼</TextLabel>
        <TextInput 
          id="phone-number" 
          type="text" 
          placeholder="您的手機號碼" 
          name="phoneNumber"
          value={formContent.phoneNumber}
          onChange={handleInputChange}
        />
      </InputContainer>

      <InputContainer className={'select-type__wrapper'}>
        <RadioTitle>報名類型</RadioTitle>
        <div>
          <RadioInput
            id="type-one" 
            type="radio"
            name="typeOne"
            checked={formContent.type.typeOne}
            onChange={handleInputChange}
          />
          <RadioLabel htmlFor="type-one">躺在床上用想像力實作</RadioLabel>
        </div>
        <div>
          <RadioInput
            id="type-two" 
            type="radio"
            name="typeTwo"
            checked={formContent.type.typeTwo}
            onChange={handleInputChange}
          />
          <RadioLabel htmlFor="type-two">趴在地上滑手機找現成的</RadioLabel>
        </div>
      </InputContainer>

      <InputContainer className={'how-to-know__wrapper'}>
        <TextLabel htmlFor="how-to-know" $required={true}>你怎麼知道這個活動的</TextLabel>
        <TextInput 
          id="how-to-know" 
          type="text" 
          placeholder="您的回答" 
          name="howToKnow"
          value={formContent.howToKnow}
          onChange={handleInputChange}
        />
      </InputContainer>

      <InputContainer className={'other__wrapper'}>
        <TextLabel htmlFor="other" $required={false}>其他</TextLabel>
        <LabelDesc>對活動的一些建議</LabelDesc>
        <TextInput
          id="other" 
          type="text" 
          placeholder="您的回答" 
          name="other"
          value={formContent.other}
          onChange={handleInputChange}
        />
      </InputContainer>

      <InputContainer className={'submit__wrapper'}>
        <SubmitInput 
          type="submit"
          value="提交"
          onClick={handleSubmit}
        />
      </InputContainer>

      <div className="alert__wrapper">
        <Alert>請勿透過表單送出您的密碼</Alert>
      </div>
    </FormContainer>
  )
}