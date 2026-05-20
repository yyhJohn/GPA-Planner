// ============================================================
// API 请求封装
// ============================================================

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/v1'

class ApiError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token')

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config)
  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(data.error?.code || 'UNKNOWN', data.error?.message || '请求失败')
  }

  return data
}

// ============================================================
// 认证
// ============================================================

export const authService = {
  register: (email, password, name) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) }),

  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
}

// ============================================================
// 学生背景
// ============================================================

export const profileService = {
  get: () => request('/profile'),

  create: (data) =>
    request('/profile', { method: 'POST', body: JSON.stringify(data) }),

  update: (data) =>
    request('/profile', { method: 'PUT', body: JSON.stringify(data) }),
}

// ============================================================
// 报告
// ============================================================

export const reportService = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/reports${query ? `?${query}` : ''}`)
  },

  get: (id) => request(`/reports/${id}`),

  generateFree: (targetGpa) =>
    request('/reports/free', { method: 'POST', body: JSON.stringify({ targetGpa }) }),

  generateFull: (freeReportId) =>
    request('/reports/full', { method: 'POST', body: JSON.stringify({ freeReportId }) }),
}
