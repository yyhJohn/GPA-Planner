const gradeOptions = [
  { value: 'freshman', label: '大一' },
  { value: 'sophomore', label: '大二' },
  { value: 'junior', label: '大三' },
  { value: 'senior', label: '大四' },
  { value: 'graduated', label: '已毕业' },
]

export default function StepBasicInfo({ formData, updateField }) {
  return (
    <div className="space-y-6">
      {/* 姓名 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          姓名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="请输入你的姓名"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* 性别 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">性别</label>
        <div className="flex gap-3">
          {[
            { value: 'male', label: '男' },
            { value: 'female', label: '女' },
            { value: 'other', label: '不透露' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField('gender', option.value)}
              className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                formData.gender === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 年级 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          年级 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {gradeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField('grade', option.value)}
              className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors text-sm ${
                formData.grade === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 邮箱 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          邮箱 <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* 手机号 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">手机号（选填）</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="13800138000"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* 微信号 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">微信号（选填）</label>
        <input
          type="text"
          value={formData.wechatId}
          onChange={(e) => updateField('wechatId', e.target.value)}
          placeholder="your_wechat_id"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>
    </div>
  )
}
