export default function ReportPreview() {
  const sections = [
    {
      icon: '📊',
      title: 'GPA 分析',
      content: '当前 GPA 3.28/4.0，位于目标校申请者中等偏上水平。核心课 GPA 3.52 高于总体，数学类课程有提升空间。',
    },
    {
      icon: '🏫',
      title: '选校建议',
      content: '冲刺：UCL, 港大 | 匹配：爱丁堡, 港中文 | 稳妥：布里斯托, 港城市',
    },
    {
      icon: '🎯',
      title: '选课推荐',
      content: '下学期推荐选修「机器学习实践」和「数据可视化」，预计 GPA 可提升至 3.42。',
    },
    {
      icon: '📅',
      title: '时间线',
      content: '大三上：选课优化+开始雅思 → 大三下：考出语言+实习 → 大四上：文书+提交申请',
    },
  ]

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">
          看看报告长什么样
        </h2>
        <p className="section-subtitle">
          这是一份示例报告的部分内容，完整报告包含 12 个模块
        </p>

        <div className="max-w-4xl mx-auto">
          {/* Report card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Report header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">📊 GPA 规划报告</h3>
                  <p className="text-blue-100 text-sm mt-1">示例报告 · 2026-05-19</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-100">综合竞争力</p>
                  <p className="text-3xl font-bold">65<span className="text-lg">/100</span></p>
                </div>
              </div>
            </div>

            {/* Report content */}
            <div className="p-6 md:p-8 space-y-6">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  <div className="text-3xl">{section.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{section.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{section.content}</p>
                  </div>
                </div>
              ))}

              {/* Blur preview */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white z-10" />
                <div className="filter blur-[2px] opacity-50">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <a href="#cta" className="btn-primary shadow-lg">
                    🔓 解锁完整报告
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
