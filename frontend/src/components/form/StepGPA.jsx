export default function StepGPA({ formData, updateField }) {
  const addRetake = () => {
    updateField('retakeDetails', [
      ...formData.retakeDetails,
      { courseName: '', originalScore: '', retakeScore: '', credit: '' },
    ])
  }

  const updateRetake = (index, field, value) => {
    const updated = [...formData.retakeDetails]
    updated[index][field] = value
    updateField('retakeDetails', updated)
  }

  const removeRetake = (index) => {
    updateField(
      'retakeDetails',
      formData.retakeDetails.filter((_, i) => i !== index)
    )
  }

  return (
    <div className="space-y-6">
      {/* 当前 GPA */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          当前 GPA <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="5"
          value={formData.currentGpa}
          onChange={(e) => updateField('currentGpa', e.target.value)}
          placeholder="如：3.28"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* GPA 制式 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          GPA 制式 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          {[
            { value: '4.0', label: '4.0 制' },
            { value: '5.0', label: '5.0 制' },
            { value: '100', label: '百分制' },
            { value: 'other', label: '其他' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField('gpaScale', option.value)}
              className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors text-sm ${
                formData.gpaScale === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* GPA 排名 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">GPA 排名（选填）</label>
        <input
          type="text"
          value={formData.gpaRanking}
          onChange={(e) => updateField('gpaRanking', e.target.value)}
          placeholder='如：前 15% 或 12/120'
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* 核心课 GPA */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">核心课 GPA（选填）</label>
        <input
          type="number"
          step="0.01"
          value={formData.majorGpa}
          onChange={(e) => updateField('majorGpa', e.target.value)}
          placeholder="如：3.52"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* 百分制均分 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">百分制均分（选填）</label>
        <input
          type="number"
          value={formData.percentageAvg}
          onChange={(e) => updateField('percentageAvg', e.target.value)}
          placeholder="如：85"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* GPA 计算规则 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">学校 GPA 计算规则（选填）</label>
        <div className="flex gap-3">
          {[
            { value: 'weighted', label: '加权平均' },
            { value: 'arithmetic', label: '算术平均' },
            { value: 'custom', label: '学校自定义' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField('gpaCalcRule', option.value)}
              className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors text-sm ${
                formData.gpaCalcRule === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 是否有重修 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">是否有重修记录</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => updateField('hasRetake', true)}
            className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
              formData.hasRetake
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            是
          </button>
          <button
            type="button"
            onClick={() => updateField('hasRetake', false)}
            className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
              !formData.hasRetake
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            否
          </button>
        </div>
      </div>

      {/* 重修详情 */}
      {formData.hasRetake && (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">重修课程详情</h3>
            <button
              type="button"
              onClick={addRetake}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + 添加课程
            </button>
          </div>
          <div className="space-y-3">
            {formData.retakeDetails.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={item.courseName}
                  onChange={(e) => updateRetake(index, 'courseName', e.target.value)}
                  placeholder="课程名"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={item.originalScore}
                  onChange={(e) => updateRetake(index, 'originalScore', e.target.value)}
                  placeholder="原始成绩"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={item.retakeScore}
                  onChange={(e) => updateRetake(index, 'retakeScore', e.target.value)}
                  placeholder="重修成绩"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={item.credit}
                    onChange={(e) => updateRetake(index, 'credit', e.target.value)}
                    placeholder="学分"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeRetake(index)}
                    className="px-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            {formData.retakeDetails.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">点击上方按钮添加重修课程</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
