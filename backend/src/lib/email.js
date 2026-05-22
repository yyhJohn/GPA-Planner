// ============================================================
// 邮件发送服务（使用 Resend API）
// ============================================================

const RESEND_API_KEY = process.env.RESEND_API_KEY
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@gpa-planner.com'

async function sendEmail(to, subject, html) {
  if (!RESEND_API_KEY) {
    console.log(`[Email] No RESEND_API_KEY set, logging email instead:`)
    console.log(`  To: ${to}`)
    console.log(`  Subject: ${subject}`)
    return { ok: false, reason: 'no_api_key' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to,
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('[Email] Resend error:', err)
      return { ok: false, reason: 'api_error' }
    }

    console.log(`[Email] ✅ Sent to ${to} | subject: ${subject}`)
    return { ok: true }
  } catch (error) {
    console.error('[Email] Send failed:', error.message)
    return { ok: false, reason: 'network_error' }
  }
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
        <span style="font-size: 40px;">🎓</span>
        <h1 style="color: #1e293b; font-size: 20px; margin: 8px 0 0;">GPA Planner</h1>
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
