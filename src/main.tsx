import React from 'react'
import ReactDOM from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import GlobalStyles from './styles/GlobalStyles'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <GlobalStyles />
        <App />
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
)
