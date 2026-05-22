// ============================================================
// AI 选课模拟 API
// ============================================================

const express = require('express')
const prisma = require('../lib/prisma')
const openai = require('../lib/openai')

const router = express.Router()

// POST /reports/simulate — AI 选课模拟
router.post('/simulate', async (req, res) => {
  try {
    const { reportId, availableCourses, targetGpa } = req.body

    // 获取关联报告
    const report = await prisma.report.findFirst({
      where: { id: reportId, userId: req.userId },
    })

    if (!report) {
      return res.status(404).json({
        success: false,
        error: { code: 'REPORT_NOT_FOUND', message: '报告不存在' },
      })
    }

    // 获取用户已有课程
    const completedCourses = await prisma.course.findMany({
      where: { userId: req.userId, recordType: 'completed' },
    })

    // 获取 profile
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.userId },
    })

    const courseList = completedCourses
      .map((c) => `${c.courseName} | ${c.credit}学分 | ${c.score}`)
      .join('\n')

    const availableList = availableCourses
      .map((c) => `${c.courseName} | ${c.credit}学分 | 难度:${c.difficulty || 'medium'}`)
      .join('\n')

    const target = parseFloat(targetGpa) || 3.5

    const prompt = `你是 GPA 规划 AI。根据学生已修课程和可选课程，模拟不同选课组合对 GPA 的影响。

学生当前 GPA：${profile?.currentGpa || report.gpaSnapshot}/${profile?.gpaScale || report.gpaScale}
目标 GPA：${target}

已修课程：
${courseList || '未提供'}

下学期可选课程：
${availableList}

请分析所有合理的选课组合（1-3 门的组合），输出 JSON：
{
  "current_gpa": number,
  "target_gpa": number,
  "simulations": [
    {
      "combination": ["课程1", "课程2"],
      "predicted_gpa": number,
      "gpa_change": number,
      "recommendation": "推荐/稳妥/保守",
      "reason": "选这门课的原因",
      "risk": "高/中/低",
      "details": [
        {"course": "课程名", "predicted_score": "A-", "credit": 3, "contribution": 0.05}
      ]
    }
  ],
  "best_combination_index": number,
  "overall_strategy": "总结性建议",
  "warning": "如有需要提醒的风险"
}`

    const completion = await openai.chat.completions.create({
      model: process.env.MIMO_MODEL || 'mimo-v2.5-pro',
      messages: [
        {
          role: 'system',
          content: '你是 GPA Planner 的 AI 选课顾问。根据学生现有成绩和可选课程，模拟不同选课组合对 GPA 的影响。不要保证具体分数，用"预测""估计"表达。输出 JSON。',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    })

    const aiContent = JSON.parse(completion.choices[0].message.content)

    res.json({
      success: true,
      data: aiContent,
      message: '选课模拟完成',
    })
  } catch (err) {
    console.error('Simulate error:', err)
    res.status(500).json({
      success: false,
      error: { code: 'AI_GENERATION_FAILED', message: 'AI 选课模拟失败，请稍后重试' },
    })
  }
})

module.exports = router
