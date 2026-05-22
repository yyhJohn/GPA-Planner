export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎓</span>
              <span className="text-xl font-bold text-white">
                Study<span className="text-blue-400">Path</span> AI
              </span>
            </a>
            <p className="text-sm leading-relaxed">
              AI 驱动的留学规划工具，帮你算清楚 GPA、选对课、规划好申请路线。
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">产品</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">功能介绍</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">价格方案</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">常见问题</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">资源</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">留学指南</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GPA 计算器</a></li>
              <li><a href="#" className="hover:text-white transition-colors">选校数据库</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">法律</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">用户协议</a></li>
              <li><a href="#" className="hover:text-white transition-colors">隐私政策</a></li>
              <li><a href="#" className="hover:text-white transition-colors">退款政策</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © 2026 GPA Planner. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 max-w-2xl text-center md:text-right">
            ⚠️ 免责声明：本工具基于公开数据和 AI 分析提供参考建议，不构成任何录取承诺。学校录取标准可能随时调整，请以各校官网最新信息为准。
          </p>
        </div>
      </div>
    </footer>
  )
}
