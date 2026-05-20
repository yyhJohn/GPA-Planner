import { useState, useEffect } from 'react'
import { reportService } from '../services'

// Mock data for the report (fallback)
const mockReport = {
  id: 'rpt_20260519_001',
  createdAt: '2026-05-19',
  studentName: '张三',

  // 综合竞争力评分
  overallScore: 65,

  // 维度评分
  dimensionScores: [
    { label: 'GPA 学术', score: 70, icon: '📊', desc: '985 背景下 3.28 处于中等偏上水平' },
    { label: '语言能力', score: 75, icon: '🌍', desc: '雅思 7.0 满足大部分项目要求' },
    { label: '项目经历', score: 45, icon: '💻', desc: '仅有课程项目，缺少深度项目经验' },
    { label: '实习/科研', score: 35, icon: '🔬', desc: '暂无实习和科研经历' },
    { label: '课程匹配', score: 72, icon: '📚', desc: 'CS 基础课程覆盖较好' },
    { label: '综合背景', score: 58, icon: '🎯', desc: '985 背景加分，但经历偏少' },
  ],

  // GPA 分析
  gpaAnalysis: {
    current: 3.28,
    scale: 4.0,
    ranking: '前 15%',
    majorGpa: 3.52,
    strengths: [
      '核心课 GPA (3.52) 高于总体 GPA (3.28)',
      '编程类课程整体表现优异',
      '大二以来成绩呈上升趋势',
    ],
    weaknesses: [
      '数学类课程（高数、线代）偏低，拖累整体 GPA',
      '大一上学期成绩不理想，拉低了均分',
    ],
    contribution: [
      { course: '高等数学 A', credit: 4, score: 'B', impact: -0.12, negative: true },
      { course: '线性代数', credit: 3, score: 'B-', impact: -0.15, negative: true },
      { course: '数据结构', credit: 4, score: 'A', impact: +0.10, negative: false },
      { course: '操作系统', credit: 3, score: 'A-', impact: +0.06, negative: false },
      { course: '计算机网络', credit: 3, score: 'A', impact: +0.09, negative: false },
      { course: '大学英语', credit: 2, score: 'B+', impact: -0.02, negative: true },
    ],
  },

  // 课程匹配度
  courseMatching: {
    matchRate: 72,
    covered: ['数据结构', '操作系统', '计算机网络', '数据库', '编程语言'],
    missing: ['机器学习', '深度学习', '数据挖掘', '统计学习'],
    suggestion: '建议在剩余学期补充 1-2 门 AI/ML 相关课程，提高与目标专业的匹配度。',
  },

  // 推荐申请方向
  directions: [
    { name: '数据科学', match: '高匹配', reason: 'CS 背景 + 编程能力强，补充统计课程后竞争力显著提升' },
    { name: '人工智能', match: '中匹配', reason: '需要补充 ML/DL 先修课，有项目经历会更佳' },
    { name: '计算机科学（通识）', match: '高匹配', reason: '专业对口，课程覆盖全面' },
    { name: '商业分析', match: '中匹配', reason: '技术背景有优势，需补充商科基础知识' },
  ],

  // 学校推荐
  schools: {
    sprint: [
      { name: 'UCL', program: 'MSc Data Science', note: 'GPA 处于往年录取者下四分位，需要经历补充' },
      { name: '香港大学', program: 'MSc Computer Science', note: '985 背景有优势，竞争激烈' },
      { name: 'NUS', program: 'MSc in AI', note: '新加坡 AI 项目热门，建议有相关项目经历' },
    ],
    match: [
      { name: '爱丁堡大学', program: 'MSc Data Science', note: '往年录取者 GPA 多在 3.2-3.5 区间' },
      { name: '香港中文大学', program: 'MSc Computer Science', note: 'CUHK CS 对 985 较友好' },
      { name: 'NTU', program: 'MSc Artificial Intelligence', note: 'NTU AI 项目近年扩招' },
    ],
    safe: [
      { name: '布里斯托大学', program: 'MSc Data Science', note: '录取门槛相对宽松，QS 前 100' },
      { name: '香港城市大学', program: 'MSc Computer Science', note: '稳妥选择，奖学金机会多' },
      { name: '曼彻斯特大学', program: 'MSc ACS', note: '项目规模大，录取人数多' },
    ],
  },

  // 未来计划
  plan3Months: [
    { task: '选修「机器学习」和「数据可视化」课程', deadline: '本学期选课截止前', priority: '高' },
    { task: '开始雅思备考，目标 7.5（小分 7.0）', deadline: '3 个月内', priority: '高' },
    { task: '找一段 AI 相关实习（大厂优先）', deadline: '暑假前', priority: '高' },
    { task: '完成一个 ML/DL 个人项目', deadline: '3 个月内', priority: '中' },
  ],
  plan6Months: [
    { task: '刷高 GPA 至 3.4+', deadline: '本学期结束', priority: '高' },
    { task: '考出雅思 7.5+', deadline: '大三下开学前', priority: '高' },
    { task: '开始准备 PS 和 CV 初稿', deadline: '大三下学期', priority: '中' },
    { task: '联系 2-3 位教授获取推荐信', deadline: '大四开学前', priority: '中' },
    { task: '确定选校名单（8-12 所）', deadline: '大四上开学前', priority: '高' },
    { task: '提交第一轮申请', deadline: '大四上 10-12 月', priority: '高' },
  ],

  // 风险提醒
  risks: [
    { level: '高', text: '数学类课程 GPA 偏低，部分数据科学项目有数学科目最低分要求', action: '如有机会重修高数/线代，建议重修拉高分数' },
    { level: '中', text: '缺少实习和科研经历，申请材料竞争力不足', action: '尽快找一段相关实习，或参与导师科研项目' },
    { level: '中', text: '雅思写作小分 6.5，部分英国项目要求 7.0', action: '针对性训练写作，必要时考虑 UKVI 雅思' },
    { level: '低', text: '选校梯度合理，但冲刺校竞争激烈', action: '确保稳妥校申请材料完整，冲刺校作为加分项' },
  ],
}

// Score ring component
function ScoreRing({ score, size = 120, strokeWidth = 10, color = '#3B82F6' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <span className="absolute text-3xl font-bold text-gray-900">{score}</span>
    </div>
  )
}

// Dimension bar component
function DimensionBar({ label, score, icon, desc }) {
  const getColor = (s) => s >= 70 ? 'bg-green-500' : s >= 50 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <span className="text-2xl mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-gray-900 text-sm">{label}</span>
          <span className="text-sm font-bold text-gray-700">{score}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
          <div className={`h-2 rounded-full ${getColor(score)} transition-all duration-1000`} style={{ width: `${score}%` }} />
        </div>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  )
}

// Section wrapper
function Section({ icon, title, subtitle, children, locked = false }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span>{icon}</span> {title}
        </h3>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className={`p-5 ${locked ? 'relative' : ''}`}>
        {locked && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
            <span className="text-4xl mb-3">🔒</span>
            <p className="text-gray-600 font-medium mb-4">解锁完整报告查看此内容</p>
            <a href="#pricing" className="btn-primary text-sm">解锁完整报告 ¥19.9</a>
          </div>
        )}
        <div className={locked ? 'blur-[3px] opacity-50' : ''}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default function ReportPage() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const hash = window.location.hash
    const match = hash.match(/#\/report\/(.+)/)
    const reportId = match ? match[1] : null

    if (reportId) {
      reportService.get(reportId)
        .then((res) => {
          const r = res.data.report
          const content = r.content || {}
          setReport({
            id: r.id,
            createdAt: new Date(r.createdAt).toLocaleDateString('zh-CN'),
            studentName: '同学',
            overallScore: r.competitivenessScore || content.competitiveness_score?.total || 0,
            dimensionScores: [
              { label: 'GPA 学术', score: content.competitiveness_score?.gpa || 70, icon: '📊', desc: '' },
              { label: '语言能力', score: content.competitiveness_score?.language || 75, icon: '🌍', desc: '' },
              { label: '项目经历', score: content.competitiveness_score?.experience || 45, icon: '💻', desc: '' },
              { label: '课程匹配', score: content.course_matching?.match_rate || 72, icon: '📚', desc: '' },
            ],
            gpaAnalysis: content.gpa_analysis || mockReport.gpaAnalysis,
            courseMatching: content.course_matching || mockReport.courseMatching,
            directions: content.direction_suggestions || mockReport.directions,
            schools: content.schools || mockReport.schools,
            plan3Months: content.plan_3_months || mockReport.plan3Months,
            plan6Months: content.plan_6_months || mockReport.plan6Months,
            risks: content.risks || mockReport.risks,
          })
        })
        .catch(() => {
          setReport(mockReport)
          setError('无法加载报告，显示示例数据')
        })
        .finally(() => setLoading(false))
    } else {
      setReport(mockReport)
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">📊</div>
          <p className="text-gray-600">正在加载报告...</p>
        </div>
      </div>
    )
  }

  if (!report) return null

  const d = report.gpaAnalysis

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">AI 留学规划报告</p>
              <h1 className="text-2xl md:text-3xl font-bold mt-1">你好，{report.studentName} 👋</h1>
              <p className="text-blue-200 text-sm mt-1">报告生成于 {report.createdAt}</p>
            </div>
            <div className="text-center">
              <ScoreRing score={report.overallScore} size={100} strokeWidth={8} color="#60A5FA" />
              <p className="text-xs text-blue-200 mt-2">综合竞争力</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* 维度评分 */}
        <Section icon="📊" title="竞争力维度评分">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {report.dimensionScores.map((dim, i) => (
              <DimensionBar key={i} {...dim} />
            ))}
          </div>
        </Section>

        {/* GPA 分析 */}
        <Section icon="📈" title="GPA 分析" subtitle={`当前 GPA ${d.current}/${d.scale} · 排名 ${d.ranking}`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-blue-700">{d.current}</p>
              <p className="text-xs text-blue-600">当前 GPA</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-700">{d.majorGpa}</p>
              <p className="text-xs text-green-600">核心课 GPA</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-purple-700">{d.ranking}</p>
              <p className="text-xs text-purple-600">排名估算</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-orange-700">+0.22</p>
              <p className="text-xs text-orange-600">距目标 3.50</p>
            </div>
          </div>

          <h4 className="font-medium text-gray-900 mb-2">各课程 GPA 贡献</h4>
          <div className="space-y-2 mb-5">
            {d.contribution.map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="flex-1 text-gray-700">{c.course}</span>
                <span className="text-gray-500 w-12 text-right">{c.credit}学分</span>
                <span className="w-8 text-center font-medium">{c.score}</span>
                <span className={`w-16 text-right font-bold ${c.negative ? 'text-red-600' : 'text-green-600'}`}>
                  {c.impact > 0 ? '+' : ''}{c.impact.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="font-medium text-green-800 mb-2 text-sm">✅ 优势</h4>
              <ul className="space-y-1">
                {d.strengths.map((s, i) => <li key={i} className="text-sm text-green-700">· {s}</li>)}
              </ul>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <h4 className="font-medium text-red-800 mb-2 text-sm">⚠️ 待提升</h4>
              <ul className="space-y-1">
                {d.weaknesses.map((w, i) => <li key={i} className="text-sm text-red-700">· {w}</li>)}
              </ul>
            </div>
          </div>
        </Section>

        {/* 课程匹配度 */}
        <Section icon="📚" title="课程匹配度分析" subtitle={`与目标专业匹配度 ${report.courseMatching.matchRate}%`}>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${report.courseMatching.matchRate}%` }} />
              </div>
              <span className="text-sm font-bold text-gray-700">{report.courseMatching.matchRate}%</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-2">✅ 已覆盖课程</h4>
              <div className="flex flex-wrap gap-2">
                {report.courseMatching.covered.map((c, i) => (
                  <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{c}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-orange-700 mb-2">⚠️ 建议补充</h4>
              <div className="flex flex-wrap gap-2">
                {report.courseMatching.missing.map((c, i) => (
                  <span key={i} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">{c}</span>
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">💡 {report.courseMatching.suggestion}</p>
        </Section>

        {/* 推荐申请方向 */}
        <Section icon="🎯" title="推荐申请方向">
          <div className="space-y-3">
            {report.directions.map((dir, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  dir.match === '高匹配' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {dir.match}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{dir.name}</p>
                  <p className="text-sm text-gray-600">{dir.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 学校推荐 */}
        <Section icon="🏫" title="学校定位建议">
          <p className="text-xs text-gray-500 mb-4">⚠️ 以下分析基于往年公开数据，仅供参考，实际录取以学校官网为准。</p>

          {/* 冲刺 */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">冲刺档</span>
              <span className="text-xs text-gray-500">录取难度较高，需要背景全面提升</span>
            </div>
            <div className="space-y-2">
              {report.schools.sprint.map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{s.name}</p>
                    <p className="text-sm text-gray-600">{s.program}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.note}</p>
                  </div>
                  <span className="px-2 py-1 bg-red-200 text-red-800 rounded text-xs font-medium">冲刺</span>
                </div>
              ))}
            </div>
          </div>

          {/* 匹配 */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">匹配档</span>
              <span className="text-xs text-gray-500">与你的背景较为匹配</span>
            </div>
            <div className="space-y-2">
              {report.schools.match.map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{s.name}</p>
                    <p className="text-sm text-gray-600">{s.program}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.note}</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-medium">匹配</span>
                </div>
              ))}
            </div>
          </div>

          {/* 稳妥 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">稳妥档</span>
              <span className="text-xs text-gray-500">录取概率较高</span>
            </div>
            <div className="space-y-2">
              {report.schools.safe.map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{s.name}</p>
                    <p className="text-sm text-gray-600">{s.program}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.note}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-medium">稳妥</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 未来 3 个月计划 */}
        <Section icon="📅" title="未来 3 个月计划" subtitle="短期行动项">
          <div className="space-y-3">
            {report.plan3Months.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  item.priority === '高' ? 'bg-red-500' : 'bg-yellow-500'
                }`}>{i + 1}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{item.task}</p>
                  <p className="text-xs text-gray-500">截止：{item.deadline}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  item.priority === '高' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>{item.priority}优先</span>
              </div>
            ))}
          </div>
        </Section>

        {/* 未来 6 个月计划 - locked */}
        <Section icon="🗺️" title="未来 6 个月计划" subtitle="完整申请时间线" locked>
          <div className="space-y-3">
            {report.plan6Months.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  item.priority === '高' ? 'bg-red-500' : 'bg-yellow-500'
                }`}>{i + 1}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{item.task}</p>
                  <p className="text-xs text-gray-500">截止：{item.deadline}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 风险提醒 */}
        <Section icon="⚠️" title="风险提醒">
          <div className="space-y-3">
            {report.risks.map((risk, i) => (
              <div key={i} className={`p-4 rounded-xl border ${
                risk.level === '高' ? 'bg-red-50 border-red-200' :
                risk.level === '中' ? 'bg-yellow-50 border-yellow-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    risk.level === '高' ? 'bg-red-200 text-red-800' :
                    risk.level === '中' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>{risk.level}风险</span>
                </div>
                <p className="text-sm text-gray-800 font-medium">{risk.text}</p>
                <p className="text-sm text-gray-600 mt-1">💡 建议：{risk.action}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 付费解锁 CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">🔓 解锁完整规划报告</h3>
          <p className="text-blue-100 mb-6 max-w-md mx-auto">
            包含 6 个月完整时间线、选课方案、PS 撰写建议、推荐信策略等 12 个模块
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#pricing" className="bg-white text-blue-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              解锁完整报告 ¥19.9
            </a>
            <a href="#/" className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors">
              返回首页
            </a>
          </div>
          <p className="text-blue-200 text-xs mt-4">24 小时内无理由退款 · 支付后立即查看</p>
        </div>

        {/* Disclaimer */}
        <div className="text-center text-xs text-gray-400 pb-8">
          <p>⚠️ 本报告由 AI 工具基于公开数据和用户提供的信息生成，仅供参考，不构成任何录取承诺或官方建议。</p>
          <p className="mt-1">学校录取标准可能随时调整，请以各校官网最新信息为准。</p>
        </div>
      </div>
    </div>
  )
}
