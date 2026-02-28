import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import {
  LayoutDashboard,
  FolderOpen,
  Upload,
  Settings,
  HardDrive,
  Cloud
} from 'lucide-react'

const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  z-index: 200;
`

const Logo = styled.div`
  height: var(--header-height);
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--border);
`

const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`

const LogoText = styled.div`
  margin-left: 12px;
`

const LogoTitle = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
`

const LogoSubtitle = styled.span`
  font-size: 11px;
  color: var(--text-muted);
`

const Navigation = styled.nav`
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
`

const NavSection = styled.div`
  margin-bottom: 24px;
`

const NavSectionTitle = styled.h3`
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 12px;
  margin-bottom: 8px;
`

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: all 200ms ease;

  &:hover {
    background: var(--background);
    color: var(--text-primary);
  }

  &.active {
    background: var(--primary-light);
    color: var(--primary);

    svg {
      color: var(--primary);
    }
  }
`

const StorageInfo = styled.div`
  padding: 16px;
  border-top: 1px solid var(--border);
`

const StorageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`

const StorageLabel = styled.span`
  font-size: 12px;
  color: var(--text-secondary);
`

const StorageValue = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
`

const StorageBar = styled.div`
  height: 6px;
  background: var(--background);
  border-radius: 3px;
  overflow: hidden;
`

const StorageProgress = styled.div<{ percent: number }>`
  height: 100%;
  width: ${props => props.percent}%;
  background: linear-gradient(90deg, var(--primary), #8b5cf6);
  border-radius: 3px;
  transition: width 300ms ease;
`

function Sidebar() {
  return (
    <SidebarContainer>
      <Logo>
        <LogoIcon>
          <Cloud size={20} />
        </LogoIcon>
        <LogoText>
          <LogoTitle>file.minigrow</LogoTitle>
          <LogoSubtitle>버킷 파일 관리</LogoSubtitle>
        </LogoText>
      </Logo>

      <Navigation>
        <NavSection>
          <NavSectionTitle>메뉴</NavSectionTitle>
          <NavItem to="/" end>
            <LayoutDashboard size={20} />
            대시보드
          </NavItem>
          <NavItem to="/files">
            <FolderOpen size={20} />
            파일 탐색기
          </NavItem>
          <NavItem to="/upload">
            <Upload size={20} />
            업로드
          </NavItem>
        </NavSection>

        <NavSection>
          <NavSectionTitle>설정</NavSectionTitle>
          <NavItem to="/storage">
            <HardDrive size={20} />
            스토리지 관리
          </NavItem>
          <NavItem to="/settings">
            <Settings size={20} />
            설정
          </NavItem>
        </NavSection>
      </Navigation>

      <StorageInfo>
        <StorageHeader>
          <StorageLabel>스토리지 사용량</StorageLabel>
          <StorageValue>0 B / 무제한</StorageValue>
        </StorageHeader>
        <StorageBar>
          <StorageProgress percent={0} />
        </StorageBar>
      </StorageInfo>
    </SidebarContainer>
  )
}

export default Sidebar
