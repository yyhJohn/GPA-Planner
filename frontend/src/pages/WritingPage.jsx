import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function WritingPage() {
  const [type, setType] = useState('ps')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState('ps')

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const API_BASE = import.meta.env.VITE_API_BASE || '/v1'
      const resp = await fetch(`${API_BASE}/writing/inspire`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type }),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.error?.message || '生成失败')
      setResult(data.data)
      setActiveTab(type === 'both' ? 'ps' : type)
    } catch (err) {
      alert('生成失败：' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const ps = result?.ps || result?.ps_analysis ? result : null
  const cv = result?.cv || result?.cv_analysis ? result : null
  const hasPs = !!ps
  const hasCv = !!cv

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-24 pb-16 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">✍️ 文书灵感</h1>
          <p className="text-gray-600">AI 根据你的背景，生成 PS / CV 写作素材和建议</p>
        </div>

        {/* 选择类型 */}
        {!result && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-lg font-semibold mb-4">选择要生成的文书类型</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { value: 'ps', label: 'Personal Statement', icon: '📝', desc: '个人陈述素材和写作建议' },
                { value: 'cv', label: 'CV / 简历', icon: '📄', desc: '简历优化和 STAR 法则改写' },
                { value: 'both', label: 'PS + CV 一起', icon: '📋', desc: '同时生成，含互相呼应建议' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setType(opt.value)}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    type === opt.value
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{opt.icon}</div>
                  <div className="font-semibold text-gray-900">{opt.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium text-lg"
            >
              {loading ? 'AI 正在分析你的背景并生成文书素材...' : '✨ 开始生成'}
            </button>
            <p className="text-sm text-gray-400 text-center mt-3">
              请先填写学生背景档案，AI 将根据你的经历生成个性化建议
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && !result && (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600 text-lg">AI 正在分析你的背景...</p>
            <p className="text-sm text-gray-400 mt-2">通常需要 10-30 秒</p>
          </div>
        )}

        {/* 结果 */}
        {result && (
          <div className="space-y-6">
            {/* Tab 切换 */}
            {type === 'both' && (
              <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-sm">
                <button
                  onClick={() => setActiveTab('ps')}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                    activeTab === 'ps' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  📝 Personal Statement
                </button>
                <button
                  onClick={() => setActiveTab('cv')}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                    activeTab === 'cv' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  📄 CV / 简历
                </button>
              </div>
            )}

            {/* PS 内容 */}
            {(activeTab === 'ps' && hasPs) && <PSContent data={result} />}

            {/* CV 内容 */}
            {(activeTab === 'cv' && hasCv) && <CVContent data={result} />}

            {/* 交叉建议 */}
            {result?.cross_tips && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-2">🔗 PS & CV 互相呼应</h3>
                <p className="text-amber-800 whitespace-pre-line">{result.cross_tips}</p>
              </div>
            )}

            {/* 重新生成 */}
            <div className="text-center">
              <button
                onClick={() => {
                  setResult(null)
                  setActiveTab('ps')
                }}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                🔄 重新生成
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

// ============================================================
// PS 内容组件
// ============================================================
function PSContent({ data }) {
  const ps = data.ps || data
  const strengths = ps.core_strengths || ps.p_analysis?.core_strengths || []
  const angles = ps.unique_angles || ps.p_analysis?.unique_angles || []
  const weaknesses = ps.potential_weaknesses || ps.p_analysis?.potential_weaknesses || []
  const hooks = ps.hook_suggestions || ps.narrative_framework?.hook_suggestions || []
  const arc = ps.story_arc || ps.narrative_framework?.story_arc || ''
  const connection = ps.connection_to_future || ps.narrative_framework?.connection_to_future || ''
  const paragraphs = ps.paragraphs || []
  const dos = ps.dos_and_donts?.dos || []
  const donts = ps.dos_and_donts?.donts || []
  const regionTips = ps.region_tips || {}

  return (
    <div className="space-y-6">
      {/* 核心优势 */}
      {strengths.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-3">💪 你的核心优势</h3>
          <ul className="space-y-2">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
          {angles.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium text-gray-700 mb-2">🎯 独特切入角度</h4>
              <ul className="space-y-1">
                {angles.map((a, i) => (
                  <li key={i} className="text-gray-600">• {a}</li>
                ))}
              </ul>
            </div>
          )}
          {weaknesses.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium text-gray-700 mb-2">⚠️ 可改进点</h4>
              <ul className="space-y-1">
                {weaknesses.map((w, i) => (
                  <li key={i} className="text-gray-600">• {w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 叙事框架 */}
      {hooks.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-3">🎣 开头方案</h3>
          <div className="space-y-4">
            {hooks.map((h, i) => (
              <div key={i} className="border rounded-xl p-4">
                <h4 className="font-medium text-blue-700 mb-1">{h.title}</h4>
                <p className="text-gray-600 text-sm mb-2">{h.description}</p>
                {h.example && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 italic">
                    "{h.example}"
                  </div>
                )}
              </div>
            ))}
          </div>
          {arc && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium text-gray-700 mb-2">📖 建议叙事线</h4>
              <p className="text-gray-600">{arc}</p>
            </div>
          )}
          {connection && (
            <div className="mt-3">
              <h4 className="font-medium text-gray-700 mb-2">🔗 过去 → 未来 的串联</h4>
              <p className="text-gray-600">{connection}</p>
            </div>
          )}
        </div>
      )}

      {/* 段落建议 */}
      {paragraphs.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">📝 各段写作建议</h3>
          <div className="space-y-4">
            {paragraphs.map((p, i) => (
              <div key={i} className="border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <h4 className="font-medium">{p.section}</h4>
                </div>
                <p className="text-sm text-gray-500 mb-2">目的：{p.purpose}</p>
                {p.key_points && (
                  <ul className="text-sm text-gray-600 space-y-1 mb-2">
                    {p.key_points.map((k, j) => (
                      <li key={j}>• {k}</li>
                    ))}
                  </ul>
                )}
                {p.tips && <p className="text-sm text-blue-600 mb-2">💡 {p.tips}</p>}
                {p.sample && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 italic">
                    "{p.sample}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Do's and Don'ts */}
      {(dos.length > 0 || donts.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dos.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">✅ 应该做</h3>
              <ul className="space-y-2">
                {dos.map((d, i) => (
                  <li key={i} className="text-green-800">• {d}</li>
                ))}
              </ul>
            </div>
          )}
          {donts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-3">❌ 不要做</h3>
              <ul className="space-y-2">
                {donts.map((d, i) => (
                  <li key={i} className="text-red-800">• {d}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 地区偏好 */}
      {Object.keys(regionTips).length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-3">🌍 不同地区文书偏好</h3>
          <div className="space-y-3">
            {Object.entries(regionTips).map(([region, tip]) => (
              <div key={region} className="flex items-start gap-3">
                <span className="font-medium text-gray-700 w-12 shrink-0 uppercase">{region}：</span>
                <span className="text-gray-600">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// CV 内容组件
// ============================================================
function CVContent({ data }) {
  const cv = data.cv || data
  const strengths = cv.current_strengths || cv.cv_analysis?.current_strengths || []
  const gaps = cv.gaps_to_fill || cv.cv_analysis?.gaps_to_fill || []
  const order = cv.recommended_order || cv.cv_analysis?.recommended_order || []
  const sections = cv.sections || []
  const verbs = cv.action_verbs || []
  const tips = cv.formatting_tips || []
  const summary = cv.sample_summary || ''

  return (
    <div className="space-y-6">
      {/* CV 分析 */}
      {(strengths.length > 0 || gaps.length > 0) && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-3">📊 CV 现状分析</h3>
          {strengths.length > 0 && (
            <div className="mb-3">
              <h4 className="font-medium text-green-700 mb-2">✅ 现有亮点</h4>
              <ul className="space-y-1">
                {strengths.map((s, i) => (
                  <li key={i} className="text-gray-600">• {s}</li>
                ))}
              </ul>
            </div>
          )}
          {gaps.length > 0 && (
            <div className="mb-3">
              <h4 className="font-medium text-amber-700 mb-2">⚠️ 需要补充</h4>
              <ul className="space-y-1">
                {gaps.map((g, i) => (
                  <li key={i} className="text-gray-600">• {g}</li>
                ))}
              </ul>
            </div>
          )}
          {order.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">📋 建议板块顺序</h4>
              <div className="flex flex-wrap gap-2">
                {order.map((o, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {i + 1}. {o}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 板块内容 */}
      {sections.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">📝 各板块优化建议</h3>
          <div className="space-y-4">
            {sections.map((sec, i) => (
              <div key={i} className="border rounded-xl p-4">
                <h4 className="font-medium text-blue-700 mb-3 text-lg">{sec.section}</h4>
                <div className="space-y-3">
                  {(sec.items || []).map((item, j) => (
                    <div key={j} className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">{item.title}</h5>
                      {item.bullet_points && (
                        <ul className="space-y-1 mb-2">
                          {item.bullet_points.map((bp, k) => (
                            <li key={k} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-blue-400 mt-0.5">▸</span>
                              <span>{bp}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {item.impact_statement && (
                        <p className="text-sm text-green-700 bg-green-50 rounded px-3 py-1.5">
                          💪 {item.impact_statement}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 强力动词 */}
      {verbs.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-3">💪 推荐使用的强力动词</h3>
          <div className="flex flex-wrap gap-2">
            {verbs.map((v, i) => (
              <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 格式建议 */}
      {tips.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-3">📐 格式建议</h3>
          <ul className="space-y-2">
            {tips.map((t, i) => (
              <li key={i} className="text-gray-600">• {t}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 个人简介示例 */}
      {summary && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">✨ 个人简介示例</h3>
          <p className="text-blue-800 italic">"{summary}"</p>
        </div>
      )}
    </div>
  )
}
