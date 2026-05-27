// ============================================================
// 申请时间线 API
// ============================================================

const express = require('express')
const prisma = require('../lib/prisma')
const openai = require('../lib/openai')

const router = express.Router()

// GET /v1/timeline — 生成个性化申请时间线
router.get('/', async (req, res) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.userId },
    })

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROFILE_NOT_FOUND', message: '请先填写学生背景' },
      })
    }

    const grade = profile.grade || 'junior'
    const targetRegions = profile.targetRegions || '["uk"]'
    const targetDegree = profile.targetDegree || 'taught_master'

    const gradeMap = {
      freshman: '大一',
      sophomore: '大二',
      junior: '大三',
      senior: '大四',
      graduated: '已毕业',
    }

    let regions
    try {
      regions = JSON.parse(targetRegions)
    } catch {
      regions = [targetRegions]
    }

    const prompt = `你是留学申请规划 AI。根据以下学生信息生成个性化申请时间线。

学生信息：
- 年级：${gradeMap[grade] || grade}
- 目标地区：${regions.join(', ')}
- 目标学位：${targetDegree === 'taught_master' ? '授课型硕士' : targetDegree === 'research_master' ? '研究型硕士' : '博士'}
- GPA：${profile.currentGpa}/${profile.gpaScale}
- 语言：雅思${profile.ieltsTotal || '未考'}

当前日期：${new Date().toISOString().split('T')[0]}

请从当前月份开始，生成未来 12-18 个月的申请时间线。输出 JSON：
{
  "timeline": [
    {
      "month": "2025-06",
      "label": "六月",
      "tasks": [
        {
          "title": "任务标题",
          "description": "详细描述",
          "priority": "high/medium/low",
          "category": "academic/language/application/material/skill",
          "status": "pending"
        }
      ]
    }
  ],
  "summary": "整体规划建议",
  "key_deadlines": [
    {"date": "2025-10", "event": "第一轮申请截止", "importance": "high"}
  ]
}`

    const completion = await openai.chat.completions.create({
      model: process.env.MIMO_MODEL || 'mimo-v2.5-pro',
      messages: [
        {
          role: 'system',
          content: '你是 GPA Planner 的留学申请规划 AI。根据学生背景生成个性化、可执行的申请时间线。按月份组织任务，标注优先级。输出 JSON。',
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
    })
  } catch (err) {
    console.error('Timeline error:', err)
    res.status(500).json({
      success: false,
      error: { code: 'AI_GENERATION_FAILED', message: '时间线生成失败，请稍后重试' },
    })
  }
})

module.exports = router
