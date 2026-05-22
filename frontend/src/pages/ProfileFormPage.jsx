import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StepBasicInfo from '../components/form/StepBasicInfo'
import StepEducation from '../components/form/StepEducation'
import AnalyzingPage from './AnalyzingPage'
import StepGPA from '../components/form/StepGPA'
import StepCourses from '../components/form/StepCourses'
import StepTarget from '../components/form/StepTarget'
import StepExperience from '../components/form/StepExperience'
import StepLanguage from '../components/form/StepLanguage'
import StepBudgetCareer from '../components/form/StepBudgetCareer'
import { profileService, reportService } from '../services'

const STEPS = [
  { key: 'basic', title: '基本信息', icon: '👤' },
  { key: 'education', title: '本科背景', icon: '🎓' },
  { key: 'gpa', title: 'GPA / 成绩', icon: '📊' },
  { key: 'courses', title: '课程信息', icon: '📚' },
  { key: 'target', title: '目标申请', icon: '🎯' },
  { key: 'experience', title: '经历', icon: '💼' },
  { key: 'language', title: '语言成绩', icon: '🌍' },
  { key: 'budget', title: '预算 & 职业', icon: '💰' },
]

const initialFormData = {
  // 基本信息
  name: '',
  gender: '',
  grade: '',
  email: '',
  phone: '',
  wechatId: '',

  // 本科背景
  university: '',
  universityTier: '',
  college: '',
  major: '',
  minor: '',
  duration: 4,
  graduationDate: '',

  // GPA / 成绩
  currentGpa: '',
  gpaScale: '4.0',
  gpaRanking: '',
  majorGpa: '',
  percentageAvg: '',
  gpaCalcRule: 'weighted',
  hasRetake: false,
  retakeDetails: [],

  // 课程信息
  courses: [
    { courseName: '', courseType: 'required', credit: '', score: '', scoreType: 'grade', semester: 'freshman_fall', category: '' },
  ],
  currentCourses: [],
  availableCourses: [],

  // 目标申请
  targetDegree: '',
  targetMajors: [],
  acceptCrossMajor: '',
  priorityFactors: [],
  targetRegions: [],
  regionPrefOrder: [],
  multiRegionApply: true,

  // 经历
  projects: [],
  internships: [],
  research: [],
  competitions: [],

  // 语言成绩
  hasLanguageScore: '',
  ieltsTotal: '',
  ieltsL: '',
  ieltsR: '',
  ieltsW: '',
  ieltsS: '',
  toeflTotal: '',
  toeflR: '',
  toeflL: '',
  toeflS: '',
  toeflW: '',
  greTotal: '',
  greQuant: '',
  greVerbal: '',
  greAw: '',
  gmatScore: '',
  cet4Score: '',
  cet6Score: '',
  plannedExamDate: '',

  // 预算和职业
  tuitionBudget: '',
  livingBudget: '',
  needScholarship: '',
  acceptLoan: false,
  postGradPlan: '',
  targetIndustry: [],
  targetRole: '',
  cityPreference: '',
  concerns: [],
  referralSource: '',
  additionalInfo: '',
}

export default function ProfileFormPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(initialFormData)
  const [submitted, setSubmitted] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')
  const [reportId, setReportId] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)

  // 从登录信息中获取邮箱
  const getUserEmail = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      return user.email || ''
    } catch { return '' }
  }

  // 判断是否为编辑模式
  const isEditMode = window.location.hash === '#/profile/edit'

  // 加载已有 profile（编辑模式）或预填邮箱
  useEffect(() => {
    async function loadExistingProfile() {
      // 预填登录邮箱
      const userEmail = getUserEmail()
      if (userEmail) {
        setFormData((prev) => ({ ...prev, email: userEmail }))
      }

      if (!isEditMode) {
        setLoadingProfile(false)
        return
      }
      try {
        const res = await profileService.get()
        const p = res.data.profile
        const courses = res.data.courses || []

        const user = p.user || {}
        const prefs = res.data.preferences || {}

        // 合并已有数据到表单
        setFormData((prev) => ({
          ...prev,
          // 基本信息
          name: user.name || prev.name,
          gender: p.gender || '',
          grade: p.grade || '',
          phone: p.phone || '',
          wechatId: p.wechatId || '',

          // 本科背景
          university: p.university || '',
          universityTier: p.universityTier || '',
          college: p.college || '',
          major: p.major || '',
          minor: p.minor || '',
          duration: p.duration || 4,
          graduationDate: p.graduationDate ? p.graduationDate.split('T')[0] : '',

          // GPA
          currentGpa: p.currentGpa?.toString() || '',
          gpaScale: p.gpaScale?.toString() || '4.0',
          gpaRanking: p.gpaRanking || '',
          majorGpa: p.majorGpa?.toString() || '',
          percentageAvg: p.percentageAvg?.toString() || '',
          gpaCalcRule: p.gpaCalcRule || 'weighted',
          hasRetake: p.hasRetake || false,

          // 语言成绩
          hasLanguageScore: p.hasLanguageScore || '',
          ieltsTotal: p.ieltsTotal?.toString() || '',
          ieltsL: p.ieltsL?.toString() || '',
          ieltsR: p.ieltsR?.toString() || '',
          ieltsW: p.ieltsW?.toString() || '',
          ieltsS: p.ieltsS?.toString() || '',
          toeflTotal: p.toeflTotal?.toString() || '',
          toeflR: p.toeflR?.toString() || '',
          toeflL: p.toeflL?.toString() || '',
          toeflS: p.toeflS?.toString() || '',
          toeflW: p.toeflW?.toString() || '',
          greTotal: p.greTotal?.toString() || '',
          greQuant: p.greQuant?.toString() || '',
          greVerbal: p.greVerbal?.toString() || '',
          greAw: p.greAw?.toString() || '',
          gmatScore: p.gmatScore?.toString() || '',
          cet4Score: p.cet4Score?.toString() || '',
          cet6Score: p.cet6Score?.toString() || '',
          plannedExamDate: p.plannedExamDate ? p.plannedExamDate.split('T')[0] : '',

          // 预算
          tuitionBudget: p.tuitionBudget || '',
          livingBudget: p.livingBudget || '',
          needScholarship: p.needScholarship || '',
          acceptLoan: p.acceptLoan || false,

          // 职业目标
          postGradPlan: p.postGradPlan || '',
          targetIndustry: tryParseJson(p.targetIndustry, []),
          targetRole: p.targetRole || '',
          cityPreference: p.cityPreference || '',

          // 补充
          concerns: tryParseJson(p.concerns, []),
          referralSource: p.referralSource || '',
          additionalInfo: p.additionalInfo || '',

          // 申请目标（来自 TargetPreference）
          targetDegree: prefs.targetDegree || p.targetDegree || '',
          targetMajors: tryParseJson(prefs.targetMajors, tryParseJson(p.targetMajors, [])),
          targetRegions: tryParseJson(prefs.targetRegions, tryParseJson(p.targetRegions, [])),

          // 课程
          courses: courses.length > 0
            ? courses.map((c) => ({
                courseName: c.courseName,
                courseType: c.courseType,
                credit: c.credit?.toString() || '',
                score: c.score,
                scoreType: c.scoreType,
                semester: c.semester,
                category: c.category || '',
              }))
            : prev.courses,
        }))
        setIsEditing(true)
      } catch (err) {
        // 404 = 没有 profile，正常进入新建模式
        if (err.code !== 'PROFILE_NOT_FOUND') {
          setError('加载已有信息失败：' + (err.message || ''))
        }
      } finally {
        setLoadingProfile(false)
      }
    }
    loadExistingProfile()
  }, [isEditMode])

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      setAnalyzing(true)
      setError('')

      if (isEditing) {
        await profileService.update(formData)
      } else {
        await profileService.create(formData)
        setIsEditing(true)
      }

      const reportRes = await reportService.generateFree(parseFloat(formData.currentGpa) || 3.5)
      setReportId(reportRes.data.report.id)

      setAnalyzing(false)
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setAnalyzing(false)
      setError(err.message || '提交失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')

      if (isEditing) {
        await profileService.update(formData)
      } else {
        await profileService.create(formData)
        setIsEditing(true)
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (err) {
      setError(err.message || '保存失败，请稍后重试')
    } finally {
      setSaving(false)
    }
  }

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">📊</div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    )
  }

  if (analyzing) {
    return <AnalyzingPage />
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {isEditing ? '背景信息更新成功！' : '背景信息提交成功！'}
              </h1>
              <p className="text-gray-600 mb-8">
                AI 已经分析完你的背景信息，专属规划报告已生成。
              </p>
              {reportId && (
                <a
                  href={`#/report/${reportId}`}
                  className="btn-primary inline-block mb-4"
                >
                  📊 查看我的报告
                </a>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#/reports" className="btn-secondary">历史报告</a>
                <a href="/" className="text-gray-500 hover:text-gray-700">返回首页</a>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const renderStep = () => {
    const props = { formData, updateField }
    switch (currentStep) {
      case 0: return <StepBasicInfo {...props} />
      case 1: return <StepEducation {...props} />
      case 2: return <StepGPA {...props} />
      case 3: return <StepCourses {...props} />
      case 4: return <StepTarget {...props} />
      case 5: return <StepExperience {...props} />
      case 6: return <StepLanguage {...props} />
      case 7: return <StepBudgetCareer {...props} />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isEditing ? '修改你的背景信息' : '填写你的背景信息'}
            </h1>
            <p className="text-gray-600">信息越完整，AI 分析越精准</p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">
                步骤 {currentStep + 1} / {STEPS.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / STEPS.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
            {STEPS.map((step, index) => (
              <button
                key={step.key}
                onClick={() => setCurrentStep(index)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  index === currentStep
                    ? 'bg-blue-600 text-white'
                    : index < currentStep
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <span>{index < currentStep ? '✓' : step.icon}</span>
                <span className="hidden sm:inline">{step.title}</span>
              </button>
            ))}
          </div>

          {/* Form content */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <span className="text-3xl">{STEPS[currentStep].icon}</span>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{STEPS[currentStep].title}</h2>
                <p className="text-sm text-gray-500">步骤 {currentStep + 1} / {STEPS.length}</p>
              </div>
            </div>

            {renderStep()}
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              ❌ {error}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              ← 上一步
            </button>

            <div className="flex items-center gap-3">
              {/* 保存按钮 */}
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-colors ${
                  saveSuccess
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                } ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {saveSuccess ? '✓ 已保存' : saving ? '保存中...' : '💾 保存'}
              </button>

              {currentStep < STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  下一步 →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-colors ${
                    submitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {submitting ? '⏳ AI 分析中...' : isEditing ? '🔄 更新并重新分析' : '🚀 提交并生成报告'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

// 工具函数
function tryParseJson(str, fallback) {
  if (!str) return fallback
  if (Array.isArray(str)) return str
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}
