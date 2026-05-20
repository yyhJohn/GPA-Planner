import { useState } from 'react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'GPA 计算准确吗？',
      answer: '我们支持 4.0 制、5.0 制、百分制等多种 GPA 制式，算法参考各学校官方规则。但不同学校可能有特殊计算方式，建议以学校教务处出具的 GPA 为准。我们的工具更适合用于快速估算和选课模拟。',
    },
    {
      question: '数据安全吗？我的成绩会不会泄露？',
      answer: '你的成绩数据在本地计算，不会上传到第三方服务器。我们采用加密存储，且不会将你的数据用于任何商业用途。你随时可以删除自己的数据。',
    },
    {
      question: 'AI 选课建议靠谱吗？',
      answer: 'AI 选课建议基于历史成绩模式和课程难度分析，提供的是参考方向而非确定性预测。我们会明确标注每条建议的置信度，最终选课决策请结合自身情况和学校导师意见。',
    },
    {
      question: '支持哪些国家和学校？',
      answer: '目前主要覆盖英国、香港、新加坡、美国的热门硕士项目，包含 QS 前 200 的大部分学校。我们持续更新学校数据库，如果你的目标学校不在列表中，可以联系我们添加。',
    },
    {
      question: '付费报告和免费版有什么区别？',
      answer: '免费版可以无限次计算 GPA、每天 3 次选校预览。付费报告包含完整的 AI 选课方案、详细选校匹配（冲刺/匹配/稳妥三档）、个性化时间线、可下载 PDF 等。简单说，免费版够用，付费版更省心。',
    },
    {
      question: '退款政策是怎样的？',
      answer: '所有付费方案支持 24 小时内无理由退款。如果你对报告不满意，直接联系我们即可。',
    },
  ]

  return (
    <section id="faq" className="section-padding bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="section-title">
          常见问题
        </h2>
        <p className="section-subtitle">
          还有疑问？联系我们 support@studypath.ai
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
