export interface BucketInfo {
  name: string
  region: string
  objectCount: number
  totalSize: number
  storageClass: string
  accessPolicy: string
  createdAt: string
  lastModified: string
}

export interface FileItem {
  key: string
  name: string
  size: number
  lastModified: string
  contentType: string
  isFolder: boolean
  url?: string
}

export interface UploadProgress {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

export interface BreadcrumbItem {
  name: string
  path: string
}

export type ViewMode = 'list' | 'grid'

export type SortBy = 'name' | 'size' | 'date' | 'type'
export type SortOrder = 'asc' | 'desc'

export interface SortConfig {
  by: SortBy
  order: SortOrder
}
