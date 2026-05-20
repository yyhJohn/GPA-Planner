export default function Features() {
  const features = [
    {
      icon: '📊',
      title: 'GPA 精准计算',
      description: '支持 4.0/5.0/百分制等多种制式，自动换算，一键得出准确 GPA。',
    },
    {
      icon: '🎯',
      title: 'AI 选课模拟',
      description: '输入下学期可选课程，AI 预测每种组合的 GPA 变化，推荐最优方案。',
    },
    {
      icon: '🏫',
      title: '选校智能匹配',
      description: '根据你的 GPA 和目标，推荐冲刺/匹配/稳妥三档学校方案。',
    },
    {
      icon: '📈',
      title: 'GPA 提升路线',
      description: '量化分析每门课的 GPA 贡献，告诉你选哪些课性价比最高。',
    },
    {
      icon: '📅',
      title: '申请时间线',
      description: '根据你的年级自动生成申请 Checklist，关键节点不再错过。',
    },
    {
      icon: '🔒',
      title: '数据安全',
      description: '成绩数据本地计算，加密存储，不泄露给任何第三方。',
    },
  ]

  return (
    <section id="features" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">
          你需要的，我们都想到了
        </h2>
        <p className="section-subtitle">
          从 GPA 计算到选校规划，一个工具搞定留学申请中最头疼的问题
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
