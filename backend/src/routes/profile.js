const express = require('express')
const prisma = require('../lib/prisma')

const router = express.Router()

// GET /profile
router.get('/', async (req, res) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.userId },
      include: { user: { select: { email: true, name: true } } },
    })

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROFILE_NOT_FOUND', message: '尚未填写背景信息' },
      })
    }

    const courses = await prisma.course.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'asc' },
    })

    res.json({
      success: true,
      data: { profile, courses },
    })
  } catch (err) {
    console.error('Get profile error:', err)
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
    })
  }
})

// POST /profile
router.post('/', async (req, res) => {
  try {
    const existing = await prisma.studentProfile.findUnique({ where: { userId: req.userId } })
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'PROFILE_EXISTS', message: '已有背景信息，请用 PUT 修改' },
      })
    }

    const {
      gender, grade, university, universityTier, college, major, minor,
      duration, graduationDate, currentGpa, gpaScale, gpaRanking,
      majorGpa, percentageAvg, hasLanguageScore, ieltsTotal, ieltsL,
      ieltsR, ieltsW, ieltsS, toeflTotal, targetDegree, targetMajors,
      targetRegions, concerns, tuitionBudget, postGradPlan, additionalInfo,
      courses,
    } = req.body

    const profile = await prisma.studentProfile.create({
      data: {
        userId: req.userId,
        gender, grade, university, universityTier, college, major, minor,
        duration: duration || 4,
        graduationDate: graduationDate || '',
        currentGpa: parseFloat(currentGpa) || 0,
        gpaScale: parseFloat(gpaScale) || 4.0,
        gpaRanking, majorGpa: majorGpa ? parseFloat(majorGpa) : null,
        percentageAvg: percentageAvg ? parseFloat(percentageAvg) : null,
        hasLanguageScore: hasLanguageScore || 'no',
        ieltsTotal: ieltsTotal ? parseFloat(ieltsTotal) : null,
        ieltsL: ieltsL ? parseFloat(ieltsL) : null,
        ieltsR: ieltsR ? parseFloat(ieltsR) : null,
        ieltsW: ieltsW ? parseFloat(ieltsW) : null,
        ieltsS: ieltsS ? parseFloat(ieltsS) : null,
        toeflTotal: toeflTotal ? parseInt(toeflTotal) : null,
        targetDegree: targetDegree || '',
        targetMajors: JSON.stringify(targetMajors || []),
        targetRegions: JSON.stringify(targetRegions || []),
        concerns: concerns ? JSON.stringify(concerns) : null,
        tuitionBudget, postGradPlan, additionalInfo,
      },
    })

    // Save courses
    if (courses && courses.length > 0) {
      await prisma.course.createMany({
        data: courses.map((c) => ({
          userId: req.userId,
          courseName: c.courseName,
          courseType: c.courseType || 'required',
          credit: parseFloat(c.credit) || 0,
          score: c.score || '',
          scoreType: c.scoreType || 'grade',
          semester: c.semester || '',
          category: c.category || null,
        })),
      })
    }

    res.status(201).json({
      success: true,
      data: { profile },
      message: '背景信息保存成功',
    })
  } catch (err) {
    console.error('Create profile error:', err)
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
    })
  }
})

// PUT /profile
router.put('/', async (req, res) => {
  try {
    const existing = await prisma.studentProfile.findUnique({ where: { userId: req.userId } })
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROFILE_NOT_FOUND', message: '尚未填写背景信息，请先 POST 创建' },
      })
    }

    const data = {}
    const fields = [
      'gender', 'grade', 'university', 'universityTier', 'college', 'major',
      'minor', 'graduationDate', 'gpaRanking', 'hasLanguageScore',
      'targetDegree', 'tuitionBudget', 'postGradPlan', 'additionalInfo',
    ]
    fields.forEach((f) => { if (req.body[f] !== undefined) data[f] = req.body[f] })

    const floatFields = ['currentGpa', 'gpaScale', 'majorGpa', 'percentageAvg', 'ieltsTotal', 'ieltsL', 'ieltsR', 'ieltsW', 'ieltsS']
    floatFields.forEach((f) => { if (req.body[f] !== undefined) data[f] = parseFloat(req.body[f]) || null })

    if (req.body.duration !== undefined) data.duration = parseInt(req.body.duration)
    if (req.body.toeflTotal !== undefined) data.toeflTotal = parseInt(req.body.toeflTotal) || null
    if (req.body.targetMajors !== undefined) data.targetMajors = JSON.stringify(req.body.targetMajors)
    if (req.body.targetRegions !== undefined) data.targetRegions = JSON.stringify(req.body.targetRegions)
    if (req.body.concerns !== undefined) data.concerns = JSON.stringify(req.body.concerns)

    const profile = await prisma.studentProfile.update({
      where: { userId: req.userId },
      data,
    })

    res.json({
      success: true,
      data: { profile },
      message: '背景信息更新成功',
    })
  } catch (err) {
    console.error('Update profile error:', err)
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
    })
  }
})

module.exports = router
