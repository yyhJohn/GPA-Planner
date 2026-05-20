export default function StepLanguage({ formData, updateField }) {
  return (
    <div className="space-y-6">
      {/* 语言成绩状态 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          语言成绩状态 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          {[
            { value: 'yes', label: '已有成绩' },
            { value: 'preparing', label: '正在准备' },
            { value: 'no', label: '还没考' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField('hasLanguageScore', option.value)}
              className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors text-sm ${
                formData.hasLanguageScore === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 雅思成绩 */}
      {(formData.hasLanguageScore === 'yes' || formData.hasLanguageScore === 'preparing') && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-medium text-gray-900 mb-4">📝 雅思成绩</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">总分</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="9"
                value={formData.ieltsTotal}
                onChange={(e) => updateField('ieltsTotal', e.target.value)}
                placeholder="7.0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">听力</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="9"
                value={formData.ieltsL}
                onChange={(e) => updateField('ieltsL', e.target.value)}
                placeholder="7.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">阅读</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="9"
                value={formData.ieltsR}
                onChange={(e) => updateField('ieltsR', e.target.value)}
                placeholder="7.0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">写作</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="9"
                value={formData.ieltsW}
                onChange={(e) => updateField('ieltsW', e.target.value)}
                placeholder="6.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">口语</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="9"
                value={formData.ieltsS}
                onChange={(e) => updateField('ieltsS', e.target.value)}
                placeholder="6.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 托福成绩 */}
      {(formData.hasLanguageScore === 'yes' || formData.hasLanguageScore === 'preparing') && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-medium text-gray-900 mb-4">📝 托福成绩</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">总分</label>
              <input type="number" min="0" max="120" value={formData.toeflTotal} onChange={(e) => updateField('toeflTotal', e.target.value)} placeholder="100" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">阅读</label>
              <input type="number" min="0" max="30" value={formData.toeflR} onChange={(e) => updateField('toeflR', e.target.value)} placeholder="28" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">听力</label>
              <input type="number" min="0" max="30" value={formData.toeflL} onChange={(e) => updateField('toeflL', e.target.value)} placeholder="26" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">口语</label>
              <input type="number" min="0" max="30" value={formData.toeflS} onChange={(e) => updateField('toeflS', e.target.value)} placeholder="23" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">写作</label>
              <input type="number" min="0" max="30" value={formData.toeflW} onChange={(e) => updateField('toeflW', e.target.value)} placeholder="23" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
      )}

      {/* GRE 成绩 */}
      {(formData.hasLanguageScore === 'yes' || formData.hasLanguageScore === 'preparing') && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-medium text-gray-900 mb-4">📝 GRE 成绩（选填）</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">总分</label>
              <input type="number" min="260" max="340" value={formData.greTotal} onChange={(e) => updateField('greTotal', e.target.value)} placeholder="325" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Quant</label>
              <input type="number" min="130" max="170" value={formData.greQuant} onChange={(e) => updateField('greQuant', e.target.value)} placeholder="168" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Verbal</label>
              <input type="number" min="130" max="170" value={formData.greVerbal} onChange={(e) => updateField('greVerbal', e.target.value)} placeholder="157" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">AW</label>
              <input type="number" min="0" max="6" step="0.5" value={formData.greAw} onChange={(e) => updateField('greAw', e.target.value)} placeholder="3.5" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
      )}

      {/* GMAT */}
      {(formData.hasLanguageScore === 'yes' || formData.hasLanguageScore === 'preparing') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GMAT 成绩（选填）</label>
          <input type="number" min="200" max="800" value={formData.gmatScore} onChange={(e) => updateField('gmatScore', e.target.value)} placeholder="710" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
        </div>
      )}

      {/* CET-4/6 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-medium text-gray-900 mb-4">📝 CET-4/6 成绩（选填）</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">CET-4</label>
            <input type="number" min="0" max="710" value={formData.cet4Score} onChange={(e) => updateField('cet4Score', e.target.value)} placeholder="550" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">CET-6</label>
            <input type="number" min="0" max="710" value={formData.cet6Score} onChange={(e) => updateField('cet6Score', e.target.value)} placeholder="500" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      {/* 计划考试时间 */}
      {formData.hasLanguageScore === 'preparing' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">计划考试时间</label>
          <input
            type="month"
            value={formData.plannedExamDate}
            onChange={(e) => updateField('plannedExamDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      )}
    </div>
  )
}
