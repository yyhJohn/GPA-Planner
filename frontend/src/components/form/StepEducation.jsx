const universities = [
  '清华大学', '北京大学', '复旦大学', '上海交通大学', '浙江大学',
  '中国科学技术大学', '南京大学', '武汉大学', '华中科技大学', '中山大学',
  '哈尔滨工业大学', '西安交通大学', '北京航空航天大学', '同济大学', '北京理工大学',
  '东南大学', '南开大学', '天津大学', '山东大学', '厦门大学',
  '吉林大学', '大连理工大学', '华南理工大学', '电子科技大学', '重庆大学',
  '中南大学', '湖南大学', '兰州大学', '东北大学', '西北工业大学',
  '北京师范大学', '华东师范大学', '中国农业大学', '中国海洋大学', '中央民族大学',
  '北京交通大学', '北京科技大学', '北京邮电大学', '华北电力大学', '北京工业大学',
  '上海大学', '苏州大学', '南京理工大学', '南京航空航天大学', '河海大学',
  '江南大学', '南京师范大学', '南京农业大学', '中国矿业大学', '中国药科大学',
  '武汉理工大学', '华中师范大学', '华中农业大学', '中南财经政法大学', '中国地质大学',
  '西南大学', '西南交通大学', '电子科技大学', '四川大学', '西安电子科技大学',
  '西北农林科技大学', '陕西师范大学', '长安大学', '西北大学', '西安电子科技大学',
  '郑州大学', '南昌大学', '云南大学', '广西大学', '贵州大学',
  '海南大学', '内蒙古大学', '辽宁大学', '延边大学', '东北林业大学',
  '东北农业大学', '哈尔滨工程大学', '太原理工大学', '合肥工业大学', '安徽大学',
  '福州大学', '暨南大学', '华南师范大学', '深圳大学', '南方科技大学',
  '上海财经大学', '中央财经大学', '对外经济贸易大学', '西南财经大学', '中南财经政法大学',
  '北京外国语大学', '上海外国语大学', '北京语言大学', '广东外语外贸大学',
  '中国政法大学', '华东政法大学', '西南政法大学', '中南财经政法大学',
  '北京体育大学', '上海体育学院', '首都体育学院',
  '中国科学院大学', '上海科技大学', '西湖大学',
  '宁波诺丁汉大学', '西交利物浦大学', '昆山杜克大学', '上海纽约大学',
  '香港中文大学（深圳）', '香港科技大学（广州）',
]

const tiers = [
  { value: '985', label: '985' },
  { value: '211', label: '211' },
  { value: 'double_first', label: '双一流' },
  { value: 'normal', label: '普通本科' },
  { value: 'joint', label: '中外合办' },
]

export default function StepEducation({ formData, updateField }) {
  const filteredUniversities = formData.university
    ? universities.filter((u) =>
        u.toLowerCase().includes(formData.university.toLowerCase())
      )
    : universities.slice(0, 10)

  return (
    <div className="space-y-6">
      {/* 本科学校 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          本科学校 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.university}
          onChange={(e) => updateField('university', e.target.value)}
          placeholder="输入学校名称搜索..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        {formData.university && (
          <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredUniversities.length > 0 ? (
              filteredUniversities.map((uni) => (
                <button
                  key={uni}
                  type="button"
                  onClick={() => updateField('university', uni)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-sm"
                >
                  {uni}
                </button>
              ))
            ) : (
              <p className="px-4 py-2 text-sm text-gray-500">未找到匹配学校</p>
            )}
          </div>
        )}
      </div>

      {/* 学校层次 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">学校层次</label>
        <div className="flex flex-wrap gap-3">
          {tiers.map((tier) => (
            <button
              key={tier.value}
              type="button"
              onClick={() => updateField('universityTier', tier.value)}
              className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors text-sm ${
                formData.universityTier === tier.value
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* 学院 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">学院（选填）</label>
        <input
          type="text"
          value={formData.college}
          onChange={(e) => updateField('college', e.target.value)}
          placeholder="如：计算机学院"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* 本科专业 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          本科专业 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.major}
          onChange={(e) => updateField('major', e.target.value)}
          placeholder="如：计算机科学与技术"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* 辅修/双学位 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">辅修 / 双学位（选填）</label>
        <input
          type="text"
          value={formData.minor}
          onChange={(e) => updateField('minor', e.target.value)}
          placeholder="如：金融学"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* 学制 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">学制</label>
        <div className="flex gap-3">
          {[
            { value: 3, label: '3 年制' },
            { value: 4, label: '4 年制' },
            { value: 5, label: '5 年制' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField('duration', option.value)}
              className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                formData.duration === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 预计毕业时间 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          预计毕业时间 <span className="text-red-500">*</span>
        </label>
        <input
          type="month"
          value={formData.graduationDate}
          onChange={(e) => updateField('graduationDate', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>
    </div>
  )
}
