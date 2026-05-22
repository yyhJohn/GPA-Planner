import { useState, useEffect } from 'react'

const tips = [
  '正在分析你的 GPA 竞争力...',
  '正在匹配全球院校数据库...',
  '正在评估课程匹配度...',
  '正在生成选校冲刺/匹配/稳妥方案...',
  '正在制定 3 个月行动计划...',
  '正在分析风险因素...',
  '即将完成，再等一下 ✨',
]

export default function AnalyzingPage() {
  const [tipIndex, setTipIndex] = useState(0)
  const [dots, setDots] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length)
    }, 3000)

    const dotTimer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'))
    }, 500)

    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 8 + 2, 95))
    }, 800)

    return () => {
      clearInterval(tipTimer)
      clearInterval(dotTimer)
      clearInterval(progressTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 动画图标 */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* 外圈旋转 */}
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" />

          {/* 中圈反向旋转 */}
          <div className="absolute inset-4 border-4 border-indigo-200 rounded-full" />
          <div className="absolute inset-4 border-4 border-transparent border-b-indigo-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />

          {/* 内圈脉冲 */}
          <div className="absolute inset-8 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-xl">🧠</span>
            </div>
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          AI 正在分析你的背景
        </h1>
        <p className="text-gray-500 mb-8">
          基于你的 GPA、课程、目标院校进行深度分析
        </p>

        {/* 进度条 */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-400 mb-8">{Math.round(progress)}%</p>

        {/* 动态提示 */}
        <div className="h-12 flex items-center justify-center">
          <p className="text-gray-600 text-sm animate-fade-in" key={tipIndex}>
            {tips[tipIndex]}{dots}
          </p>
        </div>

        {/* 底部提示 */}
        <div className="mt-12 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-600">
            💡 分析通常需要 10-30 秒，AI 正在根据你的背景生成个性化建议
          </p>
        </div>
      </div>
    </div>
  )
}
