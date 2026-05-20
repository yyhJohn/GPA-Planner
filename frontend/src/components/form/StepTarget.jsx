const degrees = [
  { value: 'taught_master', label: '授课型硕士' },
  { value: 'research_master', label: '研究型硕士' },
  { value: 'phd', label: '直博' },
]

const regions = [
  { value: 'uk', label: '🇬🇧 英国', icon: '🇬🇧' },
  { value: 'hk', label: '🇭🇰 香港', icon: '🇭🇰' },
  { value: 'sg', label: '🇸🇬 新加坡', icon: '🇸🇬' },
  { value: 'us', label: '🇺🇸 美国', icon: '🇺🇸' },
  { value: 'au', label: '🇦🇺 澳大利亚', icon: '🇦🇺' },
  { value: 'ca', label: '🇨🇦 加拿大', icon: '🇨🇦' },
  { value: 'jp', label: '🇯🇵 日本', icon: '🇯🇵' },
  { value: 'eu', label: '🇪🇺 欧洲其他', icon: '🇪🇺' },
]

const majorOptions = [
  '计算机科学', '数据科学', '人工智能', '软件工程', '信息安全',
  '电子工程', '通信工程', '自动化', '机械工程', '土木工程',
  '金融学', '经济学', '会计学', '商业分析', '市场营销',
  '管理学', 'MBA', '公共政策', '国际关系',
  '数学', '统计学', '物理学', '化学', '生物学',
  '教育学', 'TESOL', '传媒学', '法学', '心理学',
  '建筑学', '设计学', '艺术管理',
]

const crossMajorOptions = [
  { value: 'full', label: '是，完全跨专业' },
  { value: 'related', label: '是，相关方向跨' },
  { value: 'no', label: '否，必须对口' },
]

const priorityOptions = [
  '学校排名', '专业排名', '就业率', '城市偏好', '学费低', '奖学金', '移民政策', '科研资源',
]

export default function StepTarget({ formData, updateField }) {
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
      {/* 申请学位 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          申请学位 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          {degrees.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => updateField('targetDegree', d.value)}
              className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors text-sm ${
                formData.targetDegree === d.value
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* 目标专业 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          目标专业（最多 3 个） <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {majorOptions.map((major) => (
            <button
              key={major}
              type="button"
              onClick={() => {
                if (formData.targetMajors.includes(major)) {
                  updateField('targetMajors', formData.targetMajors.filter((m) => m !== major))
                } else if (formData.targetMajors.length < 3) {
                  updateField('targetMajors', [...formData.targetMajors, major])
                }
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                formData.targetMajors.includes(major)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {major}
            </button>
          ))}
        </div>
        {formData.targetMajors.length > 0 && (
          <p className="mt-2 text-sm text-gray-500">
            已选：{formData.targetMajors.join('、')}
          </p>
        )}
      </div>

      {/* 是否接受跨专业 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          是否接受跨专业 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          {crossMajorOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField('acceptCrossMajor', option.value)}
              className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors text-sm ${
                formData.acceptCrossMajor === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 目标国家/地区 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          目标国家/地区（可多选） <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {regions.map((region) => (
            <button
              key={region.value}
              type="button"
              onClick={() => toggleArrayItem('targetRegions', region.value)}
              className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors text-sm ${
                formData.targetRegions.includes(region.value)
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {region.label}
            </button>
          ))}
        </div>
      </div>

      {/* 最看重什么 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          选校最看重什么？（最多 3 个）
        </label>
        <div className="flex flex-wrap gap-2">
          {priorityOptions.map((factor) => (
            <button
              key={factor}
              type="button"
              onClick={() => {
                if (formData.priorityFactors.includes(factor)) {
                  updateField('priorityFactors', formData.priorityFactors.filter((f) => f !== factor))
                } else if (formData.priorityFactors.length < 3) {
                  updateField('priorityFactors', [...formData.priorityFactors, factor])
                }
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                formData.priorityFactors.includes(factor)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {factor}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
