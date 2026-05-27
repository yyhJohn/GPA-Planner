require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authMiddleware = require('./middleware/auth')
const rateLimitMiddleware = require('./middleware/rateLimit')
const validationMiddleware = require('./middleware/validate')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const reportRoutes = require('./routes/reports')
const courseRoutes = require('./routes/courses')
const simulateRoutes = require('./routes/simulate')
const ocrRoutes = require('./routes/ocr')
const writingRoutes = require('./routes/writing')
const gpaGoalRoutes = require('./routes/gpa-goal')
const timelineRoutes = require('./routes/timeline')

const app = express()
const PORT = process.env.PORT || 3000

// Global Middleware
app.use(cors())
app.use(express.json())
app.use(rateLimitMiddleware)

// Public Routes (no auth)
app.use('/v1/auth', validationMiddleware, authRoutes)

// Health check
app.get('/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Protected Routes (auth required)
app.use('/v1/profile', authMiddleware, validationMiddleware, profileRoutes)
app.use('/v1/reports', authMiddleware, validationMiddleware, reportRoutes)
app.use('/v1/courses', authMiddleware, courseRoutes)
app.use('/v1/reports', authMiddleware, simulateRoutes)
app.use('/v1/ocr', authMiddleware, ocrRoutes)
app.use('/v1/writing', authMiddleware, writingRoutes)
app.use('/v1/gpa', authMiddleware, gpaGoalRoutes)
app.use('/v1/timeline', authMiddleware, timelineRoutes)

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
