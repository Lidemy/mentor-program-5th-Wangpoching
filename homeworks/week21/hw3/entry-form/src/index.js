import ReactDOM from 'react-dom'
import './index.css'
import styled from '@emotion/styled'
import Page from './components/Page'

const Footer = styled.div`
  font-size: 13px;
  color: #999999;
  background: black;
  text-align: center;
  padding: 20px;
`
ReactDOM.render(
  <>
    <Page />
    <Footer>
      © 2020 © Copyright. All rights Reserved.
    </Footer>
  </>,
  document.getElementById('root')
);
