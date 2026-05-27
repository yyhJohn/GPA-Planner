// ============================================================
// GPA 目标反推 API
// ============================================================

const express = require('express')
const prisma = require('../lib/prisma')

const router = express.Router()

// 等级制 → 4.0 制换算
const gradePoints = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0,
}

function scoreToPoint(score, scoreType) {
  if (scoreType === 'percentage') {
    const s = parseFloat(score)
    if (s >= 90) return 4.0
    if (s >= 85) return 3.7
    if (s >= 82) return 3.3
    if (s >= 78) return 3.0
    if (s >= 75) return 2.7
    if (s >= 72) return 2.3
    if (s >= 68) return 2.0
    if (s >= 64) return 1.7
    if (s >= 60) return 1.0
    return 0.0
  }
  return gradePoints[score] ?? null
}

// POST /v1/gpa/goal — GPA 目标反推
router.post('/goal', async (req, res) => {
  try {
    const { targetGpa, remainingCredits, expectedGrades } = req.body

    if (!targetGpa || !remainingCredits) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '请提供目标 GPA 和剩余学分数' },
      })
    }

    const target = parseFloat(targetGpa)
    const remaining = parseFloat(remainingCredits)

    if (target < 0 || target > 4.0 || remaining <= 0) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '参数范围不合法' },
      })
    }

    // 获取用户已有课程
    const courses = await prisma.course.findMany({
      where: { userId: req.userId, recordType: 'completed' },
    })

    // 计算当前加权绩点
    let totalPoints = 0
    let totalCredits = 0
    courses.forEach((c) => {
      const point = scoreToPoint(c.score, c.scoreType)
      if (point !== null) {
        totalPoints += point * c.credit
        totalCredits += c.credit
      }
    })

    const currentGpa = totalCredits > 0 ? totalPoints / totalCredits : 0
    const currentTotalPoints = totalPoints
    const currentTotalCredits = totalCredits

    // 目标：(currentTotalPoints + 剩余课程得分) / (currentTotalCredits + remaining) >= target
    // 需要的剩余总得分 = target * (currentTotalCredits + remaining) - currentTotalPoints
    const requiredTotalPoints = target * (currentTotalCredits + remaining) - currentTotalPoints
    const requiredAvgGpa = remaining > 0 ? requiredTotalPoints / remaining : 0

    // 可行性分析
    const isFeasible = requiredAvgGpa <= 4.0
    const isEasy = requiredAvgGpa <= 3.0
    const isModerate = requiredAvgGpa <= 3.5
    const isHard = requiredAvgGpa <= 4.0

    // 对应分数描述
    let gradeLabel = ''
    if (requiredAvgGpa <= 0) gradeLabel = '任意成绩均可达标'
    else if (requiredAvgGpa <= 1.0) gradeLabel = 'D 以上即可'
    else if (requiredAvgGpa <= 1.7) gradeLabel = 'C- 以上即可'
    else if (requiredAvgGpa <= 2.0) gradeLabel = 'C 以上即可'
    else if (requiredAvgGpa <= 2.3) gradeLabel = 'C+ 以上即可'
    else if (requiredAvgGpa <= 2.7) gradeLabel = 'B- 以上即可'
    else if (requiredAvgGpa <= 3.0) gradeLabel = 'B 以上即可'
    else if (requiredAvgGpa <= 3.3) gradeLabel = 'B+ 以上即可'
    else if (requiredAvgGpa <= 3.7) gradeLabel = 'A- 以上即可'
    else if (requiredAvgGpa <= 4.0) gradeLabel = 'A/A+ 才可达标'
    else gradeLabel = '即使全 A 也无法达标'

    // 如果用户提供了 expectedGrades，逐门计算
    let courseDetails = []
    if (expectedGrades && Array.isArray(expectedGrades) && expectedGrades.length > 0) {
      // 用户指定了部分课程的预期成绩，计算剩余课程需要的最低分
      let fixedPoints = 0
      let fixedCredits = 0
      const unspecifiedCredits = remaining - expectedGrades.reduce((s, g) => s + (parseFloat(g.credit) || 0), 0)

      expectedGrades.forEach((g) => {
        const credit = parseFloat(g.credit) || 0
        const point = scoreToPoint(g.expectedScore, g.scoreType || 'grade')
        if (point !== null) {
          fixedPoints += point * credit
          fixedCredits += credit
          courseDetails.push({
            courseName: g.courseName || '未命名课程',
            credit,
            expectedScore: g.expectedScore,
            expectedPoint: point,
            contribution: Math.round(point * credit * 100) / 100,
          })
        }
      })

      const neededFromUnspecified = requiredTotalPoints - fixedPoints
      const avgForUnspecified = unspecifiedCredits > 0 ? neededFromUnspecified / unspecifiedCredits : 0

      courseDetails.forEach((d) => {
        d.status = 'fixed'
      })

      // 为未指定的课程生成建议
      const suggestions = []
      if (unspecifiedCredits > 0) {
        suggestions.push({
          courseName: `剩余 ${unspecifiedCredits} 学分课程（未指定）`,
          credit: unspecifiedCredits,
          requiredAvgPoint: Math.round(avgForUnspecified * 100) / 100,
          requiredGrade: avgForUnspecified <= 4.0 ? getGradeLabel(avgForUnspecified) : '无法达标',
          status: 'required',
        })
      }

      courseDetails = [...courseDetails, ...suggestions]
    } else {
      // 未指定具体课程，假设 remaining 学分均匀分布
      // 生成几档建议
      const scenarios = [
        { label: '轻松方案', targetPoint: Math.min(requiredAvgGpa, 3.0), desc: '选简单课，轻松拿高分' },
        { label: '均衡方案', targetPoint: requiredAvgGpa, desc: '按需达标，合理选课' },
        { label: '冲刺方案', targetPoint: Math.min(requiredAvgGpa + 0.3, 4.0), desc: '冲更高分，留出余量' },
      ]

      courseDetails = scenarios.map((s) => ({
        scenario: s.label,
        requiredAvgPoint: Math.round(s.targetPoint * 100) / 100,
        requiredGrade: getGradeLabel(s.targetPoint),
        description: s.desc,
        feasibility: s.targetPoint <= 4.0 ? 'feasible' : 'impossible',
      }))
    }

    // 生成建议
    const suggestions = []
    if (!isFeasible) {
      suggestions.push('目标 GPA 过高，即使全部课程拿 A/A+ 也无法达到')
      suggestions.push('建议考虑重修低分课程来提升已有绩点')
      suggestions.push('或者适当降低目标 GPA 到 ' + Math.floor(requiredAvgGpa * 10) / 10)
    } else if (requiredAvgGpa >= 3.7) {
      suggestions.push('目标较高，需要每门课都拿到 A- 以上')
      suggestions.push('建议选课时注意难度，避免同时选多门高难度课程')
      suggestions.push('可考虑重修之前的低分课程来降低压力')
    } else if (requiredAvgGpa >= 3.0) {
      suggestions.push('目标可行，需要保持 B 以上的平均水平')
      suggestions.push('建议重点关注学分高的课程，对 GPA 影响更大')
    } else {
      suggestions.push('目标轻松可达，保持正常学习节奏即可')
      suggestions.push('可以适当选修感兴趣的课程丰富知识面')
    }

    res.json({
      success: true,
      data: {
        current: {
          gpa: Math.round(currentGpa * 100) / 100,
          credits: currentTotalCredits,
          totalPoints: Math.round(currentTotalPoints * 100) / 100,
        },
        target: {
          gpa: target,
          remainingCredits: remaining,
        },
        analysis: {
          requiredAvgGpa: Math.round(requiredAvgGpa * 100) / 100,
          requiredGrade: gradeLabel,
          isFeasible,
          difficulty: !isFeasible ? 'impossible' : isEasy ? 'easy' : isModerate ? 'moderate' : 'hard',
          gap: Math.round((target - currentGpa) * 100) / 100,
        },
        courseDetails,
        suggestions,
      },
    })
  } catch (err) {
    console.error('GPA goal error:', err)
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
    })
  }
})

// GET /v1/gpa/trend — GPA 趋势
router.get('/trend', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { userId: req.userId, recordType: 'completed' },
      orderBy: { semester: 'asc' },
    })

    // 按学期聚合
    const semesterMap = {}
    courses.forEach((c) => {
      if (!semesterMap[c.semester]) {
        semesterMap[c.semester] = { totalPoints: 0, totalCredits: 0, courses: [] }
      }
      const point = scoreToPoint(c.score, c.scoreType)
      if (point !== null) {
        semesterMap[c.semester].totalPoints += point * c.credit
        semesterMap[c.semester].totalCredits += c.credit
        semesterMap[c.semester].courses.push({
          name: c.courseName,
          credit: c.credit,
          score: c.score,
          point,
        })
      }
    })

    // 计算每学期 GPA 和累计 GPA
    const semesters = Object.keys(semesterMap).sort()
    let cumulativePoints = 0
    let cumulativeCredits = 0

    const trend = semesters.map((sem) => {
      const data = semesterMap[sem]
      const semesterGpa = data.totalCredits > 0
        ? Math.round((data.totalPoints / data.totalCredits) * 100) / 100
        : 0

      cumulativePoints += data.totalPoints
      cumulativeCredits += data.totalCredits
      const cumulativeGpa = cumulativeCredits > 0
        ? Math.round((cumulativePoints / cumulativeCredits) * 100) / 100
        : 0

      return {
        semester: sem,
        semesterGpa,
        cumulativeGpa,
        credits: data.totalCredits,
        courseCount: data.courses.length,
      }
    })

    res.json({
      success: true,
      data: {
        trend,
        summary: {
          totalCredits: cumulativeCredits,
          overallGpa: cumulativeCredits > 0 ? Math.round((cumulativePoints / cumulativeCredits) * 100) / 100 : 0,
          semesterCount: semesters.length,
        },
      },
    })
  } catch (err) {
    console.error('GPA trend error:', err)
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
    })
  }
})

function getGradeLabel(point) {
  if (point <= 0) return '任意'
  if (point <= 1.0) return 'D'
  if (point <= 1.7) return 'C-'
  if (point <= 2.0) return 'C'
  if (point <= 2.3) return 'C+'
  if (point <= 2.7) return 'B-'
  if (point <= 3.0) return 'B'
  if (point <= 3.3) return 'B+'
  if (point <= 3.7) return 'A-'
  return 'A/A+'
}

module.exports = router
