// ============================================================
// API 请求封装
// ============================================================

const API_BASE = import.meta.env.VITE_API_BASE || '/v1'

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
  register: (email, password, name, code) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name, code }) }),

  login: (email, password, code) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, code }) }),

  sendCode: (email, purpose) =>
    request('/auth/send-code', { method: 'POST', body: JSON.stringify({ email, purpose }) }),

  forgotPassword: (email) =>
    request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (email, code, newPassword) =>
    request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ email, code, newPassword }) }),
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

  simulate: (reportId, availableCourses, targetGpa) =>
    request('/reports/simulate', { method: 'POST', body: JSON.stringify({ reportId, availableCourses, targetGpa }) }),
}

// ============================================================
// 课程
// ============================================================

export const courseService = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/courses${query ? `?${query}` : ''}`)
  },

  batchAdd: (courses) =>
    request('/courses/batch', { method: 'POST', body: JSON.stringify({ courses }) }),

  delete: (id) =>
    request(`/courses/${id}`, { method: 'DELETE' }),
}
