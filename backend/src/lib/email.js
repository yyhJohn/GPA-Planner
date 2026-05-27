// ============================================================
// 邮件发送服务（Resend 主 + Brevo SMTP 备选）
// ============================================================

const nodemailer = require('nodemailer')

const RESEND_API_KEY = process.env.RESEND_API_KEY
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@gpa-planner.com'

// Brevo SMTP 备选
const brevoTransporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN || 'ac49ac001@smtp-brevo.com',
    pass: process.env.BREVO_SMTP_PASSWORD || '',
  },
})

/**
 * 通过 Resend API 发送
 */
async function sendViaResend(to, subject, html) {
  if (!RESEND_API_KEY) {
    return { ok: false, reason: 'no_api_key' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('[Email] Resend error:', err)
      return { ok: false, reason: 'api_error' }
    }

    return { ok: true }
  } catch (error) {
    console.error('[Email] Resend failed:', error.message)
    return { ok: false, reason: 'network_error' }
  }
}

/**
 * 通过 Brevo SMTP 发送（备选）
 */
async function sendViaBrevo(to, subject, html) {
  if (!process.env.BREVO_SMTP_PASSWORD) {
    return { ok: false, reason: 'no_brevo_config' }
  }

  try {
    await brevoTransporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    })
    return { ok: true }
  } catch (error) {
    console.error('[Email] Brevo failed:', error.message)
    return { ok: false, reason: 'brevo_error' }
  }
}

/**
 * 发送邮件（Resend 优先，失败自动切 Brevo）
 */
async function sendEmail(to, subject, html) {
  // 1. 先试 Resend
  const resendResult = await sendViaResend(to, subject, html)
  if (resendResult.ok) {
    console.log(`[Email] ✅ Sent via Resend → ${to}`)
    return { ok: true, provider: 'resend' }
  }

  // 2. Resend 失败，切 Brevo
  console.log(`[Email] Resend 失败(${resendResult.reason})，切换到 Brevo...`)
  const brevoResult = await sendViaBrevo(to, subject, html)
  if (brevoResult.ok) {
    console.log(`[Email] ✅ Sent via Brevo → ${to}`)
    return { ok: true, provider: 'brevo' }
  }

  // 3. 都失败了
  console.error(`[Email] ❌ 所有服务均失败 → ${to}`)
  console.log(`[Email] 验证码邮件内容: ${subject}`)
  return { ok: false, reason: 'all_failed' }
}

function buildCodeEmail(code, purpose = 'register') {
  const titles = {
    register: '注册验证码',
    login: '登录验证码',
    password_reset: '密码重置验证码',
  }
  const title = titles[purpose] || '验证码'

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 420px; margin: 0 auto; padding: 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 40px;">📚</span>
        <h1 style="color: #1e293b; font-size: 20px; margin: 8px 0 0;">StudyPath AI</h1>
      </div>
      <div style="background: #f8fafc; border-radius: 12px; padding: 24px; text-align: center;">
        <p style="color: #475569; margin: 0 0 16px; font-size: 14px;">${title}</p>
        <div style="background: white; border-radius: 8px; padding: 16px; display: inline-block;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0f172a; font-family: monospace;">${code}</span>
        </div>
        <p style="color: #94a3b8; font-size: 12px; margin: 16px 0 0;">验证码 10 分钟内有效，请勿泄露给他人。</p>
      </div>
      <p style="color: #cbd5e1; font-size: 11px; text-align: center; margin-top: 20px;">
        如果你没有请求此验证码，请忽略此邮件。
      </p>
    </div>
  `
}

module.exports = { sendEmail, buildCodeEmail }
