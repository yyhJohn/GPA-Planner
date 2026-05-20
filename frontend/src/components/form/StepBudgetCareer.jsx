const tuitionBudgets = [
  { value: '15w_below', label: '15 万以下' },
  { value: '15-25w', label: '15-25 万' },
  { value: '25-35w', label: '25-35 万' },
  { value: '35-45w', label: '35-45 万' },
  { value: '45w_above', label: '45 万以上' },
  { value: 'unlimited', label: '无上限' },
]

const livingBudgets = [
  { value: '10w_below', label: '10 万以下' },
  { value: '10-15w', label: '10-15 万' },
  { value: '15-20w', label: '15-20 万' },
  { value: '20w_above', label: '20 万以上' },
]

const scholarshipOptions = [
  { value: 'required', label: '必须有奖学金' },
  { value: 'preferred', label: '有最好' },
  { value: 'no', label: '不需要' },
]

const postGradPlans = [
  { value: 'domestic', label: '回国就业' },
  { value: 'overseas', label: '海外就业' },
  { value: 'phd', label: '继续读博' },
  { value: 'startup', label: '创业' },
  { value: 'undecided', label: '未定' },
]

const industryOptions = [
  '互联网/科技', '金融', '咨询', '教育', '医疗', '政府/公共', '学术/科研', '其他',
]

const concernOptions = [
  'GPA太低', '没有实习', '语言成绩不够', '不知道选什么学校', '文书不会写', '时间不够', '钱不够',
]

const referralOptions = [
  '小红书', '微信朋友圈', '同学推荐', '搜索引擎', '知乎', '其他',
]

export default function StepBudgetCareer({ formData, updateField }) {
  const toggleArrayItem = (field, item) => {
    const arr = formData[field]
    if (arr.includes(item)) {
      updateField(field, arr.filter((i) => i !== item))
    } else {
      updateField(field, [...arr, item])
    }
  }

  return (
    <div className="space-y-6">
      {/* 学费预算 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">每年学费预算</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {tuitionBudgets.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField('tuitionBudget', option.value)}
              className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors text-sm ${
                formData.tuitionBudget === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 生活费预算 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">每年生活费预算</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {livingBudgets.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField('livingBudget', option.value)}
              className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors text-sm ${
                formData.livingBudget === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 奖学金 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">奖学金需求</label>
        <div className="flex gap-3">
          {scholarshipOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField('needScholarship', option.value)}
              className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors text-sm ${
                formData.needScholarship === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 是否接受贷款 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">是否接受贷款/自筹</label>
        <div className="flex gap-3">
          <button type="button" onClick={() => updateField('acceptLoan', true)} className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${formData.acceptLoan ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>是</button>
          <button type="button" onClick={() => updateField('acceptLoan', false)} className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${!formData.acceptLoan ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>否</button>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* 毕业后计划 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">毕业后计划</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {postGradPlans.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField('postGradPlan', option.value)}
              className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors text-sm ${
                formData.postGradPlan === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 目标行业 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">目标行业（可多选）</label>
        <div className="flex flex-wrap gap-2">
          {industryOptions.map((industry) => (
            <button
              key={industry}
              type="button"
              onClick={() => toggleArrayItem('targetIndustry', industry)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                formData.targetIndustry.includes(industry)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      {/* 目标岗位 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">目标岗位类型（选填）</label>
        <input
          type="text"
          value={formData.targetRole}
          onChange={(e) => updateField('targetRole', e.target.value)}
          placeholder="如：数据分析师 / 算法工程师"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* 目标城市 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">目标城市偏好（选填）</label>
        <input
          type="text"
          value={formData.cityPreference}
          onChange={(e) => updateField('cityPreference', e.target.value)}
          placeholder="如：伦敦 / 香港 / 新加坡"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <hr className="border-gray-200" />

      {/* 最担心什么 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">你最担心什么？（可多选）</label>
        <div className="flex flex-wrap gap-2">
          {concernOptions.map((concern) => (
            <button
              key={concern}
              type="button"
              onClick={() => toggleArrayItem('concerns', concern)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                formData.concerns.includes(concern)
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {concern}
            </button>
          ))}
        </div>
      </div>

      {/* 怎么知道我们的 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">你是怎么知道我们的？</label>
        <div className="flex flex-wrap gap-2">
          {referralOptions.map((source) => (
            <button
              key={source}
              type="button"
              onClick={() => updateField('referralSource', source)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                formData.referralSource === source
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {source}
            </button>
          ))}
        </div>
      </div>

      {/* 其他补充 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">其他补充信息（选填）</label>
        <textarea
          value={formData.additionalInfo}
          onChange={(e) => updateField('additionalInfo', e.target.value)}
          placeholder="还有什么想告诉我们的？如：GAP 年、特殊情况等..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
        />
      </div>
    </div>
  )
}
