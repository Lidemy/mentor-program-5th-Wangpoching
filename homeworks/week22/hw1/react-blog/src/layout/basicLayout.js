import styled from '@emotion/styled'
import { MEDIA_QUERY_SM } from '../constants/breakpoints'

export const Wrapper = styled.div`
  margin: 0px auto;
  min-height: calc(100vh - 230px); /*減去 footer + header */

  ${MEDIA_QUERY_SM} {
    min-height: calc(100vh - 340px); /*SM 時 footer 的長度比原本多 10px, header 多 100px*/
  }  
`

export const Container = styled.div`
  margin: 0 auto;
  padding: 30px;
  max-width: 960px;
  ${MEDIA_QUERY_SM} {
    padding: 20px 30px;
  }
`

export const EmptyDataTitle = styled.p`
  font-size: 22px;
  color: #CCC;
  text-align: center;
`