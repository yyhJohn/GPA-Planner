export default function TargetAudience() {
  const audiences = [
    {
      emoji: '🎓',
      title: '大一新生',
      description: '不懂 GPA 怎么算，选课没方向？帮你从大一开始规划，少走弯路。',
      highlight: '早规划，GPA 更高',
    },
    {
      emoji: '📚',
      title: '大二大三核心用户',
      description: 'GPA 2.8-3.3，想冲 3.5+？AI 告诉你选哪些课最划算。',
      highlight: '最焦虑的一群人',
    },
    {
      emoji: '🚀',
      title: '大四冲刺者',
      description: 'GPA 已定型，需要「怎么用现有 GPA 选校」？帮你找到最优解。',
      highlight: '时间紧，更要精准',
    },
    {
      emoji: '🔄',
      title: '考研转留学',
      description: '时间紧迫，需要快速规划。帮你最短时间内制定完整申请方案。',
      highlight: '快速出方案',
    },
  ]

  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">
          谁适合用 StudyPath AI？
        </h2>
        <p className="section-subtitle">
          不管你是大一还是大四，只要你想留学，这个工具都能帮到你
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {audiences.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{item.emoji}</span>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {item.highlight}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
