// ============================================================
// 课程独立管理 API
// ============================================================

const express = require('express')
const prisma = require('../lib/prisma')

const router = express.Router()

// GET /courses — 获取用户所有课程
router.get('/', async (req, res) => {
  try {
    const { type, semester } = req.query

    const where = { userId: req.userId }
    if (type) where.recordType = type
    if (semester) where.semester = semester

    const courses = await prisma.course.findMany({
      where,
      orderBy: [{ semester: 'asc' }, { createdAt: 'asc' }],
    })

    // 计算汇总
    const completed = courses.filter((c) => c.recordType === 'completed')
    const totalCredits = completed.reduce((sum, c) => sum + c.credit, 0)

    // 简易 GPA 计算
    const gradePoints = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0,
    }
    let totalPoints = 0
    let totalWeight = 0
    completed.forEach((c) => {
      let point = gradePoints[c.score]
      if (point === undefined && c.scoreType === 'percentage') {
        const s = parseFloat(c.score)
        if (s >= 90) point = 4.0
        else if (s >= 85) point = 3.7
        else if (s >= 82) point = 3.3
        else if (s >= 78) point = 3.0
        else if (s >= 75) point = 2.7
        else if (s >= 72) point = 2.3
        else if (s >= 68) point = 2.0
        else if (s >= 64) point = 1.7
        else if (s >= 60) point = 1.0
        else point = 0.0
      }
      if (point !== undefined) {
        totalPoints += point * c.credit
        totalWeight += c.credit
      }
    })

    const currentGpa = totalWeight > 0 ? Math.round((totalPoints / totalWeight) * 100) / 100 : 0

    res.json({
      success: true,
      data: {
        courses,
        summary: {
          totalCredits,
          completedCredits: completed.length,
          currentGpa,
        },
      },
    })
  } catch (err) {
    console.error('List courses error:', err)
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
    })
  }
})

// POST /courses/batch — 批量添加课程
router.post('/batch', async (req, res) => {
  try {
    const { courses } = req.body

    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '请提供至少一门课程' },
      })
    }

    const created = await prisma.course.createMany({
      data: courses.map((c) => ({
        userId: req.userId,
        courseName: c.courseName,
        courseType: c.courseType || 'required',
        credit: parseFloat(c.credit) || 0,
        score: c.score || '',
        scoreType: c.scoreType || 'grade',
        semester: c.semester || '',
        category: c.category || null,
        recordType: c.recordType || 'completed',
        difficulty: c.difficulty || null,
        isRetake: c.isRetake || false,
        originalScore: c.originalScore || null,
      })),
    })

    res.status(201).json({
      success: true,
      data: { count: created.count },
      message: `成功添加 ${created.count} 门课程`,
    })
  } catch (err) {
    console.error('Batch add courses error:', err)
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
    })
  }
})

// DELETE /courses/:id — 删除单门课程
router.delete('/:id', async (req, res) => {
  try {
    const course = await prisma.course.findFirst({
      where: { id: req.params.id, userId: req.userId },
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        error: { code: 'COURSE_NOT_FOUND', message: '课程不存在' },
      })
    }

    await prisma.course.delete({ where: { id: req.params.id } })

    res.json({
      success: true,
      message: '课程已删除',
    })
  } catch (err) {
    console.error('Delete course error:', err)
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
    })
  }
})

module.exports = router
