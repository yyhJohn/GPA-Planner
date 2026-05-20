export default function Pricing() {
  const plans = [
    {
      name: '免费版',
      price: '¥0',
      period: '',
      description: '先试试看，好用再付费',
      features: [
        '✅ GPA 计算（不限次数）',
        '✅ GPA 换算（多种制式）',
        '✅ 选校预览（每天 3 次）',
        '✅ 通用时间线模板',
        '❌ AI 选课建议',
        '❌ 完整选校报告',
        '❌ PDF 下载',
      ],
      cta: '免费使用',
      ctaStyle: 'btn-secondary',
      popular: false,
    },
    {
      name: '单次报告',
      price: '¥19.9',
      period: '/次',
      description: '一次性获取完整分析报告',
      features: [
        '✅ 免费版全部功能',
        '✅ AI 选课方案推荐',
        '✅ 完整选校匹配（冲/稳/保）',
        '✅ GPA 提升路线图',
        '✅ 个性化时间线',
        '✅ PDF 下载',
        '❌ 无限次使用',
      ],
      cta: '立即获取',
      ctaStyle: 'btn-primary',
      popular: true,
    },
    {
      name: 'Pro 会员',
      price: '¥39',
      period: '/月',
      description: '高频用户最佳选择',
      features: [
        '✅ 单次报告全部功能',
        '✅ 无限次 AI 分析',
        '✅ 选课模拟器',
        '✅ 优先体验新功能',
        '✅ 专属客服支持',
        '✅ 多份报告对比',
        '✅ 成绩单 OCR',
      ],
      cta: '开通会员',
      ctaStyle: 'btn-secondary',
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">
          选择适合你的方案
        </h2>
        <p className="section-subtitle">
          所有方案均可先免费体验 GPA 计算，满意再付费
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl border-2 p-8 ${
                plan.popular
                  ? 'border-blue-600 shadow-xl scale-[1.02]'
                  : 'border-gray-100 shadow-sm hover:shadow-md'
              } transition-all duration-300`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    最受欢迎
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
              </div>

              {/* Features list */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-gray-600 text-sm">
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#cta"
                className={`${plan.ctaStyle} w-full text-center block`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Money back guarantee */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>💡 所有付费方案支持 24 小时内无理由退款</p>
        </div>
      </div>
    </section>
  )
}
