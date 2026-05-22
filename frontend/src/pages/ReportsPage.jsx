import { useState, useEffect } from 'react'
import { reportService } from '../services'

export default function ReportsPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })

  useEffect(() => {
    loadReports(1)
  }, [])

  const loadReports = async (page) => {
    try {
      setLoading(true)
      const res = await reportService.list({ page, pageSize: 10 })
      setReports(res.data.items)
      setPagination(res.data.pagination)
    } catch (err) {
      console.error('Load reports error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="text-xl">🎓</span>
            <span className="font-bold text-gray-900">GPA Planner</span>
          </a>
          <a href="#/profile" className="btn-primary text-sm">
            + 新建报告
          </a>
          <a href="#/profile/edit" className="btn-secondary text-sm">
            ✏️ 修改背景
          </a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">📋 我的报告</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4 animate-pulse">📊</div>
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">还没有报告</h2>
            <p className="text-gray-500 mb-6">填写你的背景信息，AI 为你生成专属规划报告</p>
            <a href="#/profile" className="btn-primary">
              开始填写 →
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <a
                key={report.id}
                href={`#/report/${report.id}`}
                className="block bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      GPA {report.gpaSnapshot}/{report.gpaScale} ·{' '}
                      {new Date(report.createdAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {report.competitivenessScore && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{report.competitivenessScore}</p>
                        <p className="text-xs text-gray-500">竞争力</p>
                      </div>
                    )}
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        report.isPaid
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {report.isPaid ? '完整版' : '免费版'}
                    </span>
                  </div>
                </div>
              </a>
            ))}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => loadReports(page)}
                    className={`px-3 py-1 rounded ${
                      page === pagination.page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
