// ============================================================
// 工具函数
// ============================================================

/**
 * GPA 计算（等级制 → 4.0 制）
 */
export function calcGPA(courses, scale = 4.0) {
  const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0,
  }

  let totalPoints = 0
  let totalCredits = 0

  courses.forEach((course) => {
    if (!course.credit || !course.score) return
    const credit = parseFloat(course.credit)
    let point

    if (course.scoreType === 'percentage') {
      const score = parseFloat(course.score)
      if (score >= 90) point = 4.0
      else if (score >= 85) point = 3.7
      else if (score >= 82) point = 3.3
      else if (score >= 78) point = 3.0
      else if (score >= 75) point = 2.7
      else if (score >= 72) point = 2.3
      else if (score >= 68) point = 2.0
      else if (score >= 64) point = 1.7
      else if (score >= 60) point = 1.0
      else point = 0.0
    } else {
      point = gradePoints[course.score] ?? null
    }

    if (point !== null && !isNaN(credit)) {
      totalPoints += point * credit
      totalCredits += credit
    }
  })

  if (totalCredits === 0) return 0
  const gpa = totalPoints / totalCredits
  return Math.round(gpa * 100) / 100
}

/**
 * GPA 制式转换
 */
export function convertGPA(gpa, fromScale, toScale) {
  if (fromScale === toScale) return gpa

  // 先转成百分制
  let percentage
  if (fromScale === '4.0') {
    percentage = gpa * 25
  } else if (fromScale === '5.0') {
    percentage = gpa * 20
  } else {
    percentage = gpa
  }

  // 从百分制转目标制式
  if (toScale === '4.0') {
    return Math.round((percentage / 25) * 100) / 100
  } else if (toScale === '5.0') {
    return Math.round((percentage / 20) * 100) / 100
  }
  return Math.round(percentage * 100) / 100
}

/**
 * 格式化金额（分 → 元）
 */
export function formatPrice(cents) {
  return `¥${(cents / 100).toFixed(2)}`
}

/**
 * 格式化日期
 */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 * 防抖
 */
export function debounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * 存储 token
 */
export function setToken(token) {
  localStorage.setItem('token', token)
}

export function getToken() {
  return localStorage.getItem('token')
}

export function removeToken() {
  localStorage.removeItem('token')
}

export function isLoggedIn() {
  return !!getToken()
}
