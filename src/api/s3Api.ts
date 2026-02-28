import axios from 'axios'
import type { BucketInfo, FileItem } from '../types'

const API_BASE = '/api/s3'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000
})

// Get bucket info
export const getBucketInfo = async (): Promise<BucketInfo> => {
  const response = await api.get('/bucket')
  return response.data
}

// List objects in bucket
export const listObjects = async (prefix: string = ''): Promise<{
  prefix: string
  folders: FileItem[]
  files: FileItem[]
  isTruncated: boolean
  nextToken?: string
}> => {
  const response = await api.get('/objects', {
    params: { prefix }
  })
  return response.data
}

// Upload single file
export const uploadFile = async (
  file: File,
  path: string = '',
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; key: string; location: string; size: number }> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('path', path)

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(progress)
      }
    }
  })

  return response.data
}

// Upload multiple files
export const uploadFiles = async (
  files: File[],
  path: string = '',
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; files: Array<{ key: string; location: string; size: number }> }> => {
  const formData = new FormData()
  files.forEach(file => formData.append('files', file))
  formData.append('path', path)

  const response = await api.post('/upload-multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(progress)
      }
    }
  })

  return response.data
}

// Get download URL
export const getDownloadUrl = async (key: string): Promise<string> => {
  const response = await api.get(`/download/${encodeURIComponent(key)}`)
  return response.data.url
}

// Download file (stream)
export const downloadFile = async (key: string): Promise<Blob> => {
  const response = await api.get(`/stream/${encodeURIComponent(key)}`, {
    responseType: 'blob'
  })
  return response.data
}

// Delete file
export const deleteObject = async (key: string): Promise<{ success: boolean; deleted: string }> => {
  const response = await api.delete(`/objects/${encodeURIComponent(key)}`)
  return response.data
}

// Create folder
export const createFolder = async (path: string): Promise<{ success: boolean; folder: string }> => {
  const response = await api.post('/folder', { path })
  return response.data
}

// Copy file
export const copyObject = async (
  source: string,
  destination: string
): Promise<{ success: boolean; source: string; destination: string }> => {
  const response = await api.post('/copy', { source, destination })
  return response.data
}

export default api
