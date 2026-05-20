# GPA Planner — 数据库设计说明

> PostgreSQL + Prisma ORM
> MVP 版本，11 张表

---

## 表关系总览（ER 图）

```
┌─────────┐
│  users   │
└────┬────┘
     │ 1:1
     ├──────────────→ student_profiles
     │ 1:N
     ├──────────────→ courses
     │ 1:N
     ├──────────────→ projects
     │ 1:N
     ├──────────────→ internships
     │ 1:N
     ├──────────────→ research_experiences
     │ 1:1
     ├──────────────→ target_preferences
     │ 1:N
     ├──────────────→ reports
     │                  │ 1:1
     │                  └──────────→ payments
     │ 1:N
     └──────────────→ payments

┌──────────────┐     1:N     ┌──────────┐
│ universities │ ──────────→ │ programs │
└──────────────┘             └──────────┘
```

---

## 各表职责

| 表 | 类型 | 说明 |
|-----|------|------|
| `users` | 用户数据 | 登录账号，核心主表 |
| `student_profiles` | 用户数据 | 学生背景（1:1 关联 users） |
| `courses` | 用户数据 | 已修/在修/可选课程（1:N） |
| `projects` | 用户数据 | 项目经历（1:N） |
| `internships` | 用户数据 | 实习经历（1:N） |
| `research_experiences` | 用户数据 | 科研经历（1:N） |
| `target_preferences` | 用户数据 | 申请目标偏好（1:1） |
| `reports` | 业务数据 | AI 生成的报告（1:N） |
| `payments` | 业务数据 | 支付记录（1:N） |
| `universities` | 参考数据 | 学校数据库（只读） |
| `programs` | 参考数据 | 硕士项目数据库（只读） |

---

## 关键设计决策

### 1. 为什么 `reports.content` 用 JSON？
```
报告内容是 AI 一次性生成的结构化数据，格式可能随时调整。
用 JSON 存储避免频繁改 schema，前端直接解析渲染。
后续稳定后可以拆成独立表。
```

### 2. 为什么 `courses` 不单独建 `retake_details` 表？
```
用 isRetake + originalScore 字段区分重修课程，复用同一张表。
查询更简单，不需要 JOIN。
```

### 3. 为什么 universities/programs 是独立表？
```
这是只读参考数据，预置约 200+ 热门学校 + 1000+ 项目。
不和用户数据混在一起，方便批量更新。
AI 匹配时通过 category/gpaMin 等字段筛选。
```

### 4. 金额用分（Int）不用浮点数？
```
避免浮点数精度问题。1990 = ¥19.90
```

### 5. JSON 字段汇总
```
以下字段用 JSON 字符串存储数组，Prisma 不支持原生数组类型：

student_profile:
  - targetIndustry     → ["互联网", "金融"]
  - specialBackground  → ["少数民族"]
  - existingOffers     → ["曼大 DS"]
  - concerns           → ["GPA太低", "没有实习"]

project:
  - techStack          → ["Python", "PyTorch"]

research:
  - fieldTags          → ["机器学习", "隐私计算"]

target_preference:
  - targetMajors       → ["数据科学", "AI"]
  - priorityFactors    → ["学校排名", "就业率"]
  - targetRegions      → ["uk", "hk"]
  - regionPrefOrder    → ["uk", "hk"]

university:
  - admissionInfo      → { "typical_gpa": "3.3+", ... }

program:
  - requiredCourses    → ["linear_algebra", "programming"]
  - preferredBackground → ["cs", "math"]
```

---

## 索引策略

```prisma
// 高频查询场景

// 1. 用户查自己的数据
@@index([userId])  // courses, projects, internships, research, reports, payments

// 2. 按国家查学校
@@index([country]) // universities

// 3. 按 QS 排名排序
@@index([qsRanking]) // universities

// 4. 按专业类别查项目
@@index([category]) // programs

// 5. 支付交易号查询
@@index([transactionId]) // payments
```

---

## 数据量预估（MVP 阶段）

| 表 | 6 个月预估行数 | 说明 |
|-----|-------------|------|
| users | 5,000 | 目标日活 200 |
| student_profiles | 5,000 | 1:1 |
| courses | 100,000 | 平均每人 20 门课 |
| projects | 10,000 | 平均每人 2 个 |
| internships | 5,000 | 不是每个人都有 |
| research | 2,500 | 少数人有 |
| target_preferences | 5,000 | 1:1 |
| reports | 15,000 | 平均每人 3 份 |
| payments | 3,000 | 付费转化率 ~5% |
| universities | 300 | 预置数据 |
| programs | 2,000 | 预置数据 |

---

## 初始化脚本

```bash
# 1. 创建数据库
createdb gpa_planner

# 2. 设置环境变量
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/gpa_planner"' > .env

# 3. 生成 Prisma Client
npx prisma generate

# 4. 推送 schema 到数据库（开发阶段）
npx prisma db push

# 5. 或者创建迁移（生产阶段）
npx prisma migrate dev --name init

# 6. 打开 Prisma Studio 查看数据
npx prisma studio
```

---

*最后更新：2026-05-19*
*作者：CodeCat 🧠 for 约翰上将*
