const express = require('express')
const prisma = require('../lib/prisma')
const openai = require('../lib/openai')

const router = express.Router()

// GET /reports - 历史报告列表
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10

    const [items, total] = await Promise.all([
      prisma.report.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          title: true,
          gpaSnapshot: true,
          gpaScale: true,
          competitivenessScore: true,
          isPaid: true,
          reportType: true,
          createdAt: true,
        },
      }),
      prisma.report.count({ where: { userId: req.userId } }),
    ])

    res.json({
      success: true,
      data: {
        items,
        pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
      },
    })
  } catch (err) {
    console.error('List reports error:', err)
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
    })
  }
})

// GET /reports/:id - 单个报告
router.get('/:id', async (req, res) => {
  try {
    const report = await prisma.report.findFirst({
      where: { id: req.params.id, userId: req.userId },
    })

    if (!report) {
      return res.status(404).json({
        success: false,
        error: { code: 'REPORT_NOT_FOUND', message: '报告不存在' },
      })
    }

    // 未付费报告隐藏部分内容
    if (!report.isPaid) {
      const content = report.content
      content.schools = {
        sprint: content.schools?.sprint?.map((s) => ({ ...s, name: '***', program: '***' })) || [],
        match: content.schools?.match || [],
        safe: content.schools?.safe || [],
      }
      content.plan6Months = undefined
      content.psHighlights = undefined
    }

    res.json({ success: true, data: { report } })
  } catch (err) {
    console.error('Get report error:', err)
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
    })
  }
})

// POST /reports/free - 生成免费分析
router.post('/free', async (req, res) => {
  try {
    // 检查每日限制
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayCount = await prisma.report.count({
      where: {
        userId: req.userId,
        reportType: 'free',
        createdAt: { gte: today },
      },
    })

    if (todayCount >= 3) {
      return res.status(429).json({
        success: false,
        error: { code: 'RATE_LIMITED', message: '每天最多生成 3 份免费报告' },
      })
    }

    // 获取用户数据
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.userId } })
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROFILE_NOT_FOUND', message: '请先填写学生背景' },
      })
    }

    const courses = await prisma.course.findMany({ where: { userId: req.userId } })
    const targetGpa = parseFloat(req.body.targetGpa) || 3.5

    // 调用 OpenAI
    const prompt = buildFreeReportPrompt(profile, courses, targetGpa)
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    })

    const aiContent = JSON.parse(completion.choices[0].message.content)

    // 保存报告
    const report = await prisma.report.create({
      data: {
        userId: req.userId,
        title: 'GPA 免费分析报告',
        reportType: 'free',
        isPaid: false,
        gpaSnapshot: profile.currentGpa,
        gpaScale: profile.gpaScale,
        competitivenessScore: aiContent.competitiveness_score || 0,
        content: aiContent,
        aiModel: process.env.OPENAI_MODEL || 'gpt-4o',
      },
    })

    res.status(201).json({
      success: true,
      data: { report },
      message: '免费分析报告已生成',
    })
  } catch (err) {
    console.error('Generate free report error:', err)
    res.status(500).json({
      success: false,
      error: { code: 'AI_GENERATION_FAILED', message: 'AI 生成失败，请稍后重试' },
    })
  }
})

// POST /reports/full - 生成付费报告
router.post('/full', async (req, res) => {
  try {
    const { freeReportId } = req.body

    const freeReport = await prisma.report.findFirst({
      where: { id: freeReportId, userId: req.userId, reportType: 'free' },
    })

    if (!freeReport) {
      return res.status(404).json({
        success: false,
        error: { code: 'REPORT_NOT_FOUND', message: '免费报告不存在' },
      })
    }

    if (!freeReport.isPaid) {
      return res.status(402).json({
        success: false,
        error: { code: 'PAYMENT_REQUIRED', message: '需要付费后才能生成完整报告' },
      })
    }

    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.userId } })
    const courses = await prisma.course.findMany({ where: { userId: req.userId } })

    const prompt = buildFullReportPrompt(profile, courses, freeReport.content)
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    })

    const aiContent = JSON.parse(completion.choices[0].message.content)

    const report = await prisma.report.update({
      where: { id: freeReportId },
      data: {
        title: 'GPA 完整规划报告',
        reportType: 'full',
        content: aiContent,
        competitivenessScore: aiContent.competitiveness_score?.total || 0,
      },
    })

    res.json({
      success: true,
      data: { report },
      message: '完整报告已生成',
    })
  } catch (err) {
    console.error('Generate full report error:', err)
    res.status(500).json({
      success: false,
      error: { code: 'AI_GENERATION_FAILED', message: 'AI 生成失败，请稍后重试' },
    })
  }
})

// ============================================================
// Prompt 构建
// ============================================================

const SYSTEM_PROMPT = `你是 GPA Planner 的 AI 留学规划顾问。根据学生背景给出严谨、专业、可执行的留学规划建议。

绝对禁止：
1. 不承诺录取，禁止使用"保录取""稳录""保证能上"
2. 不编造学校官方录取率、最低 GPA 要求
3. 不冒充招生官或真人顾问
4. 不制造焦虑

表述规范：
- 使用"冲刺""高匹配""中匹配""低匹配"替代"保录取"
- 涉及学校要求时注明"请以学校官网为准"
- 信息不足时主动指出缺少哪些信息

输出格式：JSON`

function buildFreeReportPrompt(profile, courses, targetGpa) {
  const courseList = courses.map((c) => `${c.courseName} | ${c.credit}学分 | ${c.score}`).join('\n')

  return `学生背景：
- 学校：${profile.university}（${profile.universityTier}）
- 专业：${profile.major}
- 年级：${profile.grade}
- GPA：${profile.currentGpa}/${profile.gpaScale}
- 排名：${profile.gpaRanking || '未提供'}
- 核心课GPA：${profile.majorGpa || '未提供'}
- 目标学位：${profile.targetDegree}
- 目标专业：${profile.targetMajors}
- 目标地区：${profile.targetRegions}
- 语言成绩：雅思${profile.ieltsTotal || '未考'}
- 担忧：${profile.concerns || '未提供'}

已修课程：
${courseList || '未提供'}

目标 GPA：${targetGpa}

请输出 JSON：
{
  "competitiveness_score": 0-100,
  "gpa_analysis": {
    "current_gpa": number,
    "gpa_scale": number,
    "ranking_estimate": "string",
    "strengths": ["string"],
    "weaknesses": ["string"],
    "contribution": [{"course": "string", "credit": number, "score": "string", "impact": number}]
  },
  "course_matching": {
    "match_rate": 0-100,
    "covered": ["string"],
    "missing": ["string"],
    "suggestion": "string"
  },
  "gpa_improvement": {
    "target": number,
    "gap": number,
    "semesters_needed": number,
    "strategy": "string"
  },
  "direction_suggestions": [{"name": "string", "match": "高匹配/中匹配", "reason": "string"}],
  "schools_preview": "string（模糊预览文本）",
  "course_recommendations_preview": "string（模糊预览文本）"
}`
}

function buildFullReportPrompt(profile, courses, freeContent) {
  const courseList = courses.map((c) => `${c.courseName} | ${c.credit}学分 | ${c.score}`).join('\n')

  return `基于之前的免费分析，生成完整报告。

学生背景：
- 学校：${profile.university}（${profile.universityTier}）
- 专业：${profile.major}
- GPA：${profile.currentGpa}/${profile.gpaScale}
- 目标专业：${profile.targetMajors}
- 目标地区：${profile.targetRegions}
- 语言：雅思${profile.ieltsTotal || '未考'}

已修课程：
${courseList}

免费分析结果：
${JSON.stringify(freeContent, null, 2)}

请输出完整 JSON：
{
  "competitiveness_score": {"total": number, "gpa": number, "experience": number, "language": number},
  "gpa_analysis": { ... },
  "course_matching": { ... },
  "direction_suggestions": [...],
  "schools": {
    "sprint": [{"name": "string", "program": "string", "match_level": "冲刺", "note": "string"}],
    "match": [...],
    "safe": [...]
  },
  "gpa_improvement": { ... },
  "course_recommendations": [{"course": "string", "reason": "string", "priority": "高/中/低"}],
  "plan_3_months": [{"task": "string", "deadline": "string", "priority": "高/中"}],
  "plan_6_months": [{"task": "string", "deadline": "string", "priority": "高/中"}],
  "risks": [{"level": "高/中/低", "text": "string", "action": "string"}],
  "ps_highlights": ["string"],
  "cv_suggestions": ["string"],
  "recommendation_letters": [{"recommender": "string", "focus": "string"}],
  "action_items": [{"task": "string", "deadline": "string"}]
}`
}

module.exports = router
