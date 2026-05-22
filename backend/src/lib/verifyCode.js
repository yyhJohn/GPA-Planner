// ============================================================
// 邮箱验证码服务
// ============================================================

const crypto = require('crypto')
const prisma = require('./prisma')

function hashCode(code) {
  return crypto.createHash('sha256').update(code).digest('hex')
}

/**
 * 生成 6 位验证码并存入数据库
 */
async function generateCode(email, purpose = 'register', ttlMinutes = 10) {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const codeHash = hashCode(code)
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000)

  await prisma.emailVerificationCode.create({
    data: { codeHash, email, purpose, expiresAt },
  })

  return code
}

/**
 * 验证码校验（成功后标记已使用）
 */
async function verifyCode(email, code, purpose = 'register') {
  const codeHash = hashCode(code)

  const record = await prisma.emailVerificationCode.findFirst({
    where: {
      email,
      codeHash,
      purpose,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!record) return false

  await prisma.emailVerificationCode.update({
    where: { id: record.id },
    data: { used: true },
  })

  return true
}

/**
 * 清理过期验证码
 */
async function cleanExpiredCodes() {
  return prisma.emailVerificationCode.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  })
}

module.exports = { generateCode, verifyCode, cleanExpiredCodes }
