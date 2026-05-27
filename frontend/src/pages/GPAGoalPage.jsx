import { useState } from 'react'
import { gpaService } from '../services'

export default function GPAGoalPage() {
  const [targetGpa, setTargetGpa] = useState('3.5')
  const [remainingCredits, setRemainingCredits] = useState('30')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await gpaService.goal({
        targetGpa: parseFloat(targetGpa),
        remainingCredits: parseFloat(remainingCredits),
      })
      setResult(res.data)
    } catch (err) {
      setError(err.message || '分析失败')
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return { bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-500', label: '轻松' }
      case 'moderate': return { bg: 'bg-yellow-100', text: 'text-yellow-700', bar: 'bg-yellow-500', label: '中等' }
      case 'hard': return { bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-500', label: '困难' }
      case 'impossible': return { bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500', label: '不可能' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', bar: 'bg-gray-500', label: '未知' }
    }
  }

  const difficultyPercent = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 25
      case 'moderate': return 50
      case 'hard': return 75
      case 'impossible': return 100
      default: return 0
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <a href="#/" className="text-indigo-200 hover:text-white text-sm mb-3 inline-block">← 返回首页</a>
          <h1 className="text-2xl md:text-3xl font-bold">🎯 GPA 目标反推</h1>
          <p className="text-indigo-200 mt-1">输入目标 GPA，计算剩余课程需要的最低分数</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Input */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">设定目标</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">目标 GPA（4.0 制）</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="4.0"
                value={targetGpa}
                onChange={(e) => setTargetGpa(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="3.5"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">剩余学分数</label>
              <input
                type="number"
                step="1"
                min="1"
                value={remainingCredits}
                onChange={(e) => setRemainingCredits(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="30"
              />
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-bold text-sm transition-colors ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {loading ? '⏳ 分析中...' : '🔍 开始分析'}
          </button>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        {/* Results */}
        {result && (
          <>
            {/* Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">分析结果</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">{result.current.gpa}</p>
                  <p className="text-xs text-blue-600">当前 GPA</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-purple-700">{result.target.gpa}</p>
                  <p className="text-xs text-purple-600">目标 GPA</p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-indigo-700">{result.analysis.requiredAvgGpa}</p>
                  <p className="text-xs text-indigo-600">需平均绩点</p>
                </div>
                <div className={`rounded-xl p-4 text-center ${getDifficultyColor(result.analysis.difficulty).bg}`}>
                  <p className={`text-2xl font-bold ${getDifficultyColor(result.analysis.difficulty).text}`}>
                    {getDifficultyColor(result.analysis.difficulty).label}
                  </p>
                  <p className="text-xs text-gray-600">难度评估</p>
                </div>
              </div>

              {/* Difficulty bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>轻松</span>
                  <span>困难</span>
                  <span>不可能</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${getDifficultyColor(result.analysis.difficulty).bar}`}
                    style={{ width: `${difficultyPercent(result.analysis.difficulty)}%` }}
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">需要每门课至少达到：</span>
                  <span className="font-bold text-indigo-700 ml-1">{result.analysis.requiredGrade}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  差距：{result.analysis.gap > 0 ? '+' : ''}{result.analysis.gap} GPA
                </p>
              </div>
            </div>

            {/* Course Details */}
            {result.courseDetails?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">课程详情</h2>
                <div className="space-y-3">
                  {result.courseDetails.map((c, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${
                      c.status === 'fixed' ? 'bg-green-50 border-green-200' :
                      c.status === 'required' ? 'bg-orange-50 border-orange-200' :
                      c.feasibility === 'feasible' ? 'bg-blue-50 border-blue-200' :
                      'bg-gray-50 border-gray-200'
                    }`}>
                      {c.scenario ? (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{c.scenario}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                              c.feasibility === 'feasible' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                            }`}>
                              {c.requiredGrade}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{c.description}</p>
                          <p className="text-xs text-gray-500 mt-1">需要平均绩点：{c.requiredAvgPoint}</p>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{c.courseName}</span>
                            <span className="text-sm text-gray-500">{c.credit} 学分</span>
                          </div>
                          {c.expectedScore && (
                            <p className="text-sm text-gray-600">
                              预期成绩：{c.expectedScore}（绩点 {c.expectedPoint}）
                              {c.contribution !== undefined && ` · 贡献：${c.contribution}`}
                            </p>
                          )}
                          {c.requiredGrade && (
                            <p className="text-sm text-orange-600 font-medium">
                              需要至少：{c.requiredGrade}（绩点 {c.requiredAvgPoint}）
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">💡 建议</h2>
                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-indigo-500 mt-0.5">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
