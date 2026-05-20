import { useState } from 'react'
import { convertGPA } from '../utils'

export default function GPAConverter() {
  const [input, setInput] = useState('')
  const [fromScale, setFromScale] = useState('4.0')
  const [toScale, setToScale] = useState('5.0')
  const [result, setResult] = useState(null)

  const handleConvert = () => {
    const val = parseFloat(input)
    if (isNaN(val)) return
    const converted = convertGPA(val, fromScale, toScale)
    setResult(converted)
  }

  const scales = [
    { value: '4.0', label: '4.0 制' },
    { value: '5.0', label: '5.0 制' },
    { value: '100', label: '百分制' },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-xl">
          🔄
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">GPA 换算器</h3>
          <p className="text-sm text-gray-500">4.0 / 5.0 / 百分制 互转</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Input */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">你的 GPA</label>
          <input
            type="number"
            step="0.01"
            placeholder="例如 3.5"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* From / To */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">从</label>
            <select
              value={fromScale}
              onChange={(e) => setFromScale(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {scales.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">转为</label>
            <select
              value={toScale}
              onChange={(e) => setToScale(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {scales.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={handleConvert}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-bold"
        >
          换算
        </button>

        {/* Result */}
        {result !== null && (
          <div className="bg-indigo-50 rounded-xl p-4 text-center">
            <p className="text-sm text-indigo-600 mb-1">换算结果</p>
            <p className="text-3xl font-bold text-indigo-700">{result}</p>
            <p className="text-sm text-indigo-500 mt-1">
              {input}（{fromScale === '100' ? '百分制' : `${fromScale} 制`}）→ {toScale === '100' ? '百分制' : `${toScale} 制`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
