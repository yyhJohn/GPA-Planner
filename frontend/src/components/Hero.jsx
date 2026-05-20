import GPACalculator from './GPACalculator'

export default function Hero() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-12">
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

        {/* Interactive GPA Calculator */}
        <div className="max-w-2xl mx-auto">
          <GPACalculator />
        </div>
      </div>
    </section>
  )
}
