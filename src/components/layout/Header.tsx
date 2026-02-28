import styled from 'styled-components'
import { Search, Bell, Settings } from 'lucide-react'

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: var(--sidebar-width);
  right: 0;
  height: var(--header-height);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 100;
`

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: var(--background);
  border-radius: 8px;
  padding: 8px 16px;
  width: 400px;
  border: 1px solid var(--border);
  transition: border-color 200ms ease, box-shadow 200ms ease;

  &:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
  }
`

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 14px;
  margin-left: 8px;
  color: var(--text-primary);

  &::placeholder {
    color: var(--text-muted);
  }
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 200ms ease;

  &:hover {
    background: var(--background);
    color: var(--text-primary);
  }
`

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 200ms ease;

  &:hover {
    background: var(--background);
  }
`

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
`

const UserName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
`

function Header() {
  return (
    <HeaderContainer>
      <SearchContainer>
        <Search size={18} color="var(--text-muted)" />
        <SearchInput placeholder="파일 또는 폴더 검색..." />
      </SearchContainer>

      <HeaderActions>
        <IconButton>
          <Bell size={20} />
        </IconButton>
        <IconButton>
          <Settings size={20} />
        </IconButton>
        <UserButton>
          <Avatar>M</Avatar>
          <UserName>관리자</UserName>
        </UserButton>
      </HeaderActions>
    </HeaderContainer>
  )
}

export default Header
