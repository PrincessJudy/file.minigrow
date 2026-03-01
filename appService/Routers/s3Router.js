const express = require('express')
const router = express.Router()
const multer = require('multer')
const {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CopyObjectCommand
} = require('@aws-sdk/client-s3')
const { Upload } = require('@aws-sdk/lib-storage')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
})

// S3 Client Configuration (iwinv S3 Compatible)
const getS3Client = () => {
  return new S3Client({
    region: process.env.AWS_REGION || 'kr-standard',
    endpoint: process.env.AWS_ENDPOINT || 'https://kr.object.iwinv.kr',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    forcePathStyle: true // Required for S3-compatible services
  })
}

const BUCKET = process.env.AWS_BUCKET || 'file.minigrow.kr'

// Check S3 connection
const checkConnection = async () => {
  try {
    const s3 = getS3Client()
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET }))
    return true
  } catch (error) {
    console.error('S3 connection error:', error.message)
    return false
  }
}

// Get bucket info
router.get('/bucket', async (req, res) => {
  try {
    const s3 = getS3Client()

    // List objects to count and calculate size
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET,
      MaxKeys: 1000
    })

    const response = await s3.send(listCommand)

    const objectCount = response.KeyCount || 0
    const totalSize = (response.Contents || []).reduce((acc, obj) => acc + (obj.Size || 0), 0)

    res.json({
      name: BUCKET,
      region: process.env.AWS_REGION || 'kr-standard',
      endpoint: process.env.AWS_ENDPOINT || 'https://kr.object.iwinv.kr',
      objectCount,
      totalSize,
      storageClass: 'STANDARD',
      accessPolicy: '전체 공개'
    })
  } catch (error) {
    console.error('Get bucket info error:', error)
    res.status(500).json({ error: error.message })
  }
})

// List objects in bucket
router.get('/objects', async (req, res) => {
  try {
    const { prefix = '', delimiter = '/' } = req.query
    const s3 = getS3Client()

    const command = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
      Delimiter: delimiter,
      MaxKeys: 1000
    })

    const response = await s3.send(command)

    // Format folders (CommonPrefixes)
    const folders = (response.CommonPrefixes || []).map(cp => ({
      key: cp.Prefix,
      name: cp.Prefix.replace(prefix, '').replace(/\/$/, ''),
      size: 0,
      lastModified: null,
      contentType: 'folder',
      isFolder: true
    }))

    // Format files (Contents)
    const files = (response.Contents || [])
      .filter(obj => obj.Key !== prefix) // Exclude the prefix itself
      .map(obj => ({
        key: obj.Key,
        name: obj.Key.replace(prefix, ''),
        size: obj.Size,
        lastModified: obj.LastModified,
        contentType: getContentType(obj.Key),
        isFolder: false,
        url: `${process.env.AWS_ENDPOINT}/${BUCKET}/${obj.Key}`
      }))

    res.json({
      prefix,
      folders,
      files,
      isTruncated: response.IsTruncated,
      nextToken: response.NextContinuationToken
    })
  } catch (error) {
    console.error('List objects error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Upload file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    const { path: filePath = '' } = req.body
    const key = filePath ? `${filePath}/${req.file.originalname}` : req.file.originalname

    const s3 = getS3Client()

    // Use Upload for larger files with multipart support
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: BUCKET,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read'
      }
    })

    upload.on('httpUploadProgress', (progress) => {
      console.log(`Upload progress: ${progress.loaded}/${progress.total}`)
    })

    const result = await upload.done()

    res.json({
      success: true,
      key,
      location: result.Location || `${process.env.AWS_ENDPOINT}/${BUCKET}/${key}`,
      size: req.file.size
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Upload multiple files
router.post('/upload-multiple', upload.array('files', 100), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' })
    }

    const { path: filePath = '' } = req.body
    const s3 = getS3Client()

    const results = await Promise.all(
      req.files.map(async (file) => {
        const key = filePath ? `${filePath}/${file.originalname}` : file.originalname

        const upload = new Upload({
          client: s3,
          params: {
            Bucket: BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
          }
        })

        const result = await upload.done()

        return {
          success: true,
          key,
          location: result.Location || `${process.env.AWS_ENDPOINT}/${BUCKET}/${key}`,
          size: file.size
        }
      })
    )

    res.json({ success: true, files: results })
  } catch (error) {
    console.error('Upload multiple error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Download file (get presigned URL)
router.get('/download/*key', async (req, res) => {
  try {
    const { key } = req.params
    const s3 = getS3Client()

    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key
    })

    // Generate presigned URL valid for 1 hour
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 })

    res.json({ url })
  } catch (error) {
    console.error('Download error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Stream download
router.get('/stream/*key', async (req, res) => {
  try {
    const { key } = req.params
    const s3 = getS3Client()

    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key
    })

    const response = await s3.send(command)

    res.setHeader('Content-Type', response.ContentType)
    res.setHeader('Content-Length', response.ContentLength)
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(key.split('/').pop())}"`)

    response.Body.pipe(res)
  } catch (error) {
    console.error('Stream error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Delete file
router.delete('/objects/*key', async (req, res) => {
  try {
    const { key } = req.params
    const s3 = getS3Client()

    const command = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key
    })

    await s3.send(command)

    res.json({ success: true, deleted: key })
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create folder
router.post('/folder', async (req, res) => {
  try {
    const { path: folderPath } = req.body

    if (!folderPath) {
      return res.status(400).json({ error: 'Folder path is required' })
    }

    const key = folderPath.endsWith('/') ? folderPath : `${folderPath}/`
    const s3 = getS3Client()

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: '',
      ContentType: 'application/x-directory'
    })

    await s3.send(command)

    res.json({ success: true, folder: key })
  } catch (error) {
    console.error('Create folder error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Copy file
router.post('/copy', async (req, res) => {
  try {
    const { source, destination } = req.body

    if (!source || !destination) {
      return res.status(400).json({ error: 'Source and destination are required' })
    }

    const s3 = getS3Client()

    const command = new CopyObjectCommand({
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${source}`,
      Key: destination,
      ACL: 'public-read'
    })

    await s3.send(command)

    res.json({ success: true, source, destination })
  } catch (error) {
    console.error('Copy error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Helper function to determine content type from file extension
function getContentType(key) {
  const ext = key.split('.').pop()?.toLowerCase()
  const types = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    // Videos
    mp4: 'video/mp4',
    webm: 'video/webm',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Text
    txt: 'text/plain',
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    json: 'application/json',
    xml: 'application/xml',
    // Archives
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip'
  }
  return types[ext] || 'application/octet-stream'
}

module.exports = router
