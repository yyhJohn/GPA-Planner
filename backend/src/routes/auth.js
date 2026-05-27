const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')
const { generateCode, verifyCode } = require('../lib/verifyCode')
const { sendEmail, buildCodeEmail } = require('../lib/email')

const router = express.Router()

// ============================================================
// POST /auth/register — 注册（需要验证码）
// ============================================================
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, code } = req.body

    if (!email || !password) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '邮箱和密码不能为空' },
      })
    }

    if (!code) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '请输入验证码' },
      })
    }

    if (password.length < 8) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '密码需至少 8 位' },
      })
    }

    // 校验验证码
    const codeValid = await verifyCode(email, code, 'register')
    if (!codeValid) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CODE', message: '验证码无效或已过期' },
      })
    }

    // 检查邮箱是否已注册
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'EMAIL_EXISTS', message: '该邮箱已被注册' },
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
    })

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name },
        token,
      },
      message: '注册成功',
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
    })
  }
})

// ============================================================
// POST /auth/login — 登录（仅密码）
// ============================================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '邮箱和密码不能为空' },
      })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: '邮箱或密码错误' },
      })
    }

    if (!user.passwordHash) {
      return res.status(401).json({
        success: false,
        error: { code: 'NO_PASSWORD', message: '该账号未设置密码，请使用忘记密码功能重置' },
      })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: '邮箱或密码错误' },
      })
    }

    const hasProfile = !!(await prisma.studentProfile.findUnique({ where: { userId: user.id } }))
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name },
        token,
        hasProfile,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
    })
  }
})

// ============================================================
// POST /auth/forgot-password — 发送密码重置验证码
// ============================================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '请输入邮箱地址' },
      })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    // 频率限制
    const recentCode = await prisma.emailVerificationCode.findFirst({
      where: {
        email,
        purpose: 'password_reset',
        createdAt: { gt: new Date(Date.now() - 60 * 1000) },
      },
    })

    if (recentCode) {
      return res.status(429).json({
        success: false,
        error: { code: 'TOO_FAST', message: '请等待 60 秒后再重试' },
      })
    }

    // 不管邮箱是否存在都返回相同结果（安全考虑）
    if (!user) {
      return res.json({
        success: true,
        message: '如果该邮箱已注册，验证码将发送到你的邮箱',
      })
    }

    const code = await generateCode(email, 'password_reset', 15)
    const html = buildCodeEmail(code, 'password_reset')
    const result = await sendEmail(email, 'StudyPath AI - 密码重置验证码', html)

    // 开发模式：如果邮件发送失败，在控制台打印验证码
    if (!result.ok) {
      console.log(`[Dev] 🔑 密码重置验证码: ${email} -> ${code}`)
    }

    res.json({
      success: true,
      message: '如果该邮箱已注册，验证码将发送到你的邮箱',
    })
  } catch (err) {
    console.error('Forgot password error:', err)
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
    })
  }
})

// ============================================================
// POST /auth/reset-password — 用验证码重置密码
// ============================================================
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body

    if (!email || !code || !newPassword) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '请填写所有字段' },
      })
    }

    if (newPassword.length < 8) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '密码需至少 8 位' },
      })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CODE', message: '验证码不正确' },
      })
    }

    const valid = await verifyCode(email, code, 'password_reset')
    if (!valid) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CODE', message: '验证码无效或已过期' },
      })
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    })

    res.json({
      success: true,
      message: '密码重置成功，请重新登录',
    })
  } catch (err) {
    console.error('Reset password error:', err)
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
    })
  }
})

module.exports = router
