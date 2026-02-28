const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()

// Environment
const env = process.argv[2] || 'local'
const PORT = {
  local: 8080,
  dev: 4433,
  prd: 4040
}[env] || 8080

console.log(`Starting server in ${env} mode on port ${PORT}`)

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
  app.get('*', (req, res) => {
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  console.log(`API endpoint: http://localhost:${PORT}/api`)
})

module.exports = app
