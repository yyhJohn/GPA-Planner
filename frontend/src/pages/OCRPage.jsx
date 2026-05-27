import { useState, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { courseService } from '../services'

export default function OCRPage() {
  const [step, setStep] = useState('upload') // upload | loading | result
  const [imagePreview, setImagePreview] = useState(null)
  const [result, setResult] = useState(null)
  const [editCourses, setEditCourses] = useState([])
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const fileRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    const file = fileRef.current?.files[0]
    if (!file) return

    setStep('loading')
    const formData = new FormData()
    formData.append('image', file)

    try {
      const token = localStorage.getItem('token')
      const API_BASE = import.meta.env.VITE_API_BASE || '/v1'
      const resp = await fetch(`${API_BASE}/ocr/transcript`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.error?.message || '识别失败')

      setResult(data.data)
      setEditCourses(
        data.data.courses.map((c, i) => ({
          ...c,
          id: i,
          selected: true,
        }))
      )
      setStep('result')
    } catch (err) {
      alert('OCR 识别失败：' + err.message)
      setStep('upload')
    }
  }

  const handleCourseEdit = (id, field, value) => {
    setEditCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    )
  }

  const toggleCourse = (id) => {
    setEditCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    )
  }

  const toggleAll = () => {
    const allSelected = editCourses.every((c) => c.selected)
    setEditCourses((prev) => prev.map((c) => ({ ...c, selected: !allSelected })))
  }

  const handleDeleteCourse = (id) => {
    setEditCourses((prev) => prev.filter((c) => c.id !== id))
  }

  const handleAddCourse = () => {
    setEditCourses((prev) => [
      ...prev,
      {
        id: Date.now(),
        courseName: '',
        credit: 3,
        score: '',
        scoreType: 'grade',
        semester: '大一上',
        courseType: 'elective',
        category: 'other',
        selected: true,
      },
    ])
  }

  const handleImport = async () => {
    const selected = editCourses.filter((c) => c.selected)
    if (selected.length === 0) {
      alert('请至少选择一门课程')
      return
    }

    setImporting(true)
    try {
      const courses = selected.map(({ id, selected: _, ...rest }) => rest)
      await courseService.batchAdd(courses)
      setImportResult({ success: true, count: courses.length })
    } catch (err) {
      setImportResult({ success: false, error: err.message })
    } finally {
      setImporting(false)
    }
  }

  const handleReset = () => {
    setStep('upload')
    setImagePreview(null)
    setResult(null)
    setEditCourses([])
    setImportResult(null)
  }

  const scoreTypeOptions = [
    { value: 'grade', label: '等级制' },
    { value: 'percentage', label: '百分制' },
  ]

  const semesterOptions = [
    '大一上', '大一下', '大二上', '大二下', '大三上', '大三下', '大四上', '大四下',
  ]

  const courseTypeOptions = [
    { value: 'required', label: '必修' },
    { value: 'elective', label: '选修' },
    { value: 'general', label: '通识' },
    { value: 'lab', label: '实验' },
    { value: 'practice', label: '实践' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-24 pb-16 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📸 成绩单 OCR 识别</h1>
          <p className="text-gray-600">上传成绩单图片，AI 自动识别课程信息</p>
        </div>

        {/* 上传步骤 */}
        {step === 'upload' && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="成绩单预览"
                  className="max-h-80 mx-auto rounded-lg shadow-sm"
                />
              ) : (
                <>
                  <div className="text-5xl mb-4">📄</div>
                  <p className="text-gray-600 mb-2">点击或拖拽上传成绩单图片</p>
                  <p className="text-sm text-gray-400">支持 JPG、PNG 格式，最大 10MB</p>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            {imagePreview && (
              <div className="mt-6 flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setImagePreview(null)
                    fileRef.current.value = ''
                  }}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  重新选择
                </button>
                <button
                  onClick={handleUpload}
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  开始识别
                </button>
              </div>
            )}
          </div>
        )}

        {/* 加载中 */}
        {step === 'loading' && (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600 text-lg">AI 正在识别成绩单...</p>
            <p className="text-sm text-gray-400 mt-2">通常需要 5-15 秒</p>
          </div>
        )}

        {/* 识别结果 */}
        {step === 'result' && (
          <div className="space-y-6">
            {/* 识别信息 */}
            {(result?.university || result?.major || result?.gpa) && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-3">📋 识别到的基本信息</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {result.university && (
                    <div>
                      <span className="text-sm text-gray-500">学校</span>
                      <p className="font-medium">{result.university}</p>
                    </div>
                  )}
                  {result.major && (
                    <div>
                      <span className="text-sm text-gray-500">专业</span>
                      <p className="font-medium">{result.major}</p>
                    </div>
                  )}
                  {result.gpa && (
                    <div>
                      <span className="text-sm text-gray-500">GPA</span>
                      <p className="font-medium">{result.gpa} / {result.gpaScale}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-500">识别课程数</span>
                    <p className="font-medium">{editCourses.length} 门</p>
                  </div>
                </div>
              </div>
            )}

            {/* 课程列表 */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">📚 识别到的课程</h2>
                <div className="flex gap-2">
                  <button
                    onClick={toggleAll}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {editCourses.every((c) => c.selected) ? '取消全选' : '全选'}
                  </button>
                  <button
                    onClick={handleAddCourse}
                    className="text-sm text-green-600 hover:text-green-800"
                  >
                    + 手动添加
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {editCourses.map((course) => (
                  <div
                    key={course.id}
                    className={`border rounded-lg p-4 transition-colors ${
                      course.selected ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={course.selected}
                        onChange={() => toggleCourse(course.id)}
                        className="mt-1.5 w-4 h-4 text-blue-600 rounded"
                      />
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="md:col-span-2">
                          <label className="text-xs text-gray-500 mb-1 block">课程名称</label>
                          <input
                            type="text"
                            value={course.courseName}
                            onChange={(e) => handleCourseEdit(course.id, 'courseName', e.target.value)}
                            className="w-full border rounded px-3 py-1.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">学分</label>
                          <input
                            type="number"
                            step="0.5"
                            value={course.credit}
                            onChange={(e) => handleCourseEdit(course.id, 'credit', e.target.value)}
                            className="w-full border rounded px-3 py-1.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">成绩</label>
                          <input
                            type="text"
                            value={course.score}
                            onChange={(e) => handleCourseEdit(course.id, 'score', e.target.value)}
                            className="w-full border rounded px-3 py-1.5 text-sm"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-400 hover:text-red-600 text-sm mt-1"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 ml-7">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">成绩类型</label>
                        <select
                          value={course.scoreType}
                          onChange={(e) => handleCourseEdit(course.id, 'scoreType', e.target.value)}
                          className="w-full border rounded px-2 py-1.5 text-sm"
                        >
                          {scoreTypeOptions.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">学期</label>
                        <select
                          value={course.semester}
                          onChange={(e) => handleCourseEdit(course.id, 'semester', e.target.value)}
                          className="w-full border rounded px-2 py-1.5 text-sm"
                        >
                          {semesterOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">课程类型</label>
                        <select
                          value={course.courseType}
                          onChange={(e) => handleCourseEdit(course.id, 'courseType', e.target.value)}
                          className="w-full border rounded px-2 py-1.5 text-sm"
                        >
                          {courseTypeOptions.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {editCourses.length === 0 && (
                <p className="text-center text-gray-400 py-8">没有识别到课程，请手动添加</p>
              )}
            </div>

            {/* 原始文本 */}
            {result?.rawText && (
              <details className="bg-white rounded-2xl shadow-sm p-6">
                <summary className="text-lg font-semibold cursor-pointer">📝 识别到的原始文本</summary>
                <pre className="mt-3 text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded p-4 max-h-60 overflow-auto">
                  {result.rawText}
                </pre>
              </details>
            )}

            {/* 导入结果 */}
            {importResult && (
              <div
                className={`rounded-2xl p-6 ${
                  importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                {importResult.success ? (
                  <div className="text-center">
                    <div className="text-4xl mb-2">✅</div>
                    <p className="text-green-800 font-medium">
                      成功导入 {importResult.count} 门课程！
                    </p>
                    <div className="mt-4 flex gap-4 justify-center">
                      <a
                        href="#/profile"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        查看档案
                      </a>
                      <button
                        onClick={handleReset}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        继续识别
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-red-800">导入失败：{importResult.error}</p>
                )}
              </div>
            )}

            {/* 操作按钮 */}
            {!importResult && (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  重新上传
                </button>
                <button
                  onClick={handleImport}
                  disabled={importing || editCourses.filter((c) => c.selected).length === 0}
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {importing ? '导入中...' : `导入选中的课程（${editCourses.filter((c) => c.selected).length} 门）`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
