import { useState, useEffect } from 'react'
import { timelineService } from '../services'

const categoryColors = {
  academic: { bg: 'bg-blue-100', text: 'text-blue-700', label: '学术' },
  language: { bg: 'bg-green-100', text: 'text-green-700', label: '语言' },
  application: { bg: 'bg-purple-100', text: 'text-purple-700', label: '申请' },
  material: { bg: 'bg-orange-100', text: 'text-orange-700', label: '材料' },
  skill: { bg: 'bg-pink-100', text: 'text-pink-700', label: '技能' },
}

const priorityStyles = {
  high: { bg: 'bg-red-500', text: 'bg-red-100 text-red-700', label: '高' },
  medium: { bg: 'bg-yellow-500', text: 'bg-yellow-100 text-yellow-700', label: '中' },
  low: { bg: 'bg-gray-400', text: 'bg-gray-100 text-gray-700', label: '低' },
}

export default function TimelinePage() {
  const [timeline, setTimeline] = useState([])
  const [summary, setSummary] = useState('')
  const [keyDeadlines, setKeyDeadlines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedMonth, setExpandedMonth] = useState(null)

  useEffect(() => {
    timelineService.get()
      .then((res) => {
        setTimeline(res.data.timeline || [])
        setSummary(res.data.summary || '')
        setKeyDeadlines(res.data.key_deadlines || [])
        // Auto-expand current month
        const now = new Date()
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        const idx = (res.data.timeline || []).findIndex((m) => m.month === currentMonth)
        setExpandedMonth(idx >= 0 ? idx : 0)
      })
      .catch((err) => setError(err.message || '加载失败'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🗓️</div>
          <p className="text-gray-600">AI 正在生成时间线...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
          <a href="#/" className="text-blue-600 hover:underline mt-2 inline-block">返回首页</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <a href="#/" className="text-violet-200 hover:text-white text-sm mb-3 inline-block">← 返回首页</a>
          <h1 className="text-2xl md:text-3xl font-bold">🗓️ 申请时间线</h1>
          <p className="text-violet-200 mt-1">AI 为你定制的个性化留学申请规划</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Summary */}
        {summary && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">📋 规划概览</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Key Deadlines */}
        {keyDeadlines.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">⏰ 关键截止日期</h2>
            <div className="space-y-2">
              {keyDeadlines.map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                  <span className="text-lg">📌</span>
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{d.event}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    d.importance === 'high' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {d.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-400 to-indigo-400 hidden sm:block" />

          <div className="space-y-4">
            {timeline.map((month, mIdx) => {
              const isExpanded = expandedMonth === mIdx
              const taskCount = month.tasks?.length || 0
              const highCount = month.tasks?.filter((t) => t.priority === 'high').length || 0

              return (
                <div key={mIdx} className="relative sm:pl-14">
                  {/* Timeline dot */}
                  <div className="hidden sm:flex absolute left-3.5 top-5 w-5 h-5 rounded-full bg-violet-500 border-4 border-white shadow items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>

                  <div
                    className={`bg-white rounded-2xl shadow-sm border transition-all ${
                      isExpanded ? 'border-violet-300 shadow-md' : 'border-gray-100'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedMonth(isExpanded ? null : mIdx)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📅</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{month.label || month.month}</h3>
                          <p className="text-xs text-gray-500">{month.month}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {highCount > 0 && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">
                            {highCount} 个高优先
                          </span>
                        )}
                        <span className="text-xs text-gray-400">{taskCount} 项任务</span>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {isExpanded && month.tasks?.length > 0 && (
                      <div className="px-5 pb-4 space-y-2">
                        {month.tasks.map((task, tIdx) => {
                          const cat = categoryColors[task.category] || categoryColors.academic
                          const pri = priorityStyles[task.priority] || priorityStyles.medium

                          return (
                            <div
                              key={tIdx}
                              className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div className={`mt-1 w-2 h-2 rounded-full ${pri.bg} flex-shrink-0`} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="font-medium text-gray-900 text-sm">{task.title}</span>
                                    <span className={`px-1.5 py-0.5 rounded text-xs ${cat.bg} ${cat.text}`}>
                                      {cat.label}
                                    </span>
                                    <span className={`px-1.5 py-0.5 rounded text-xs ${pri.text}`}>
                                      {pri.label}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600">{task.description}</p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
