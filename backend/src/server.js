require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authMiddleware = require('./middleware/auth')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const reportRoutes = require('./routes/reports')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/v1/auth', authRoutes)
app.use('/v1/profile', authMiddleware, profileRoutes)
app.use('/v1/reports', authMiddleware, reportRoutes)

// Health check
app.get('/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
