import styled from '@emotion/styled'
import Form from '../Form'

const PageContainer = styled.div`
  margin: 10% auto; 
`

export default function Page() {
  return (
    <PageContainer className={'page__wrapper'}>
      <Form />
    </PageContainer>
  )
}