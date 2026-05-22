// ============================================================
// 输入校验中间件
// ============================================================

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,32}$/

const validators = {
  // 认证
  'POST /v1/auth/register': (body) => {
    const errors = []
    if (!body.email || !EMAIL_RE.test(body.email)) errors.push('邮箱格式不正确')
    if (!body.password || !PASSWORD_RE.test(body.password)) errors.push('密码需 8-32 位，含大小写字母和数字')
    if (!body.name || body.name.length < 2 || body.name.length > 50) errors.push('姓名需 2-50 字符')
    return errors
  },
  'POST /v1/auth/login': (body) => {
    const errors = []
    if (!body.email) errors.push('邮箱不能为空')
    if (!body.password && !body.code) errors.push('请输入密码或验证码')
    if (body.code && (typeof body.code !== 'string' || body.code.length !== 6)) errors.push('验证码为 6 位数字')
    return errors
  },
  'POST /v1/auth/send-code': (body) => {
    const errors = []
    if (!body.email || !EMAIL_RE.test(body.email)) errors.push('邮箱格式不正确')
    if (body.purpose && !['register', 'login', 'password_reset'].includes(body.purpose)) errors.push('purpose 不合法')
    return errors
  },
  'POST /v1/auth/forgot-password': (body) => {
    const errors = []
    if (!body.email || !EMAIL_RE.test(body.email)) errors.push('邮箱格式不正确')
    return errors
  },
  'POST /v1/auth/reset-password': (body) => {
    const errors = []
    if (!body.email || !EMAIL_RE.test(body.email)) errors.push('邮箱格式不正确')
    if (!body.code || body.code.length !== 6) errors.push('验证码为 6 位数字')
    if (!body.newPassword || body.newPassword.length < 8) errors.push('新密码需至少 8 位')
    return errors
  },

  // 背景
  'POST /v1/profile': (body) => {
    const errors = []
    if (!body.university || body.university.length < 2) errors.push('学校名称不能为空')
    if (!body.major || body.major.length < 1) errors.push('专业不能为空')
    if (body.currentGpa !== undefined && body.currentGpa !== '') {
      const gpa = parseFloat(body.currentGpa)
      if (isNaN(gpa) || gpa < 0 || gpa > 100) errors.push('GPA 值不合法')
    }
    if (body.gpaScale !== undefined && body.gpaScale !== '') {
      const scale = parseFloat(body.gpaScale)
      if (![4.0, 5.0, 100].includes(scale)) errors.push('GPA 制式必须是 4.0、5.0 或 100')
    }
    if (body.ieltsTotal !== undefined && body.ieltsTotal !== '' && body.ieltsTotal !== null) {
      const v = parseFloat(body.ieltsTotal)
      if (isNaN(v) || v < 0 || v > 9.0) errors.push('雅思总分范围 0-9')
    }
    return errors
  },

  // 报告
  'POST /v1/reports/free': (body) => {
    const errors = []
    if (body.targetGpa !== undefined && body.targetGpa !== '') {
      const gpa = parseFloat(body.targetGpa)
      if (isNaN(gpa) || gpa < 0 || gpa > 100) errors.push('目标 GPA 不合法')
    }
    return errors
  },
  'POST /v1/reports/full': (body) => {
    const errors = []
    if (!body.freeReportId) errors.push('缺少 freeReportId')
    return errors
  },

  // 选课模拟
  'POST /v1/reports/simulate': (body) => {
    const errors = []
    if (!body.reportId) errors.push('缺少 reportId')
    if (!body.availableCourses || !Array.isArray(body.availableCourses) || body.availableCourses.length === 0) {
      errors.push('请提供至少一门可选课程')
    }
    if (body.availableCourses) {
      body.availableCourses.forEach((c, i) => {
        if (!c.courseName) errors.push(`第 ${i + 1} 门课程缺少名称`)
        if (c.credit !== undefined && (isNaN(parseFloat(c.credit)) || parseFloat(c.credit) <= 0)) {
          errors.push(`第 ${i + 1} 门课程学分不合法`)
        }
      })
    }
    return errors
  },

  // 课程批量操作
  'POST /v1/courses/batch': (body) => {
    const errors = []
    if (!body.courses || !Array.isArray(body.courses) || body.courses.length === 0) {
      errors.push('请提供至少一门课程')
    }
    if (body.courses && body.courses.length > 100) {
      errors.push('单次最多添加 100 门课程')
    }
    return errors
  },
}

function validationMiddleware(req, res, next) {
  const method = req.method
  const candidates = [
    `${method} ${req.baseUrl}${req.path}`,
    `${method} ${req.originalUrl?.split('?')[0]}`,
    `${method} ${req.path}`,
  ]

  let validator = null
  for (const key of candidates) {
    validator = validators[key]
    if (validator) break
  }

  if (!validator) return next()

  const errors = validator(req.body || {})
  if (errors.length > 0) {
    return res.status(422).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: errors.join('; ') },
    })
  }
  next()
}

module.exports = validationMiddleware
