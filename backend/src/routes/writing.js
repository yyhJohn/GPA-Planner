const express = require('express')
const prisma = require('../lib/prisma')
const openai = require('../lib/openai')

const router = express.Router()

// POST /v1/writing/inspire - 生成文书灵感
router.post('/inspire', async (req, res) => {
  try {
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.userId } })
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROFILE_NOT_FOUND', message: '请先填写学生背景' },
      })
    }

    const courses = await prisma.course.findMany({ where: { userId: req.userId } })
    const projects = await prisma.project.findMany({ where: { userId: req.userId } })
    const internships = await prisma.internship.findMany({ where: { userId: req.userId } })
    const research = await prisma.research.findMany({ where: { userId: req.userId } })

    const { type = 'ps' } = req.body // ps / cv / both

    const prompt = buildWritingPrompt(profile, courses, projects, internships, research, type)

    const completion = await openai.chat.completions.create({
      model: process.env.MIMO_MODEL || 'mimo-v2.5-pro',
      messages: [
        { role: 'system', content: getSystemPrompt() },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 4096,
    })

    const content = JSON.parse(completion.choices[0].message.content)

    res.json({
      success: true,
      data: content,
    })
  } catch (err) {
    console.error('Writing inspire error:', err)
    res.status(500).json({
      success: false,
      error: { code: 'AI_GENERATION_FAILED', message: 'AI 生成失败，请稍后重试' },
    })
  }
})

function getSystemPrompt() {
  return `你是一位资深的留学文书顾问，擅长帮助中国本科生撰写 Personal Statement（PS）和 CV。

你的风格：
- 真诚、具体、有故事感，不要模板化
- 善于从学生的经历中提炼亮点和叙事线索
- 了解英港新美等地区的文书偏好差异
- 给出的建议可直接执行，不说空话

输出格式：JSON`
}

function buildWritingPrompt(profile, courses, projects, internships, research, type) {
  const courseList = courses
    .map((c) => `${c.courseName}（${c.credit}学分，${c.score}）`)
    .join('、')

  const projectList = projects
    .map((p) => `- ${p.name}（${p.role}，${p.type}）：${p.description || '无描述'}`)
    .join('\n')

  const internshipList = internships
    .map((i) => `- ${i.company} ${i.position}（${i.duration}）：${i.description || '无描述'}`)
    .join('\n')

  const researchList = research
    .map((r) => `- ${r.topic}（${r.role || ''}，${r.duration}）：${r.description || '无描述'}`)
    .join('\n')

  const baseInfo = `学生背景：
- 学校：${profile.university}（${profile.universityTier}）
- 专业：${profile.major}
- GPA：${profile.currentGpa}/${profile.gpaScale}
- 目标学位：${profile.targetDegree}
- 目标专业：${profile.targetMajors}
- 目标地区：${profile.targetRegions}
- 语言：雅思${profile.ieltsTotal || '未考'}
- 特殊背景：${profile.specialBackground || '无'}
- 课外活动：${profile.extracurriculars || '无'}

已修课程：${courseList || '未提供'}

项目经历：
${projectList || '无'}

实习经历：
${internshipList || '无'}

科研经历：
${researchList || '无'}`

  if (type === 'ps') {
    return `${baseInfo}

请为该学生生成 Personal Statement 素材和写作建议。

输出 JSON：
{
  "ps_analysis": {
    "core_strengths": ["核心优势 1", "核心优势 2"],
    "unique_angles": ["独特角度 1", "独特角度 2"],
    "potential_weaknesses": ["可改进点 1"]
  },
  "narrative_framework": {
    "hook_suggestions": [
      {"title": "开头方案 1", "description": "具体描述", "example": "示例开头段落"},
      {"title": "开头方案 2", "description": "具体描述", "example": "示例开头段落"}
    ],
    "story_arc": "建议的整体叙事线（从哪到哪，怎么转折）",
    "connection_to_future": "如何把过去经历和未来目标串联"
  },
  "paragraphs": [
    {
      "section": "段落主题",
      "purpose": "这段的目的",
      "key_points": ["要写什么 1", "要写什么 2"],
      "tips": "写作技巧",
      "sample": "示例段落（英文，100-150 词）"
    }
  ],
  "dos_and_donts": {
    "dos": ["应该做的 1", "应该做的 2"],
    "donts": ["不要做的 1", "不要做的 2"]
  },
  "region_tips": {
    "uk": "英国文书偏好提示",
    "hk": "香港文书偏好提示",
    "us": "美国文书偏好提示（如有）"
  }
}`
  }

  if (type === 'cv') {
    return `${baseInfo}

请为该学生生成 CV 素材和优化建议。

输出 JSON：
{
  "cv_analysis": {
    "current_strengths": ["现有亮点"],
    "gaps_to_fill": ["需要补充的内容"],
    "recommended_order": ["建议的 CV 板块顺序"]
  },
  "sections": [
    {
      "section": "板块名称",
      "items": [
        {
          "title": "条目标题",
          "bullet_points": ["要点 1（用 STAR 法则改写）", "要点 2"],
          "impact_statement": "量化影响力描述"
        }
      ]
    }
  ],
  "action_verbs": ["推荐使用的强力动词 1", "动词 2", "动词 3"],
  "formatting_tips": ["格式建议 1", "格式建议 2"],
  "sample_summary": "个人简介示例（英文，30-50 词）"
}`
  }

  // type === 'both'
  return `${baseInfo}

请为该学生同时生成 PS 和 CV 的素材与写作建议。

输出 JSON：
{
  "ps": {
    "core_strengths": ["核心优势"],
    "hook_suggestions": [{"title": "开头方案", "description": "描述", "example": "示例"}],
    "story_arc": "叙事线建议",
    "paragraphs": [{"section": "段落", "purpose": "目的", "key_points": ["要点"], "sample": "示例段落"}],
    "dos_and_donts": {"dos": ["应该做"], "donts": ["不要做"]}
  },
  "cv": {
    "sections": [{"section": "板块", "items": [{"title": "条目", "bullet_points": ["要点"]}]}],
    "action_verbs": ["强力动词"],
    "sample_summary": "个人简介示例"
  },
  "cross_tips": "PS 和 CV 如何互相呼应、避免重复的建议"
}`
}

module.exports = router
