import { useState } from 'react'
import { calcGPA, convertGPA } from '../utils'

const defaultCourses = [
  { name: '', credit: '', score: '', scoreType: 'grade' },
]

const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F']

export default function GPACalculator() {
  const [courses, setCourses] = useState(defaultCourses)
  const [gpaScale, setGpaScale] = useState('4.0')
  const [result, setResult] = useState(null)

  const addCourse = () => {
    setCourses([...courses, { name: '', credit: '', score: '', scoreType: 'grade' }])
  }

  const removeCourse = (i) => {
    if (courses.length <= 1) return
    setCourses(courses.filter((_, idx) => idx !== i))
  }

  const updateCourse = (i, field, value) => {
    const updated = [...courses]
    updated[i] = { ...updated[i], [field]: value }
    setCourses(updated)
  }

  const handleCalc = () => {
    const valid = courses.filter(c => c.credit && c.score)
    if (valid.length === 0) return
    const gpa = calcGPA(valid, 4.0)
    const converted = convertGPA(gpa, '4.0', gpaScale)
    setResult({ gpa4: gpa, converted, scale: gpaScale, count: valid.length })
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
          📊
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">GPA 计算器</h3>
          <p className="text-sm text-gray-500">免费 · 无需登录 · 即时计算</p>
        </div>
      </div>

      {/* Scale selector */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm text-gray-600">目标制式：</span>
        {['4.0', '5.0', '100'].map(s => (
          <button
            key={s}
            onClick={() => setGpaScale(s)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              gpaScale === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s === '100' ? '百分制' : `${s} 制`}
          </button>
        ))}
      </div>

      {/* Course rows */}
      <div className="space-y-2 mb-4">
        {/* Header */}
        <div className="hidden sm:flex items-center gap-3 px-3 text-xs text-gray-500 font-medium">
          <span className="flex-1">课程名称</span>
          <span className="w-16 text-center">学分</span>
          <span className="w-20 text-center">成绩</span>
          <span className="w-8"></span>
        </div>

        {courses.map((course, i) => (
          <div key={i} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="text"
              placeholder="课程名称（选填）"
              value={course.name}
              onChange={(e) => updateCourse(i, 'name', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <input
              type="number"
              placeholder="学分"
              min="0"
              step="0.5"
              value={course.credit}
              onChange={(e) => updateCourse(i, 'credit', e.target.value)}
              className="sm:w-16 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <select
              value={course.score}
              onChange={(e) => updateCourse(i, 'score', e.target.value)}
              className="sm:w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">成绩</option>
              {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <button
              onClick={() => removeCourse(i)}
              className="sm:w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
              title="删除"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        <button onClick={addCourse} className="flex-1 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors text-sm font-medium">
          + 添加课程
        </button>
        <button onClick={handleCalc} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold">
          计算 GPA
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-5 text-white text-center">
          <p className="text-sm opacity-90 mb-1">你的 GPA</p>
          <p className="text-4xl font-bold">{result.converted}</p>
          <p className="text-sm opacity-90 mt-1">
            {result.scale === '100' ? '百分制' : `${result.scale} 制`} · 基于 {result.count} 门课程
            {result.scale !== '4.0' && ` · 4.0 制: ${result.gpa4}`}
          </p>
        </div>
      )}
    </div>
  )
}
