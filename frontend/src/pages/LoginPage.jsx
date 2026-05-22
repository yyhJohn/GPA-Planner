import { useState, useEffect, useRef } from 'react'
import { authService } from '../services'
import { setToken } from '../utils'

// 页面模式：login / register / forgot
const MODES = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT: 'forgot',
  RESET: 'reset',
}

export default function LoginPage() {
  const [mode, setMode] = useState(MODES.LOGIN)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [loginMethod, setLoginMethod] = useState('password') // password / code
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 验证码倒计时
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const startCountdown = () => {
    setCountdown(60)
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // 发送验证码
  const handleSendCode = async () => {
    if (!email) {
      setError('请先输入邮箱')
      return
    }
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const purpose = mode === MODES.REGISTER ? 'register' :
                      mode === MODES.FORGOT ? 'password_reset' : 'login'
      await authService.sendCode(email, purpose)
      setSuccess('验证码已发送到你的邮箱')
      startCountdown()
    } catch (err) {
      setError(err.message || '发送失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 登录
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authService.login(
        email,
        loginMethod === 'password' ? password : undefined,
        loginMethod === 'code' ? code : undefined,
      )
      setToken(res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      if (res.data.hasProfile) {
        window.location.hash = '#/reports'
      } else {
        window.location.hash = '#/profile'
      }
    } catch (err) {
      setError(err.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  // 注册
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authService.register(email, password, name, code)
      setToken(res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      window.location.hash = '#/profile'
    } catch (err) {
      setError(err.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  // 忘记密码 - 发送重置码
  const handleForgot = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authService.forgotPassword(email)
      setSuccess('如果该邮箱已注册，验证码已发送')
      setMode(MODES.RESET)
      startCountdown()
    } catch (err) {
      setError(err.message || '发送失败')
    } finally {
      setLoading(false)
    }
  }

  // 重置密码
  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authService.resetPassword(email, code, password)
      setSuccess('密码重置成功！请重新登录')
      setMode(MODES.LOGIN)
      setPassword('')
      setCode('')
    } catch (err) {
      setError(err.message || '重置失败')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (m) => {
    setMode(m)
    setError('')
    setSuccess('')
    setCode('')
    setPassword('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="#" className="inline-flex items-center gap-2">
            <span className="text-3xl">🎓</span>
            <span className="text-2xl font-bold text-gray-900">GPA Planner</span>
          </a>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Tab 切换 */}
          {mode !== MODES.FORGOT && mode !== MODES.RESET && (
            <div className="flex mb-6">
              <button
                onClick={() => switchMode(MODES.LOGIN)}
                className={`flex-1 py-2 text-center font-medium border-b-2 transition-colors ${
                  mode === MODES.LOGIN ? 'border-blue-600 text-blue-600' : 'border-gray-200 text-gray-500'
                }`}
              >
                登录
              </button>
              <button
                onClick={() => switchMode(MODES.REGISTER)}
                className={`flex-1 py-2 text-center font-medium border-b-2 transition-colors ${
                  mode === MODES.REGISTER ? 'border-blue-600 text-blue-600' : 'border-gray-200 text-gray-500'
                }`}
              >
                注册
              </button>
            </div>
          )}

          {/* 错误/成功提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {success}
            </div>
          )}

          {/* ========== 登录 ========== */}
          {mode === MODES.LOGIN && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* 登录方式切换 */}
              <div className="flex gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => setLoginMethod('password')}
                  className={`px-3 py-1.5 rounded-full transition-colors ${
                    loginMethod === 'password'
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  密码登录
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('code')}
                  className={`px-3 py-1.5 rounded-full transition-colors ${
                    loginMethod === 'code'
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  验证码登录
                </button>
              </div>

              {loginMethod === 'password' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="输入密码"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <div className="text-right mt-1">
                    <button
                      type="button"
                      onClick={() => switchMode(MODES.FORGOT)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      忘记密码？
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">验证码</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6 位验证码"
                      maxLength={6}
                      required
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none tracking-widest text-center font-mono text-lg"
                    />
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={countdown > 0 || loading}
                      className={`px-4 py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                        countdown > 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      {countdown > 0 ? `${countdown}s` : '发送验证码'}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  loading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loading ? '处理中...' : '登录'}
              </button>
            </form>
          )}

          {/* ========== 注册 ========== */}
          {mode === MODES.REGISTER && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="你的名字"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* 验证码 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱验证码</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6 位验证码"
                    maxLength={6}
                    required
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none tracking-widest text-center font-mono text-lg"
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={countdown > 0 || loading}
                    className={`px-4 py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                      countdown > 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    {countdown > 0 ? `${countdown}s` : '发送验证码'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 8 位，含大小写字母和数字"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  loading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {loading ? '处理中...' : '注册'}
              </button>
            </form>
          )}

          {/* ========== 忘记密码 ========== */}
          {mode === MODES.FORGOT && (
            <div>
              <button
                onClick={() => switchMode(MODES.LOGIN)}
                className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
              >
                ← 返回登录
              </button>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">忘记密码</h2>
              <p className="text-sm text-gray-500 mb-4">输入你的邮箱，我们将发送重置验证码</p>
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    loading
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {loading ? '发送中...' : '发送重置验证码'}
                </button>
              </form>
            </div>
          )}

          {/* ========== 重置密码 ========== */}
          {mode === MODES.RESET && (
            <div>
              <button
                onClick={() => switchMode(MODES.FORGOT)}
                className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
              >
                ← 重新发送
              </button>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">重置密码</h2>
              <p className="text-sm text-gray-500 mb-4">
                验证码已发送到 <span className="font-medium text-gray-700">{email}</span>
              </p>
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">验证码</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6 位验证码"
                      maxLength={6}
                      required
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none tracking-widest text-center font-mono text-lg"
                    />
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={countdown > 0 || loading}
                      className={`px-4 py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                        countdown > 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      {countdown > 0 ? `${countdown}s` : '重新发送'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">新密码</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="至少 8 位"
                    required
                    minLength={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    loading
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {loading ? '重置中...' : '重置密码'}
                </button>
              </form>
            </div>
          )}

          {/* 底部切换链接 */}
          {mode === MODES.LOGIN && (
            <p className="text-center text-sm text-gray-500 mt-6">
              还没有账号？
              <button onClick={() => switchMode(MODES.REGISTER)} className="text-blue-600 hover:text-blue-700 ml-1">
                立即注册
              </button>
            </p>
          )}
          {mode === MODES.REGISTER && (
            <p className="text-center text-sm text-gray-500 mt-6">
              已有账号？
              <button onClick={() => switchMode(MODES.LOGIN)} className="text-blue-600 hover:text-blue-700 ml-1">
                去登录
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
