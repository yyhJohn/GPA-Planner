// ============================================================
// 简易速率限制中间件（内存存储，生产环境建议用 Redis）
// ============================================================

const store = new Map()

// 定期清理过期记录（每 5 分钟）
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 5 * 60 * 1000)

const RULES = {
  'POST /v1/auth':       { windowMs: 15 * 60 * 1000, max: 10 },   // 15 分钟 10 次
  'POST /v1/reports/free': { windowMs: 24 * 60 * 60 * 1000, max: 3 }, // 每天 3 次
  'POST /v1/reports/full': { windowMs: 60 * 60 * 1000, max: 5 },   // 每小时 5 次
  'POST /v1/reports/simulate': { windowMs: 60 * 60 * 1000, max: 10 }, // 每小时 10 次
  'default':              { windowMs: 60 * 1000, max: 60 },        // 每分钟 60 次
}

function getRule(path, method) {
  // 精确匹配
  const exactKey = `${method} ${path}`
  if (RULES[exactKey]) return RULES[exactKey]

  // 前缀匹配
  for (const [pattern, rule] of Object.entries(RULES)) {
    if (pattern === 'default') continue
    const [ruleMethod, rulePath] = pattern.split(' ')
    if (method === ruleMethod && path.startsWith(rulePath)) return rule
  }

  return RULES.default
}

function rateLimitMiddleware(req, res, next) {
  // 用 IP + userId（如有）作为 key
  const userId = req.userId || 'anon'
  const ip = req.ip || req.connection?.remoteAddress || 'unknown'
  const rule = getRule(req.path, req.method)
  const key = `${ip}:${userId}:${req.path}`

  const now = Date.now()
  let entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + rule.windowMs }
    store.set(key, entry)
  }

  entry.count++

  // 设置响应头
  res.set('X-RateLimit-Limit', String(rule.max))
  res.set('X-RateLimit-Remaining', String(Math.max(0, rule.max - entry.count)))
  res.set('X-RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)))

  if (entry.count > rule.max) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    res.set('Retry-After', String(retryAfter))
    return res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: `请求过于频繁，请 ${retryAfter} 秒后重试`,
      },
    })
  }

  next()
}

module.exports = rateLimitMiddleware
