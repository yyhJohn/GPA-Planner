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

    const preferences = await prisma.targetPreference.findUnique({
      where: { userId: req.userId },
    })

    res.json({
      success: true,
      data: { profile, courses, preferences },
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
      ieltsR, ieltsW, ieltsS, toeflTotal, concerns, tuitionBudget,
      needScholarship, postGradPlan, additionalInfo, courses,
      // TargetPreference 字段
      targetDegree, targetMajors, targetRegions,
    } = req.body

    const profile = await prisma.studentProfile.create({
      data: {
        userId: req.userId,
        gender, grade, university, universityTier, college, major, minor,
        duration: duration || 4,
        graduationDate: graduationDate ? new Date(graduationDate) : new Date(),
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
        concerns: concerns ? JSON.stringify(concerns) : null,
        tuitionBudget, needScholarship, postGradPlan, additionalInfo,
      },
    })

    // Save target preferences
    if (targetDegree || targetMajors || targetRegions) {
      await prisma.targetPreference.create({
        data: {
          userId: req.userId,
          targetDegree: targetDegree || '',
          targetMajors: JSON.stringify(targetMajors || []),
          targetRegions: JSON.stringify(targetRegions || []),
        },
      })
    }

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
    // 日期字段需要转成 Date 对象
    if (req.body.graduationDate !== undefined) {
      data.graduationDate = req.body.graduationDate ? new Date(req.body.graduationDate) : new Date()
    }
    if (req.body.plannedExamDate !== undefined) {
      data.plannedExamDate = req.body.plannedExamDate ? new Date(req.body.plannedExamDate) : null
    }

    const fields = [
      'gender', 'grade', 'university', 'universityTier', 'college', 'major',
      'minor', 'gpaRanking', 'hasLanguageScore',
      'tuitionBudget', 'livingBudget', 'needScholarship', 'postGradPlan',
      'targetRole', 'cityPreference', 'referralSource', 'additionalInfo',
    ]
    fields.forEach((f) => { if (req.body[f] !== undefined) data[f] = req.body[f] })

    if (req.body.acceptLoan !== undefined) data.acceptLoan = !!req.body.acceptLoan
    if (req.body.targetIndustry !== undefined) data.targetIndustry = JSON.stringify(req.body.targetIndustry)

    const floatFields = ['currentGpa', 'gpaScale', 'majorGpa', 'percentageAvg', 'ieltsTotal', 'ieltsL', 'ieltsR', 'ieltsW', 'ieltsS', 'greAw']
    floatFields.forEach((f) => { if (req.body[f] !== undefined) data[f] = parseFloat(req.body[f]) || null })

    const intFields = ['toeflTotal', 'toeflR', 'toeflL', 'toeflS', 'toeflW', 'greTotal', 'greQuant', 'greVerbal', 'gmatScore', 'cet4Score', 'cet6Score']
    intFields.forEach((f) => { if (req.body[f] !== undefined) data[f] = parseInt(req.body[f]) || null })

    if (req.body.duration !== undefined) data.duration = parseInt(req.body.duration)
    if (req.body.concerns !== undefined) data.concerns = JSON.stringify(req.body.concerns)

    const profile = await prisma.studentProfile.update({
      where: { userId: req.userId },
      data,
    })

    // 更新 TargetPreference（申请目标）
    const prefData = {}
    if (req.body.targetDegree !== undefined) prefData.targetDegree = req.body.targetDegree
    if (req.body.targetMajors !== undefined) prefData.targetMajors = JSON.stringify(req.body.targetMajors)
    if (req.body.targetRegions !== undefined) prefData.targetRegions = JSON.stringify(req.body.targetRegions)

    if (Object.keys(prefData).length > 0) {
      await prisma.targetPreference.upsert({
        where: { userId: req.userId },
        update: prefData,
        create: { userId: req.userId, targetDegree: '', targetMajors: '[]', targetRegions: '[]', ...prefData },
      })
    }

    // 更新课程（先删后建）
    if (req.body.courses && Array.isArray(req.body.courses)) {
      await prisma.course.deleteMany({ where: { userId: req.userId } })
      if (req.body.courses.length > 0) {
        await prisma.course.createMany({
          data: req.body.courses
            .filter((c) => c.courseName) // 过滤空课程名
            .map((c) => ({
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
    }

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
