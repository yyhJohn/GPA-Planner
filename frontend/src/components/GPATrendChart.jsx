import { useState, useEffect } from 'react'
import { gpaService } from '../services'

export default function GPATrendChart({ data: propData, height = 250 }) {
  const [trend, setTrend] = useState(propData || [])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(!propData)
  const [hoveredIdx, setHoveredIdx] = useState(null)

  useEffect(() => {
    if (propData?.length) {
      setTrend(propData)
      setLoading(false)
      return
    }
    gpaService.trend()
      .then((res) => {
        setTrend(res.data.trend || [])
        setSummary(res.data.summary || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [propData])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        <div className="text-center">
          <div className="text-3xl mb-2 animate-pulse">📈</div>
          <p className="text-sm">加载趋势数据...</p>
        </div>
      </div>
    )
  }

  if (!trend.length) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        <div className="text-center">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-sm">暂无学期数据</p>
        </div>
      </div>
    )
  }

  // SVG chart dimensions
  const padding = { top: 30, right: 30, bottom: 50, left: 50 }
  const chartW = 600
  const chartH = height
  const innerW = chartW - padding.left - padding.right
  const innerH = chartH - padding.top - padding.bottom

  // Scale
  const gpaValues = trend.flatMap((t) => [t.semesterGpa, t.cumulativeGpa])
  const minGpa = Math.max(0, Math.floor(Math.min(...gpaValues) * 2) / 2 - 0.5)
  const maxGpa = Math.min(4.0, Math.ceil(Math.max(...gpaValues) * 2) / 2 + 0.5)
  const scaleX = (i) => padding.left + (i / Math.max(trend.length - 1, 1)) * innerW
  const scaleY = (v) => padding.top + (1 - (v - minGpa) / (maxGpa - minGpa)) * innerH

  // Grid lines
  const gridSteps = []
  for (let v = minGpa; v <= maxGpa; v += 0.5) {
    gridSteps.push(Math.round(v * 10) / 10)
  }

  // Path generators
  const toPath = (key) =>
    trend
      .map((t, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(t[key])}`)
      .join(' ')

  const semesterPath = toPath('semesterGpa')
  const cumulativePath = toPath('cumulativeGpa')

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" style={{ maxHeight: height }}>
        {/* Grid */}
        {gridSteps.map((v) => (
          <g key={v}>
            <line
              x1={padding.left} y1={scaleY(v)}
              x2={chartW - padding.right} y2={scaleY(v)}
              stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4,4"
            />
            <text
              x={padding.left - 8} y={scaleY(v) + 4}
              textAnchor="end" fontSize="10" fill="#9CA3AF"
            >
              {v.toFixed(1)}
            </text>
          </g>
        ))}

        {/* X labels */}
        {trend.map((t, i) => (
          <text
            key={i}
            x={scaleX(i)} y={chartH - 10}
            textAnchor="middle" fontSize="9" fill="#9CA3AF"
            transform={`rotate(-20, ${scaleX(i)}, ${chartH - 10})`}
          >
            {t.semester}
          </text>
        ))}

        {/* Semester line */}
        <path d={semesterPath} fill="none" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Semester dots */}
        {trend.map((t, i) => (
          <circle
            key={`sem-${i}`}
            cx={scaleX(i)} cy={scaleY(t.semesterGpa)}
            r={hoveredIdx === i ? 5 : 3.5}
            fill="#818CF8"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="cursor-pointer transition-all"
          />
        ))}

        {/* Cumulative line */}
        <path d={cumulativePath} fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Cumulative dots */}
        {trend.map((t, i) => (
          <circle
            key={`cum-${i}`}
            cx={scaleX(i)} cy={scaleY(t.cumulativeGpa)}
            r={hoveredIdx === i ? 5 : 3.5}
            fill="#34D399"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="cursor-pointer transition-all"
          />
        ))}

        {/* Tooltip */}
        {hoveredIdx !== null && (
          <g>
            <rect
              x={scaleX(hoveredIdx) - 55} y={Math.min(scaleY(trend[hoveredIdx].semesterGpa), scaleY(trend[hoveredIdx].cumulativeGpa)) - 48}
              width="110" height="40" rx="6"
              fill="white" stroke="#E5E7EB" strokeWidth="1"
            />
            <text
              x={scaleX(hoveredIdx)} y={Math.min(scaleY(trend[hoveredIdx].semesterGpa), scaleY(trend[hoveredIdx].cumulativeGpa)) - 32}
              textAnchor="middle" fontSize="10" fill="#6366F1" fontWeight="600"
            >
              学期 GPA: {trend[hoveredIdx].semesterGpa}
            </text>
            <text
              x={scaleX(hoveredIdx)} y={Math.min(scaleY(trend[hoveredIdx].semesterGpa), scaleY(trend[hoveredIdx].cumulativeGpa)) - 16}
              textAnchor="middle" fontSize="10" fill="#059669" fontWeight="600"
            >
              累计 GPA: {trend[hoveredIdx].cumulativeGpa}
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-indigo-400" />
          <span className="text-xs text-gray-600">学期 GPA</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="text-xs text-gray-600">累计 GPA</span>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-indigo-50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-indigo-700">{summary.overallGpa}</p>
            <p className="text-xs text-indigo-600">总 GPA</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-emerald-700">{summary.totalCredits}</p>
            <p className="text-xs text-emerald-600">总学分</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-purple-700">{summary.semesterCount}</p>
            <p className="text-xs text-purple-600">学期数</p>
          </div>
        </div>
      )}
    </div>
  )
}
