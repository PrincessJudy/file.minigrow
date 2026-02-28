import styled from 'styled-components'
import {
  FolderOpen,
  FileText,
  HardDrive,
  Upload,
  Download,
  TrendingUp,
  Shield
} from 'lucide-react'

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`

const PageHeader = styled.div`
  margin-bottom: 32px;
`

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
`

const PageSubtitle = styled.p`
  font-size: 15px;
  color: var(--text-secondary);
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
`

const StatCard = styled.div`
  background: var(--surface);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid var(--border);
  transition: all 200ms ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const StatIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
`

const StatTrend = styled.div<{ positive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.positive ? 'var(--success)' : 'var(--danger)'};
`

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
`

const StatLabel = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
`

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
`

const Section = styled.section`
  background: var(--surface);
  border-radius: 16px;
  border: 1px solid var(--border);
  overflow: hidden;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
`

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
`

const SectionContent = styled.div`
  padding: 16px 24px;
`

const BucketInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`

const InfoItem = styled.div`
  padding: 16px;
  background: var(--background);
  border-radius: 12px;
`

const InfoLabel = styled.div`
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const InfoValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  word-break: break-all;
`

const QuickActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`

const QuickAction = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--background);
  border-radius: 12px;
  transition: all 200ms ease;

  &:hover {
    background: var(--primary-light);
    color: var(--primary);

    svg {
      color: var(--primary);
    }
  }
`

const QuickActionIcon = styled.div`
  margin-bottom: 8px;
  color: var(--text-secondary);
`

const QuickActionLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
`

function Dashboard() {
  const bucketInfo = {
    name: 'file.minigrow.kr',
    region: 'kr-standard',
    storageClass: 'STANDARD',
    accessPolicy: '전체 공개',
    objectCount: 0,
    totalSize: '0 B',
    lastModified: '2026-02-28 03:36:13',
    storagePolicy: 'default-placement'
  }

  return (
    <DashboardContainer>
      <PageHeader>
        <PageTitle>대시보드</PageTitle>
        <PageSubtitle>버킷 상태와 파일 현황을 한눈에 확인하세요</PageSubtitle>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatIcon color="#3b82f6">
              <FolderOpen size={24} />
            </StatIcon>
            <StatTrend positive>
              <TrendingUp size={14} />
              +12%
            </StatTrend>
          </StatHeader>
          <StatValue>0</StatValue>
          <StatLabel>총 파일 수</StatLabel>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatIcon color="#8b5cf6">
              <HardDrive size={24} />
            </StatIcon>
          </StatHeader>
          <StatValue>0 B</StatValue>
          <StatLabel>사용 중인 용량</StatLabel>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatIcon color="#22c55e">
              <Upload size={24} />
            </StatIcon>
          </StatHeader>
          <StatValue>0</StatValue>
          <StatLabel>오늘 업로드</StatLabel>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatIcon color="#f59e0b">
              <Download size={24} />
            </StatIcon>
          </StatHeader>
          <StatValue>0</StatValue>
          <StatLabel>오늘 다운로드</StatLabel>
        </StatCard>
      </StatsGrid>

      <SectionGrid>
        <Section>
          <SectionHeader>
            <SectionTitle>버킷 정보</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <BucketInfoGrid>
              <InfoItem>
                <InfoLabel>버킷 이름</InfoLabel>
                <InfoValue>{bucketInfo.name}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>리전</InfoLabel>
                <InfoValue>{bucketInfo.region}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>스토리지 클래스</InfoLabel>
                <InfoValue>{bucketInfo.storageClass}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>접근 정책</InfoLabel>
                <InfoValue>{bucketInfo.accessPolicy}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>스토리지 정책</InfoLabel>
                <InfoValue>{bucketInfo.storagePolicy}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>마지막 수정</InfoLabel>
                <InfoValue>{bucketInfo.lastModified}</InfoValue>
              </InfoItem>
            </BucketInfoGrid>
          </SectionContent>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>빠른 작업</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <QuickActionGrid>
              <QuickAction>
                <QuickActionIcon>
                  <Upload size={24} />
                </QuickActionIcon>
                <QuickActionLabel>파일 업로드</QuickActionLabel>
              </QuickAction>
              <QuickAction>
                <QuickActionIcon>
                  <FolderOpen size={24} />
                </QuickActionIcon>
                <QuickActionLabel>새 폴더</QuickActionLabel>
              </QuickAction>
              <QuickAction>
                <QuickActionIcon>
                  <FileText size={24} />
                </QuickActionIcon>
                <QuickActionLabel>파일 탐색</QuickActionLabel>
              </QuickAction>
              <QuickAction>
                <QuickActionIcon>
                  <Shield size={24} />
                </QuickActionIcon>
                <QuickActionLabel>권한 설정</QuickActionLabel>
              </QuickAction>
            </QuickActionGrid>
          </SectionContent>
        </Section>
      </SectionGrid>
    </DashboardContainer>
  )
}

export default Dashboard
