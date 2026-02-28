import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import {
  Upload,
  FolderPlus,
  Grid,
  List,
  ChevronRight,
  Home,
  Download,
  Trash2,
  Eye,
  Copy,
  File,
  Folder,
  Image,
  FileText,
  Film,
  Music,
  Archive
} from 'lucide-react'
import UploadModal from '../components/upload/UploadModal'
import FilePreview from '../components/files/FilePreview'
import type { FileItem, ViewMode } from '../types'

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const BreadcrumbItem = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: ${props => props.active ? 600 : 500};
  color: ${props => props.active ? 'var(--text-primary)' : 'var(--text-secondary)'};
  transition: all 200ms ease;

  &:hover {
    background: var(--background);
    color: var(--text-primary);
  }
`

const BreadcrumbSeparator = styled(ChevronRight)`
  color: var(--text-muted);
`

const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const ActionButton = styled.button<{ primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 200ms ease;

  ${props => props.primary ? `
    background: var(--primary);
    color: white;

    &:hover {
      background: var(--primary-hover);
    }
  ` : `
    background: var(--surface);
    color: var(--text-primary);
    border: 1px solid var(--border);

    &:hover {
      background: var(--background);
    }
  `}
`

const ViewToggle = styled.div`
  display: flex;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
`

const ViewButton = styled.button<{ active?: boolean }>`
  padding: 8px 12px;
  color: ${props => props.active ? 'var(--primary)' : 'var(--text-secondary)'};
  background: ${props => props.active ? 'var(--primary-light)' : 'transparent'};
  transition: all 200ms ease;

  &:hover {
    background: ${props => props.active ? 'var(--primary-light)' : 'var(--background)'};
  }
`

const FileListContainer = styled.div`
  background: var(--surface);
  border-radius: 16px;
  border: 1px solid var(--border);
  overflow: hidden;
`

const FileTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHeader = styled.thead`
  background: var(--background);
`

const TableHeaderCell = styled.th`
  padding: 14px 20px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border);
`

const TableBody = styled.tbody`
  tr {
    transition: background 150ms ease;

    &:hover {
      background: var(--background);
    }
  }
`

const TableCell = styled.td`
  padding: 14px 20px;
  font-size: 14px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border);
`

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const FileIcon = styled.div<{ color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.color || 'var(--background)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`

const FileName = styled.span`
  font-weight: 500;
`

const FileActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 200ms ease;

  tr:hover & {
    opacity: 1;
  }
`

const FileActionButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 200ms ease;

  &:hover {
    background: var(--surface);
    color: var(--primary);
  }
`

const EmptyState = styled.div`
  padding: 80px 20px;
  text-align: center;
`

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: var(--text-muted);
`

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
`

const EmptyDescription = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 24px;
`

const FileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  padding: 20px;
`

const GridItem = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    border-color: var(--primary);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }
`

const GridItemIcon = styled.div<{ color?: string }>`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: ${props => props.color || 'var(--background)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  color: white;
`

const GridItemName = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
`

const GridItemMeta = styled.span`
  font-size: 11px;
  color: var(--text-muted);
`

const getFileIcon = (contentType: string, isFolder: boolean) => {
  if (isFolder) return { icon: Folder, color: '#f59e0b' }
  if (contentType.startsWith('image/')) return { icon: Image, color: '#ec4899' }
  if (contentType.startsWith('video/')) return { icon: Film, color: '#8b5cf6' }
  if (contentType.startsWith('audio/')) return { icon: Music, color: '#06b6d4' }
  if (contentType.includes('zip') || contentType.includes('rar')) return { icon: Archive, color: '#f97316' }
  if (contentType.includes('text') || contentType.includes('document')) return { icon: FileText, color: '#3b82f6' }
  return { icon: File, color: '#64748b' }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Mock data for demonstration
const mockFiles: FileItem[] = [
  {
    key: 'images/',
    name: 'images',
    size: 0,
    lastModified: '2026-02-28T03:36:13Z',
    contentType: 'folder',
    isFolder: true
  },
  {
    key: 'documents/',
    name: 'documents',
    size: 0,
    lastModified: '2026-02-28T03:30:00Z',
    contentType: 'folder',
    isFolder: true
  },
  {
    key: 'sample.jpg',
    name: 'sample.jpg',
    size: 245000,
    lastModified: '2026-02-28T03:20:00Z',
    contentType: 'image/jpeg',
    isFolder: false,
    url: 'https://picsum.photos/800/600'
  },
  {
    key: 'document.pdf',
    name: 'document.pdf',
    size: 1250000,
    lastModified: '2026-02-28T02:15:00Z',
    contentType: 'application/pdf',
    isFolder: false
  },
  {
    key: 'video.mp4',
    name: 'video.mp4',
    size: 52400000,
    lastModified: '2026-02-27T18:00:00Z',
    contentType: 'video/mp4',
    isFolder: false
  }
]

function FileExplorer() {
  const location = useLocation()
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [files] = useState<FileItem[]>(mockFiles)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)

  const currentPath = location.pathname.replace('/files', '') || '/'
  const pathParts = currentPath.split('/').filter(Boolean)

  const handlePreview = (file: FileItem) => {
    if (!file.isFolder) {
      setPreviewFile(file)
    }
  }

  return (
    <Container>
      <Toolbar>
        <Breadcrumb>
          <BreadcrumbItem active={pathParts.length === 0}>
            <Home size={16} />
            홈
          </BreadcrumbItem>
          {pathParts.map((part, index) => (
            <>
              <BreadcrumbSeparator size={16} />
              <BreadcrumbItem
                key={part}
                active={index === pathParts.length - 1}
              >
                {part}
              </BreadcrumbItem>
            </>
          ))}
        </Breadcrumb>

        <ToolbarActions>
          <ViewToggle>
            <ViewButton
              active={viewMode === 'list'}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </ViewButton>
            <ViewButton
              active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={18} />
            </ViewButton>
          </ViewToggle>

          <ActionButton onClick={() => {}}>
            <FolderPlus size={18} />
            새 폴더
          </ActionButton>

          <ActionButton primary onClick={() => setIsUploadModalOpen(true)}>
            <Upload size={18} />
            업로드
          </ActionButton>
        </ToolbarActions>
      </Toolbar>

      <FileListContainer>
        {files.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <FolderPlus size={40} />
            </EmptyIcon>
            <EmptyTitle>폴더가 비어있습니다</EmptyTitle>
            <EmptyDescription>
              파일을 업로드하거나 새 폴더를 만들어보세요
            </EmptyDescription>
            <ActionButton primary onClick={() => setIsUploadModalOpen(true)}>
              <Upload size={18} />
              파일 업로드
            </ActionButton>
          </EmptyState>
        ) : viewMode === 'list' ? (
          <FileTable>
            <TableHeader>
              <tr>
                <TableHeaderCell>이름</TableHeaderCell>
                <TableHeaderCell>크기</TableHeaderCell>
                <TableHeaderCell>수정일</TableHeaderCell>
                <TableHeaderCell>형식</TableHeaderCell>
                <TableHeaderCell style={{ width: 100 }}></TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {files.map(file => {
                const { icon: Icon, color } = getFileIcon(file.contentType, file.isFolder)
                return (
                  <tr key={file.key} onDoubleClick={() => handlePreview(file)}>
                    <TableCell>
                      <FileInfo>
                        <FileIcon color={color}>
                          <Icon size={20} />
                        </FileIcon>
                        <FileName>{file.name}</FileName>
                      </FileInfo>
                    </TableCell>
                    <TableCell>
                      {file.isFolder ? '-' : formatFileSize(file.size)}
                    </TableCell>
                    <TableCell>{formatDate(file.lastModified)}</TableCell>
                    <TableCell>
                      {file.isFolder ? '폴더' : file.contentType}
                    </TableCell>
                    <TableCell>
                      <FileActions>
                        {!file.isFolder && (
                          <FileActionButton onClick={() => handlePreview(file)}>
                            <Eye size={16} />
                          </FileActionButton>
                        )}
                        <FileActionButton>
                          <Download size={16} />
                        </FileActionButton>
                        <FileActionButton>
                          <Copy size={16} />
                        </FileActionButton>
                        <FileActionButton>
                          <Trash2 size={16} />
                        </FileActionButton>
                      </FileActions>
                    </TableCell>
                  </tr>
                )
              })}
            </TableBody>
          </FileTable>
        ) : (
          <FileGrid>
            {files.map(file => {
              const { icon: Icon, color } = getFileIcon(file.contentType, file.isFolder)
              return (
                <GridItem key={file.key} onDoubleClick={() => handlePreview(file)}>
                  <GridItemIcon color={color}>
                    <Icon size={28} />
                  </GridItemIcon>
                  <GridItemName>{file.name}</GridItemName>
                  <GridItemMeta>
                    {file.isFolder ? '폴더' : formatFileSize(file.size)}
                  </GridItemMeta>
                </GridItem>
              )
            })}
          </FileGrid>
        )}
      </FileListContainer>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {previewFile && (
        <FilePreview
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </Container>
  )
}

export default FileExplorer
