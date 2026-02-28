import { Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import FileExplorer from './pages/FileExplorer'

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`

const MainWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: var(--sidebar-width);
`

const MainContent = styled.main`
  flex: 1;
  padding: 24px;
  margin-top: var(--header-height);
  overflow-y: auto;
`

function App() {
  return (
    <AppContainer>
      <Sidebar />
      <MainWrapper>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/files/*" element={<FileExplorer />} />
          </Routes>
        </MainContent>
      </MainWrapper>
    </AppContainer>
  )
}

export default App
