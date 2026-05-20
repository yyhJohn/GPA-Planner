export default function StepExperience({ formData, updateField }) {
  // Projects
  const addProject = () => {
    updateField('projects', [
      ...formData.projects,
      { name: '', role: '', type: 'course', techStack: '', description: '', duration: '', outcome: '' },
    ])
  }
  const updateProject = (index, field, value) => {
    const updated = [...formData.projects]
    updated[index][field] = value
    updateField('projects', updated)
  }
  const removeProject = (index) => {
    updateField('projects', formData.projects.filter((_, i) => i !== index))
  }

  // Internships
  const addInternship = () => {
    updateField('internships', [
      ...formData.internships,
      { company: '', position: '', department: '', duration: '', description: '', achievement: '', relatedLevel: '' },
    ])
  }
  const updateInternship = (index, field, value) => {
    const updated = [...formData.internships]
    updated[index][field] = value
    updateField('internships', updated)
  }
  const removeInternship = (index) => {
    updateField('internships', formData.internships.filter((_, i) => i !== index))
  }

  // Research
  const addResearch = () => {
    updateField('research', [
      ...formData.research,
      { topic: '', advisor: '', lab: '', duration: '', role: '', description: '', output: '', fieldTags: '' },
    ])
  }
  const updateResearch = (index, field, value) => {
    const updated = [...formData.research]
    updated[index][field] = value
    updateField('research', updated)
  }
  const removeResearch = (index) => {
    updateField('research', formData.research.filter((_, i) => i !== index))
  }

  // Competitions
  const addCompetition = () => {
    updateField('competitions', [
      ...formData.competitions,
      { name: '', level: '', award: '', date: '', role: '', description: '' },
    ])
  }
  const updateCompetition = (index, field, value) => {
    const updated = [...formData.competitions]
    updated[index][field] = value
    updateField('competitions', updated)
  }
  const removeCompetition = (index) => {
    updateField('competitions', formData.competitions.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-gray-600">
        以下经历均为选填，但填写越多，AI 分析越精准。可以先填一部分，后续随时补充。
      </p>

      {/* ===== 项目经历 ===== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📋 项目经历</h3>
          <button type="button" onClick={addProject} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            + 添加项目
          </button>
        </div>
        {formData.projects.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-lg">暂无项目经历，点击上方按钮添加</p>
        )}
        {formData.projects.map((proj, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500">项目 {i + 1}</span>
              <button type="button" onClick={() => removeProject(i)} className="text-red-500 hover:text-red-700 text-sm">删除</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" value={proj.name} onChange={(e) => updateProject(i, 'name', e.target.value)} placeholder="项目名称" className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" value={proj.role} onChange={(e) => updateProject(i, 'role', e.target.value)} placeholder="你的角色" className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <select value={proj.type} onChange={(e) => updateProject(i, 'type', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="course">课程项目</option>
                <option value="personal">个人项目</option>
                <option value="competition">竞赛项目</option>
                <option value="company">企业项目</option>
              </select>
              <input type="text" value={proj.duration} onChange={(e) => updateProject(i, 'duration', e.target.value)} placeholder="时间段" className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" value={proj.techStack} onChange={(e) => updateProject(i, 'techStack', e.target.value)} placeholder="技术栈（逗号分隔）" className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2" />
              <textarea value={proj.description} onChange={(e) => updateProject(i, 'description', e.target.value)} placeholder="项目描述" rows={2} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2 resize-none" />
            </div>
          </div>
        ))}
      </div>

      {/* ===== 实习经历 ===== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">💼 实习经历</h3>
          <button type="button" onClick={addInternship} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            + 添加实习
          </button>
        </div>
        {formData.internships.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-lg">暂无实习经历，点击上方按钮添加</p>
        )}
        {formData.internships.map((intern, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500">实习 {i + 1}</span>
              <button type="button" onClick={() => removeInternship(i)} className="text-red-500 hover:text-red-700 text-sm">删除</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" value={intern.company} onChange={(e) => updateInternship(i, 'company', e.target.value)} placeholder="公司名称" className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" value={intern.position} onChange={(e) => updateInternship(i, 'position', e.target.value)} placeholder="职位" className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" value={intern.department} onChange={(e) => updateInternship(i, 'department', e.target.value)} placeholder="部门（选填）" className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" value={intern.duration} onChange={(e) => updateInternship(i, 'duration', e.target.value)} placeholder="时间段" className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <textarea value={intern.description} onChange={(e) => updateInternship(i, 'description', e.target.value)} placeholder="工作内容" rows={2} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2 resize-none" />
            </div>
          </div>
        ))}
      </div>

      {/* ===== 科研经历 ===== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🔬 科研经历</h3>
          <button type="button" onClick={addResearch} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            + 添加科研
          </button>
        </div>
        {formData.research.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-lg">暂无科研经历，点击上方按钮添加</p>
        )}
        {formData.research.map((res, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500">科研 {i + 1}</span>
              <button type="button" onClick={() => removeResearch(i)} className="text-red-500 hover:text-red-700 text-sm">删除</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" value={res.topic} onChange={(e) => updateResearch(i, 'topic', e.target.value)} placeholder="研究课题" className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" value={res.advisor} onChange={(e) => updateResearch(i, 'advisor', e.target.value)} placeholder="导师（选填）" className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" value={res.lab} onChange={(e) => updateResearch(i, 'lab', e.target.value)} placeholder="实验室/课题组" className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" value={res.duration} onChange={(e) => updateResearch(i, 'duration', e.target.value)} placeholder="时间段" className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" value={res.output} onChange={(e) => updateResearch(i, 'output', e.target.value)} placeholder="产出（论文/专利）" className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2" />
              <textarea value={res.description} onChange={(e) => updateResearch(i, 'description', e.target.value)} placeholder="研究内容" rows={2} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2 resize-none" />
            </div>
          </div>
        ))}
      </div>

      {/* ===== 竞赛经历 ===== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🏆 竞赛经历</h3>
          <button type="button" onClick={addCompetition} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            + 添加竞赛
          </button>
        </div>
        {formData.competitions.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-lg">暂无竞赛经历，点击上方按钮添加</p>
        )}
        {formData.competitions.map((comp, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4 mb-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500">竞赛 {i + 1}</span>
              <button type="button" onClick={() => removeCompetition(i)} className="text-red-500 hover:text-red-700 text-sm">删除</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" value={comp.name} onChange={(e) => updateCompetition(i, 'name', e.target.value)} placeholder="竞赛名称" className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <select value={comp.level} onChange={(e) => updateCompetition(i, 'level', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">竞赛级别</option>
                <option value="international">国际级</option>
                <option value="national">国家级</option>
                <option value="provincial">省级</option>
                <option value="school">校级</option>
              </select>
              <input type="text" value={comp.award} onChange={(e) => updateCompetition(i, 'award', e.target.value)} placeholder="获奖等级" className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="month" value={comp.date} onChange={(e) => updateCompetition(i, 'date', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
