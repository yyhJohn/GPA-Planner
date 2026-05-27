const express = require('express')
const multer = require('multer')
const openai = require('../lib/openai')

const router = express.Router()

// 配置 multer，限制文件大小 10MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('只支持图片文件'))
    }
  },
})

// POST /v1/ocr/transcript - 成绩单 OCR 识别
router.post('/transcript', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_IMAGE', message: '请上传成绩单图片' },
      })
    }

    const base64Image = req.file.buffer.toString('base64')
    const mimeType = req.file.mimetype
    const dataUrl = `data:${mimeType};base64,${base64Image}`

    const completion = await openai.chat.completions.create({
      model: process.env.MIMO_VISION_MODEL || 'mimo-v2.5',
      messages: [
        {
          role: 'system',
          content: `你是一个成绩单 OCR 识别助手。用户会上传一张成绩单图片，你需要识别并提取所有课程信息。

输出格式必须是 JSON，结构如下：
{
  "courses": [
    {
      "courseName": "课程名称",
      "credit": 3.0,
      "score": "A" 或 "85",
      "scoreType": "grade" 或 "percentage",
      "semester": "大一上",
      "courseType": "required" 或 "elective" 或 "general",
      "category": "math" 或 "english" 或 "major_core" 或 "major_elective" 或 "general" 或 "sports" 或 "other"
    }
  ],
  "university": "学校名称（如果能识别）",
  "major": "专业名称（如果能识别）",
  "gpa": "GPA 数值（如果能识别）",
  "gpa_scale": "GPA 制式 4.0/5.0/100（如果能识别）",
  "raw_text": "成绩单上的原始文本内容（尽量完整）"
}

注意：
1. 如果是百分制成绩，scoreType 设为 "percentage"，score 为数字字符串如 "85"
2. 如果是等级制成绩，scoreType 设为 "grade"，score 为等级如 "A"、"B+"
3. semester 尽量识别为中文：大一上/大一下/大二上/大二下/大三上/大三下/大四上/大四下
4. 如果无法确定某个字段，可以留空或使用合理默认值
5. 尽可能准确识别所有课程，不要遗漏`,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: '请识别这张成绩单上的所有课程信息，以 JSON 格式输出。' },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 4096,
    })

    const content = JSON.parse(completion.choices[0].message.content)

    // 标准化 courses 数据
    const courses = (content.courses || []).map((c) => ({
      courseName: c.courseName || '',
      credit: parseFloat(c.credit) || 0,
      score: String(c.score || ''),
      scoreType: c.scoreType || 'grade',
      semester: c.semester || '未知',
      courseType: c.courseType || 'elective',
      category: c.category || 'other',
    }))

    res.json({
      success: true,
      data: {
        courses,
        university: content.university || '',
        major: content.major || '',
        gpa: content.gpa || '',
        gpaScale: content.gpa_scale || '',
        rawText: content.raw_text || '',
      },
    })
  } catch (err) {
    console.error('OCR error:', err)
    if (err.message === '只支持图片文件') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_FILE', message: '只支持图片文件' },
      })
    }
    res.status(500).json({
      success: false,
      error: { code: 'OCR_FAILED', message: 'OCR 识别失败，请稍后重试' },
    })
  }
})

module.exports = router
