import { useState } from 'react'
import styled from 'styled-components'
import {
  X,
  Download,
  Share2,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ExternalLink,
  File,
  FileText,
  Film,
  Music,
  Image as ImageIcon
} from 'lucide-react'
import type { FileItem } from '../../types'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  z-index: 1000;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.5);
`

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const FileIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`

const FileName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: white;
`

const FileMeta = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
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
  color: white;
  transition: all 200ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

const CloseButton = styled(IconButton)`
  margin-left: 16px;
  background: rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`

const PreviewContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: auto;
`

const ImagePreview = styled.img<{ zoom: number; rotation: number }>`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transform: scale(${props => props.zoom}) rotate(${props => props.rotation}deg);
  transition: transform 200ms ease;
  border-radius: 8px;
`

const VideoPreview = styled.video`
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
`

const AudioPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 48px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
`

const AudioIcon = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 24px;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`

const AudioPlayer = styled.audio`
  width: 300px;
`

const TextPreview = styled.pre`
  max-width: 800px;
  max-height: 100%;
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  color: white;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
`

const PDFPreview = styled.iframe`
  width: 100%;
  max-width: 900px;
  height: 100%;
  border: none;
  border-radius: 8px;
`

const UnsupportedPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px;
  text-align: center;
`

const UnsupportedIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
`

const UnsupportedTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: white;
`

const UnsupportedDescription = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  max-width: 300px;
`

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--primary);
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: background 200ms ease;

  &:hover {
    background: var(--primary-hover);
  }
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.5);
`

interface FilePreviewProps {
  file: FileItem
  onClose: () => void
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function FilePreview({ file, onClose }: FilePreviewProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const isImage = file.contentType.startsWith('image/')
  const isVideo = file.contentType.startsWith('video/')
  const isAudio = file.contentType.startsWith('audio/')
  const isPDF = file.contentType === 'application/pdf'
  const isText = file.contentType.startsWith('text/') ||
    file.contentType.includes('json') ||
    file.contentType.includes('javascript') ||
    file.contentType.includes('xml')

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)

  const renderPreview = () => {
    if (isImage) {
      return (
        <ImagePreview
          src={file.url || `https://picsum.photos/800/600?random=${file.key}`}
          alt={file.name}
          zoom={zoom}
          rotation={rotation}
        />
      )
    }

    if (isVideo) {
      return (
        <VideoPreview controls>
          <source src={file.url} type={file.contentType} />
          브라우저가 비디오를 지원하지 않습니다.
        </VideoPreview>
      )
    }

    if (isAudio) {
      return (
        <AudioPreview>
          <AudioIcon>
            <Music size={48} />
          </AudioIcon>
          <FileName>{file.name}</FileName>
          <AudioPlayer controls>
            <source src={file.url} type={file.contentType} />
            브라우저가 오디오를 지원하지 않습니다.
          </AudioPlayer>
        </AudioPreview>
      )
    }

    if (isPDF) {
      return (
        <PDFPreview
          src={file.url}
          title={file.name}
        />
      )
    }

    if (isText) {
      return (
        <TextPreview>
          {`// ${file.name}\n// 파일 내용 미리보기\n\n이 파일의 내용이 여기에 표시됩니다.`}
        </TextPreview>
      )
    }

    return (
      <UnsupportedPreview>
        <UnsupportedIcon>
          <File size={40} />
        </UnsupportedIcon>
        <UnsupportedTitle>미리보기를 지원하지 않는 파일입니다</UnsupportedTitle>
        <UnsupportedDescription>
          이 파일 형식({file.contentType})은 브라우저에서 미리보기가 지원되지 않습니다.
          파일을 다운로드하여 확인하세요.
        </UnsupportedDescription>
        <DownloadButton>
          <Download size={18} />
          다운로드
        </DownloadButton>
      </UnsupportedPreview>
    )
  }

  const getFileIcon = () => {
    if (isImage) return <ImageIcon size={20} />
    if (isVideo) return <Film size={20} />
    if (isAudio) return <Music size={20} />
    if (isText || isPDF) return <FileText size={20} />
    return <File size={20} />
  }

  return (
    <Overlay onClick={onClose}>
      <Header onClick={e => e.stopPropagation()}>
        <FileInfo>
          <FileIcon>
            {getFileIcon()}
          </FileIcon>
          <div>
            <FileName>{file.name}</FileName>
            <FileMeta>{formatFileSize(file.size)} • {file.contentType}</FileMeta>
          </div>
        </FileInfo>

        <HeaderActions>
          <IconButton title="다운로드">
            <Download size={20} />
          </IconButton>
          <IconButton title="공유">
            <Share2 size={20} />
          </IconButton>
          <IconButton title="새 탭에서 열기">
            <ExternalLink size={20} />
          </IconButton>
          <IconButton title="삭제">
            <Trash2 size={20} />
          </IconButton>
          <CloseButton onClick={onClose} title="닫기">
            <X size={20} />
          </CloseButton>
        </HeaderActions>
      </Header>

      <PreviewContainer onClick={e => e.stopPropagation()}>
        {renderPreview()}
      </PreviewContainer>

      {isImage && (
        <Toolbar onClick={e => e.stopPropagation()}>
          <IconButton onClick={handleZoomOut} title="축소">
            <ZoomOut size={20} />
          </IconButton>
          <span style={{ color: 'white', fontSize: 14, minWidth: 60, textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>
          <IconButton onClick={handleZoomIn} title="확대">
            <ZoomIn size={20} />
          </IconButton>
          <IconButton onClick={handleRotate} title="회전">
            <RotateCw size={20} />
          </IconButton>
        </Toolbar>
      )}
    </Overlay>
  )
}

export default FilePreview
