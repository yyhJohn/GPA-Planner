export default function Hero() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="animate-pulse">✨</span>
            AI 驱动的留学规划工具
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            你的 GPA，
            <span className="text-blue-600">还能再提一提</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            AI 帮你算清楚 GPA、选对课、规划好硕士申请路线。
            <br />
            不是中介，不卖申请——只是一个好用的规划工具。
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="#cta" className="btn-white text-center">
              🚀 免费计算我的 GPA
            </a>
            <a href="#process" className="btn-secondary text-center">
              了解它是怎么工作的 →
            </a>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              免费使用
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              无需登录
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              30 秒出结果
            </span>
          </div>
        </div>

        {/* Hero visual - GPA calculator preview */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                📊
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">GPA 计算器</h3>
                <p className="text-sm text-gray-500">输入课程信息，即时计算</p>
              </div>
            </div>
            
            {/* Sample course rows */}
            <div className="space-y-3 mb-6">
              {[
                { name: '高等数学 A', credit: '4', score: 'A', color: 'text-green-600' },
                { name: '大学英语', credit: '3', score: 'B+', color: 'text-blue-600' },
                { name: '线性代数', credit: '3', score: 'A-', color: 'text-green-600' },
                { name: '数据结构', credit: '4', score: 'B', color: 'text-yellow-600' },
              ].map((course, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="flex-1 font-medium text-gray-700">{course.name}</span>
                  <span className="text-sm text-gray-500">{course.credit} 学分</span>
                  <span className={`font-bold ${course.color}`}>{course.score}</span>
                </div>
              ))}
            </div>

            {/* GPA result */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white text-center">
              <p className="text-sm opacity-90 mb-1">你的 GPA</p>
              <p className="text-4xl font-bold">3.52</p>
              <p className="text-sm opacity-90 mt-1">4.0 制 · 排名前 18%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
