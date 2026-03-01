const express = require('express')
const https = require('https')
const http = require('http')
const fs = require('fs')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()

// Environment
const env = process.argv[2] || 'local'
const HTTP_PORT = {
  local: 8080,
  dev: 4433,
  prd: 80
}[env] || 8080

const HTTPS_PORT = {
  local: 8443,
  dev: 4434,
  prd: 443
}[env] || 8443

console.log(`Starting server in ${env} mode`)

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:8080',
    'https://file.minigrow.kr',
    'http://file.minigrow.kr'
  ],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// HTTP to HTTPS redirect in production
if (env === 'prd') {
  app.use((req, res, next) => {
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
      next()
    } else {
      res.redirect(`https://${req.headers.host}${req.url}`)
    }
  })
}

// Static files (for production)
if (env === 'prd') {
  app.use(express.static(path.join(__dirname, '../build')))
}

// Routes
const s3Router = require('./Routers/s3Router')
app.use('/api/s3', s3Router)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env, timestamp: new Date().toISOString() })
})

// Catch-all for SPA (production)
if (env === 'prd') {
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'))
  })
}

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({
    error: 'Internal Server Error',
    message: env !== 'prd' ? err.message : undefined
  })
})

// SSL Certificate paths
const crtPath = path.join(__dirname, 'crt')
const sslOptions = {
  key: fs.existsSync(path.join(crtPath, 'file.minigrow.kr_202603012BA48.key.pem'))
    ? fs.readFileSync(path.join(crtPath, 'file.minigrow.kr_202603012BA48.key.pem'))
    : null,
  cert: fs.existsSync(path.join(crtPath, 'file.minigrow.kr_202603012BA48.crt.pem'))
    ? fs.readFileSync(path.join(crtPath, 'file.minigrow.kr_202603012BA48.crt.pem'))
    : null,
  ca: fs.existsSync(path.join(crtPath, 'RootChain', 'chain-bundle.pem'))
    ? fs.readFileSync(path.join(crtPath, 'RootChain', 'chain-bundle.pem'))
    : null
}

// Start servers
if (env === 'prd' && sslOptions.key && sslOptions.cert) {
  // HTTPS server
  https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
    console.log(`HTTPS Server running at https://file.minigrow.kr:${HTTPS_PORT}`)
  })

  // HTTP server (redirect to HTTPS)
  http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`HTTP Server running at http://file.minigrow.kr:${HTTP_PORT} (redirects to HTTPS)`)
  })
} else {
  // Development - HTTP only
  app.listen(HTTP_PORT, () => {
    console.log(`Server running at http://localhost:${HTTP_PORT}`)
    console.log(`API endpoint: http://localhost:${HTTP_PORT}/api`)
  })
}

module.exports = app
