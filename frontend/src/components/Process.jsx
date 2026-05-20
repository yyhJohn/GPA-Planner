export default function Process() {
  const steps = [
    {
      step: '01',
      title: '输入课程信息',
      description: '输入你的课程、学分、成绩。支持手动录入或从成绩单自动识别。',
      icon: '📝',
    },
    {
      step: '02',
      title: 'AI 分析你的 GPA',
      description: 'AI 自动计算 GPA，分析各科贡献，找出拖后腿的课程。',
      icon: '🤖',
    },
    {
      step: '03',
      title: '获取选课建议',
      description: 'AI 模拟不同选课组合的 GPA 变化，推荐最优方案。',
      icon: '💡',
    },
    {
      step: '04',
      title: '查看完整规划',
      description: '生成包含选校建议、时间线、行动清单的完整规划报告。',
      icon: '📋',
    },
  ]

  return (
    <section id="process" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">
          4 步，搞定留学规划
        </h2>
        <p className="section-subtitle">
          不需要填一堆表格，不需要等顾问回复，几分钟就能拿到专业建议
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-blue-200" />
              )}
              
              <div className="text-center">
                {/* Step number */}
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center text-4xl">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
