// ============================================================
// 常量定义
// ============================================================

// 学校层次
export const UNIVERSITY_TIERS = [
  { value: '985', label: '985' },
  { value: '211', label: '211' },
  { value: 'double_first', label: '双一流' },
  { value: 'normal', label: '普通本科' },
  { value: 'joint', label: '中外合办' },
]

// 年级
export const GRADES = [
  { value: 'freshman', label: '大一' },
  { value: 'sophomore', label: '大二' },
  { value: 'junior', label: '大三' },
  { value: 'senior', label: '大四' },
  { value: 'graduated', label: '已毕业' },
]

// GPA 制式
export const GPA_SCALES = [
  { value: '4.0', label: '4.0 制' },
  { value: '5.0', label: '5.0 制' },
  { value: '100', label: '百分制' },
  { value: 'other', label: '其他' },
]

// GPA 计算规则
export const GPA_CALC_RULES = [
  { value: 'weighted', label: '加权平均' },
  { value: 'arithmetic', label: '算术平均' },
  { value: 'custom', label: '学校自定义' },
]

// 学期
export const SEMESTERS = [
  { value: 'freshman_fall', label: '大一上' },
  { value: 'freshman_spring', label: '大一下' },
  { value: 'sophomore_fall', label: '大二上' },
  { value: 'sophomore_spring', label: '大二下' },
  { value: 'junior_fall', label: '大三上' },
  { value: 'junior_spring', label: '大三下' },
  { value: 'senior_fall', label: '大四上' },
  { value: 'senior_spring', label: '大四下' },
]

// 课程类型
export const COURSE_TYPES = [
  { value: 'required', label: '必修' },
  { value: 'elective', label: '选修' },
  { value: 'general', label: '通识' },
  { value: 'lab', label: '实验' },
  { value: 'practice', label: '实践' },
]

// 课程分类
export const COURSE_CATEGORIES = [
  { value: 'math', label: '数学' },
  { value: 'english', label: '英语' },
  { value: 'major_core', label: '专业核心' },
  { value: 'major_elective', label: '专业选修' },
  { value: 'general', label: '通识' },
  { value: 'sports', label: '体育' },
  { value: 'politics', label: '思政' },
  { value: 'other', label: '其他' },
]

// 申请学位
export const TARGET_DEGREES = [
  { value: 'taught_master', label: '授课型硕士' },
  { value: 'research_master', label: '研究型硕士' },
  { value: 'phd', label: '直博' },
]

// 目标地区
export const TARGET_REGIONS = [
  { value: 'uk', label: '🇬🇧 英国' },
  { value: 'hk', label: '🇭🇰 香港' },
  { value: 'sg', label: '🇸🇬 新加坡' },
  { value: 'us', label: '🇺🇸 美国' },
  { value: 'au', label: '🇦🇺 澳大利亚' },
  { value: 'ca', label: '🇨🇦 加拿大' },
  { value: 'jp', label: '🇯🇵 日本' },
  { value: 'eu', label: '🇪🇺 欧洲其他' },
]

// 目标专业选项
export const MAJOR_OPTIONS = [
  '计算机科学', '数据科学', '人工智能', '软件工程', '信息安全',
  '电子工程', '通信工程', '自动化', '机械工程', '土木工程',
  '金融学', '经济学', '会计学', '商业分析', '市场营销',
  '管理学', 'MBA', '公共政策', '国际关系',
  '数学', '统计学', '物理学', '化学', '生物学',
  '教育学', 'TESOL', '传媒学', '法学', '心理学',
  '建筑学', '设计学', '艺术管理',
]

// 跨专业选项
export const CROSS_MAJOR_OPTIONS = [
  { value: 'full', label: '是，完全跨专业' },
  { value: 'related', label: '是，相关方向跨' },
  { value: 'no', label: '否，必须对口' },
]

// 选校优先级
export const PRIORITY_FACTORS = [
  '学校排名', '专业排名', '就业率', '城市偏好', '学费低', '奖学金', '移民政策', '科研资源',
]

// 语言成绩状态
export const LANGUAGE_STATUS = [
  { value: 'yes', label: '已有成绩' },
  { value: 'preparing', label: '正在准备' },
  { value: 'no', label: '还没考' },
]

// 学费预算
export const TUITION_BUDGETS = [
  { value: '15w_below', label: '15 万以下' },
  { value: '15-25w', label: '15-25 万' },
  { value: '25-35w', label: '25-35 万' },
  { value: '35-45w', label: '35-45 万' },
  { value: '45w_above', label: '45 万以上' },
  { value: 'unlimited', label: '无上限' },
]

// 生活费预算
export const LIVING_BUDGETS = [
  { value: '10w_below', label: '10 万以下' },
  { value: '10-15w', label: '10-15 万' },
  { value: '15-20w', label: '15-20 万' },
  { value: '20w_above', label: '20 万以上' },
]

// 奖学金需求
export const SCHOLARSHIP_OPTIONS = [
  { value: 'required', label: '必须有奖学金' },
  { value: 'preferred', label: '有最好' },
  { value: 'no', label: '不需要' },
]

// 毕业后计划
export const POST_GRAD_PLANS = [
  { value: 'domestic', label: '回国就业' },
  { value: 'overseas', label: '海外就业' },
  { value: 'phd', label: '继续读博' },
  { value: 'startup', label: '创业' },
  { value: 'undecided', label: '未定' },
]

// 目标行业
export const INDUSTRY_OPTIONS = [
  '互联网/科技', '金融', '咨询', '教育', '医疗', '政府/公共', '学术/科研', '其他',
]

// 用户担忧
export const CONCERN_OPTIONS = [
  'GPA太低', '没有实习', '语言成绩不够', '不知道选什么学校', '文书不会写', '时间不够', '钱不够',
]

// 渠道来源
export const REFERRAL_OPTIONS = [
  '小红书', '微信朋友圈', '同学推荐', '搜索引擎', '知乎', '其他',
]

// 项目类型
export const PROJECT_TYPES = [
  { value: 'course', label: '课程项目' },
  { value: 'personal', label: '个人项目' },
  { value: 'competition', label: '竞赛项目' },
  { value: 'company', label: '企业项目' },
]

// 竞赛级别
export const COMPETITION_LEVELS = [
  { value: 'international', label: '国际级' },
  { value: 'national', label: '国家级' },
  { value: 'provincial', label: '省级' },
  { value: 'school', label: '校级' },
]

// 产品价格（单位：分）
export const PRICING = {
  single_report: { amount: 1990, name: 'AI 选课方案', label: '¥19.9/次' },
  full_report: { amount: 2990, name: '完整选校报告', label: '¥29.9/次' },
  membership_month: { amount: 3900, name: 'Pro 月卡', label: '¥39/月' },
  membership_quarter: { amount: 9900, name: 'Pro 季卡', label: '¥99/季' },
}
