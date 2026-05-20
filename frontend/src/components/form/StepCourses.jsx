const semesters = [
  { value: 'freshman_fall', label: '大一上' },
  { value: 'freshman_spring', label: '大一下' },
  { value: 'sophomore_fall', label: '大二上' },
  { value: 'sophomore_spring', label: '大二下' },
  { value: 'junior_fall', label: '大三上' },
  { value: 'junior_spring', label: '大三下' },
  { value: 'senior_fall', label: '大四上' },
  { value: 'senior_spring', label: '大四下' },
]

const courseTypes = [
  { value: 'required', label: '必修' },
  { value: 'elective', label: '选修' },
  { value: 'general', label: '通识' },
  { value: 'lab', label: '实验' },
  { value: 'practice', label: '实践' },
]

const categories = [
  { value: 'math', label: '数学' },
  { value: 'english', label: '英语' },
  { value: 'major_core', label: '专业核心' },
  { value: 'major_elective', label: '专业选修' },
  { value: 'general', label: '通识' },
  { value: 'sports', label: '体育' },
  { value: 'politics', label: '思政' },
  { value: 'other', label: '其他' },
]

export default function StepCourses({ formData, updateField }) {
  const courses = formData.courses

  const addCourse = () => {
    updateField('courses', [
      ...courses,
      { courseName: '', courseType: 'required', credit: '', score: '', scoreType: 'grade', semester: 'freshman_fall', category: '' },
    ])
  }

  const updateCourse = (index, field, value) => {
    const updated = [...courses]
    updated[index][field] = value
    updateField('courses', updated)
  }

  const removeCourse = (index) => {
    updateField(
      'courses',
      courses.filter((_, i) => i !== index)
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">
            添加你已修的课程，至少 5 门。信息越完整，AI 分析越精准。
          </p>
        </div>
        <button
          type="button"
          onClick={addCourse}
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + 添加课程
        </button>
      </div>

      {/* Course list */}
      <div className="space-y-4">
        {courses.map((course, index) => (
          <div key={index} className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">课程 {index + 1}</span>
              {courses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCourse(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  删除
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 课程名 */}
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={course.courseName}
                  onChange={(e) => updateCourse(index, 'courseName', e.target.value)}
                  placeholder="课程名称"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 课程类型 */}
              <select
                value={course.courseType}
                onChange={(e) => updateCourse(index, 'courseType', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {courseTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>

              {/* 学分 */}
              <input
                type="number"
                value={course.credit}
                onChange={(e) => updateCourse(index, 'credit', e.target.value)}
                placeholder="学分"
                min="0.5"
                step="0.5"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* 成绩 */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={course.score}
                  onChange={(e) => updateCourse(index, 'score', e.target.value)}
                  placeholder="成绩"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={course.scoreType}
                  onChange={(e) => updateCourse(index, 'scoreType', e.target.value)}
                  className="px-2 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="grade">等级制</option>
                  <option value="percentage">百分制</option>
                </select>
              </div>

              {/* 学期 */}
              <select
                value={course.semester}
                onChange={(e) => updateCourse(index, 'semester', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {semesters.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>

              {/* 课程分类 */}
              <select
                value={course.category}
                onChange={(e) => updateCourse(index, 'category', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">课程分类</option>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Quick add hint */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-sm text-blue-700">
          💡 <strong>提示：</strong>你可以先把记得的课程填上，后续随时补充。
          选完学校和专业后，系统会自动推荐常见课程模板。
        </p>
      </div>
    </div>
  )
}
