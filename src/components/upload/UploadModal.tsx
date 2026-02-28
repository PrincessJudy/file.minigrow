import { useState, useCallback } from 'react'
import styled from 'styled-components'
import {
  X,
  Upload,
  File,
  CheckCircle,
  AlertCircle,
  Trash2,
  CloudUpload
} from 'lucide-react'
import type { UploadProgress } from '../../types'

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 200ms ease;
`

const Modal = styled.div<{ isOpen: boolean }>`
  background: var(--surface);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transform: ${props => props.isOpen ? 'scale(1)' : 'scale(0.95)'};
  transition: transform 200ms ease;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
`

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
`

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
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

const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
`

const DropZone = styled.div<{ isDragOver: boolean }>`
  border: 2px dashed ${props => props.isDragOver ? 'var(--primary)' : 'var(--border)'};
  border-radius: 16px;
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 200ms ease;
  background: ${props => props.isDragOver ? 'var(--primary-light)' : 'var(--background)'};

  &:hover {
    border-color: var(--primary);
    background: var(--primary-light);
  }
`

const DropZoneIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: var(--primary);
`

const DropZoneTitle = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
`

const DropZoneDescription = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
`

const BrowseButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--primary);
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 200ms ease;

  &:hover {
    background: var(--primary-hover);
  }
`

const HiddenInput = styled.input`
  display: none;
`

const FileList = styled.div`
  margin-top: 24px;
`

const FileListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`

const FileListTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
`

const ClearAllButton = styled.button`
  font-size: 13px;
  color: var(--danger);
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--background);
  border-radius: 10px;
  margin-bottom: 8px;
`

const FileIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
`

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const FileName = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const FileSize = styled.span`
  font-size: 12px;
  color: var(--text-muted);
`

const ProgressBar = styled.div`
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
`

const Progress = styled.div<{ percent: number; status: string }>`
  height: 100%;
  width: ${props => props.percent}%;
  background: ${props =>
    props.status === 'error' ? 'var(--danger)' :
    props.status === 'completed' ? 'var(--success)' :
    'var(--primary)'
  };
  transition: width 200ms ease;
`

const FileStatus = styled.div<{ status: string }>`
  color: ${props =>
    props.status === 'error' ? 'var(--danger)' :
    props.status === 'completed' ? 'var(--success)' :
    'var(--text-muted)'
  };
`

const RemoveButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: all 200ms ease;

  &:hover {
    background: var(--surface);
    color: var(--danger);
  }
`

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
`

const Button = styled.button<{ primary?: boolean }>`
  padding: 10px 20px;
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

    &:disabled {
      background: var(--border);
      color: var(--text-muted);
      cursor: not-allowed;
    }
  ` : `
    background: var(--background);
    color: var(--text-primary);

    &:hover {
      background: var(--border);
    }
  `}
`

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploads, setUploads] = useState<UploadProgress[]>([])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    addFiles(files)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      addFiles(files)
    }
  }, [])

  const addFiles = (files: File[]) => {
    const newUploads: UploadProgress[] = files.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const
    }))
    setUploads(prev => [...prev, ...newUploads])
  }

  const removeFile = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index))
  }

  const clearAll = () => {
    setUploads([])
  }

  const handleUpload = async () => {
    // Simulate upload progress
    for (let i = 0; i < uploads.length; i++) {
      if (uploads[i].status !== 'pending') continue

      setUploads(prev => prev.map((upload, index) =>
        index === i ? { ...upload, status: 'uploading' as const } : upload
      ))

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setUploads(prev => prev.map((upload, index) =>
          index === i ? { ...upload, progress } : upload
        ))
      }

      setUploads(prev => prev.map((upload, index) =>
        index === i ? { ...upload, status: 'completed' as const } : upload
      ))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={18} />
      case 'error':
        return <AlertCircle size={18} />
      default:
        return null
    }
  }

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal isOpen={isOpen} onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>파일 업로드</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <DropZone
            isDragOver={isDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <DropZoneIcon>
              <CloudUpload size={28} />
            </DropZoneIcon>
            <DropZoneTitle>파일을 드래그하여 업로드</DropZoneTitle>
            <DropZoneDescription>
              또는 파일을 선택하세요
            </DropZoneDescription>
            <BrowseButton>
              <Upload size={18} />
              파일 선택
              <HiddenInput
                type="file"
                multiple
                onChange={handleFileSelect}
              />
            </BrowseButton>
          </DropZone>

          {uploads.length > 0 && (
            <FileList>
              <FileListHeader>
                <FileListTitle>업로드 목록 ({uploads.length}개)</FileListTitle>
                <ClearAllButton onClick={clearAll}>전체 삭제</ClearAllButton>
              </FileListHeader>

              {uploads.map((upload, index) => (
                <FileItem key={index}>
                  <FileIcon>
                    <File size={20} />
                  </FileIcon>
                  <FileInfo>
                    <FileName>{upload.file.name}</FileName>
                    <FileSize>{formatFileSize(upload.file.size)}</FileSize>
                    {upload.status === 'uploading' && (
                      <ProgressBar>
                        <Progress percent={upload.progress} status={upload.status} />
                      </ProgressBar>
                    )}
                  </FileInfo>
                  <FileStatus status={upload.status}>
                    {getStatusIcon(upload.status)}
                  </FileStatus>
                  {upload.status === 'pending' && (
                    <RemoveButton onClick={() => removeFile(index)}>
                      <Trash2 size={16} />
                    </RemoveButton>
                  )}
                </FileItem>
              ))}
            </FileList>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>취소</Button>
          <Button
            primary
            onClick={handleUpload}
            disabled={uploads.length === 0 || uploads.every(u => u.status !== 'pending')}
          >
            업로드 시작
          </Button>
        </ModalFooter>
      </Modal>
    </Overlay>
  )
}

export default UploadModal
