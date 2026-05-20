# GPA Planner — 后端 API 设计

> Node.js + Express + Prisma + PostgreSQL + OpenAI API
> RESTful 风格，JWT 认证

---

## 通用规范

### 基础 URL
```
https://api.gpa-planner.com/v1
```

### 请求头
```
Content-Type: application/json
Authorization: Bearer <jwt_token>  // 需要登录的接口
```

### 统一响应格式
```json
// 成功
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}

// 失败
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "邮箱或密码错误"
  }
}
```

### 分页格式
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### 通用错误码
| HTTP Status | Code | 说明 |
|-------------|------|------|
| 400 | BAD_REQUEST | 请求参数错误 |
| 401 | UNAUTHORIZED | 未登录或 token 过期 |
| 403 | FORBIDDEN | 无权限访问 |
| 404 | NOT_FOUND | 资源不存在 |
| 409 | CONFLICT | 资源冲突（如邮箱已注册） |
| 422 | VALIDATION_ERROR | 参数校验失败 |
| 429 | RATE_LIMITED | 请求过于频繁 |
| 500 | INTERNAL_ERROR | 服务器内部错误 |

---

## 1. 用户注册

### `POST /auth/register`

**需要登录**: ❌

**请求参数**:
```json
{
  "email": "zhangsan@example.com",
  "password": "Abc123456",
  "name": "张三"
}
```

| 字段 | 类型 | 必填 | 校验规则 |
|------|------|------|---------|
| email | string | ✅ | 合法邮箱格式 |
| password | string | ✅ | 8-32 位，含大小写+数字 |
| name | string | ✅ | 2-50 字符 |

**成功响应** (201):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx1abc...",
      "email": "zhangsan@example.com",
      "name": "张三",
      "createdAt": "2026-05-19T12:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "注册成功"
}
```

**错误响应**:
| Code | 说明 |
|------|------|
| 409 EMAIL_EXISTS | 该邮箱已被注册 |
| 422 VALIDATION_ERROR | 邮箱格式错误 / 密码不符合要求 |

---

## 2. 用户登录

### `POST /auth/login`

**需要登录**: ❌

**请求参数**:
```json
{
  "email": "zhangsan@example.com",
  "password": "Abc123456"
}
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx1abc...",
      "email": "zhangsan@example.com",
      "name": "张三"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "hasProfile": true
  }
}
```

**错误响应**:
| Code | 说明 |
|------|------|
| 401 INVALID_CREDENTIALS | 邮箱或密码错误 |
| 422 VALIDATION_ERROR | 参数缺失 |

**说明**: `hasProfile` 字段告诉前端是否需要跳转到背景填写页。

---

## 3. 保存学生背景

### `POST /profile`

**需要登录**: ✅

**请求参数**:
```json
{
  "gender": "male",
  "grade": "junior",
  "university": "武汉大学",
  "universityTier": "985",
  "college": "计算机学院",
  "major": "计算机科学与技术",
  "minor": "金融学",
  "duration": 4,
  "graduationDate": "2027-06-01",
  "currentGpa": 3.28,
  "gpaScale": 4.0,
  "gpaRanking": "前15%",
  "majorGpa": 3.52,
  "percentageAvg": 85,
  "gpaCalcRule": "weighted",
  "hasRetake": false,
  "hasLanguageScore": "yes",
  "ieltsTotal": 7.0,
  "ieltsL": 7.5,
  "ieltsR": 7.0,
  "ieltsW": 6.5,
  "ieltsS": 6.5,
  "tuitionBudget": "25-35w",
  "needScholarship": "preferred",
  "postGradPlan": "domestic",
  "targetIndustry": ["互联网", "金融"],
  "concerns": ["GPA太低", "没有实习"],
  "extracurriculars": "学生会主席",
  "additionalInfo": ""
}
```

**成功响应** (201):
```json
{
  "success": true,
  "data": {
    "id": "clx2def...",
    "userId": "clx1abc...",
    "university": "武汉大学",
    "major": "计算机科学与技术",
    "currentGpa": 3.28,
    "createdAt": "2026-05-19T12:00:00Z"
  },
  "message": "背景信息保存成功"
}
```

**错误响应**:
| Code | 说明 |
|------|------|
| 409 PROFILE_EXISTS | 已有背景信息，请用 PUT 修改 |
| 422 VALIDATION_ERROR | 必填字段缺失 |

---

## 4. 修改学生背景

### `PUT /profile`

**需要登录**: ✅

**请求参数**: 同保存，所有字段均可选（只传需要修改的字段）

```json
{
  "currentGpa": 3.35,
  "ieltsTotal": 7.5,
  "ieltsW": 7.0
}
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "id": "clx2def...",
    "currentGpa": 3.35,
    "ieltsTotal": 7.5,
    "updatedAt": "2026-06-01T12:00:00Z"
  },
  "message": "背景信息更新成功"
}
```

**错误响应**:
| Code | 说明 |
|------|------|
| 404 PROFILE_NOT_FOUND | 尚未填写背景信息，请先 POST 创建 |

---

## 5. 获取学生背景

### `GET /profile`

**需要登录**: ✅

**请求参数**: 无

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "clx2def...",
      "gender": "male",
      "grade": "junior",
      "university": "武汉大学",
      "universityTier": "985",
      "major": "计算机科学与技术",
      "currentGpa": 3.28,
      "gpaScale": 4.0,
      "ieltsTotal": 7.0,
      "graduationDate": "2027-06-01T00:00:00Z",
      "targetRegions": ["uk", "hk"],
      "concerns": ["GPA太低", "没有实习"],
      "createdAt": "2026-05-19T12:00:00Z",
      "updatedAt": "2026-05-19T12:00:00Z"
    },
    "courses": [
      {
        "id": "clx3ghi...",
        "courseName": "高等数学 A",
        "courseType": "required",
        "credit": 4,
        "score": "A",
        "scoreType": "grade",
        "semester": "freshman_fall",
        "category": "math"
      }
    ],
    "projects": [...],
    "internships": [...],
    "research": [...],
    "preferences": {
      "targetDegree": "taught_master",
      "targetMajors": ["数据科学", "AI"],
      "targetRegions": ["uk", "hk"]
    }
  }
}
```

**错误响应**:
| Code | 说明 |
|------|------|
| 404 PROFILE_NOT_FOUND | 尚未填写背景信息 |

---

## 6. 生成免费版 AI 分析

### `POST /reports/free`

**需要登录**: ✅

**请求参数**:
```json
{
  "targetGpa": 3.5
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| targetGpa | number | ❌ | 目标 GPA，不传则自动推荐 |

**业务逻辑**:
```
1. 获取用户 profile + courses
2. 计算当前 GPA（校验用户输入是否正确）
3. 调用 OpenAI API 生成分析
4. 存入 reports 表（isPaid = false）
5. 返回部分结果（AI 选课建议 + 选校匹配 为模糊预览）
```

**OpenAI Prompt 结构**:
```
System: 你是留学规划顾问，根据学生背景给出分析。
        不要承诺录取，用"高匹配/中匹配/低匹配/冲刺"表达。

User:   学生背景：{profile}
        已修课程：{courses}
        目标 GPA：{targetGpa}

        请输出 JSON 格式：
        {
          "competitiveness_score": 0-100,
          "gpa_analysis": { ... },
          "course_matching": { ... },
          "gpa_improvement": { ... },
          "school_suggestions_preview": "模糊预览文本",
          "course_recommendations_preview": "模糊预览文本"
        }
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "report": {
      "id": "clx4jkl...",
      "gpaSnapshot": 3.28,
      "competitivenessScore": 65,
      "isPaid": false,
      "content": {
        "gpa_analysis": {
          "current_gpa": 3.28,
          "gpa_scale": 4.0,
          "ranking_estimate": "前20%",
          "strengths": ["核心课 GPA 高于总体 GPA"],
          "weaknesses": ["数学类课程偏低，拖累整体 GPA"]
        },
        "course_matching": {
          "match_rate": 72,
          "missing_courses": ["机器学习", "数据结构进阶"]
        },
        "gpa_improvement": {
          "target": 3.5,
          "gap": 0.22,
          "semesters_needed": 2,
          "strategy": "每学期选 2-3 门有把握的选修课"
        },
        "school_suggestions_preview": "🔒 解锁查看完整选校方案",
        "course_recommendations_preview": "🔒 解锁查看 AI 选课组合推荐"
      }
    }
  },
  "message": "免费分析报告已生成"
}
```

**错误响应**:
| Code | 说明 |
|------|------|
| 404 PROFILE_NOT_FOUND | 请先填写学生背景 |
| 429 RATE_LIMITED | 每天最多生成 3 份免费报告 |
| 500 AI_GENERATION_FAILED | AI 生成失败，请稍后重试 |

---

## 7. 生成付费版 AI 报告

### `POST /reports/full`

**需要登录**: ✅

**请求参数**:
```json
{
  "freeReportId": "clx4jkl..."
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| freeReportId | string | ✅ | 基于哪份免费报告生成完整版 |

**业务逻辑**:
```
1. 验证 freeReportId 存在且属于当前用户
2. 检查是否已付费（已付费则直接返回）
3. 如未付费 → 返回 402 PAYMENT_REQUIRED，带支付链接
4. 已付费 → 调用 OpenAI 生成完整报告
5. 更新 reports 表（isPaid = true, content = 完整内容）
```

**OpenAI Prompt 结构**:
```
System: 你是资深留学规划顾问。根据学生背景生成完整规划报告。
        绝不承诺录取。用"高匹配/中匹配/低匹配/冲刺"表达。

User:   学生背景：{profile}
        已修课程：{courses}
        项目经历：{projects}
        实习经历：{internships}
        科研经历：{research}
        目标偏好：{preferences}
        免费分析结果：{freeReport.content}

        请输出完整 JSON 报告：
        {
          "background_summary": "...",
          "competitiveness_score": { "total": 65, "gpa": 70, "experience": 55, "language": 75 },
          "gpa_analysis": { ... },
          "course_matching": { ... },
          "direction_suggestions": [ ... ],
          "school_positioning": "...",
          "schools": {
            "sprint": [ { "school": "UCL", "program": "DS", "match_level": "冲刺", "reason": "..." } ],
            "target": [ ... ],
            "safe": [ ... ]
          },
          "gpa_improvement": { ... },
          "course_recommendations": [ ... ],
          "experience_suggestions": {
            "projects": [ ... ],
            "internships": [ ... ],
            "research": [ ... ]
          },
          "ps_highlights": [ ... ],
          "cv_suggestions": [ ... ],
          "recommendation_letters": [ ... ],
          "timeline": [ ... ],
          "risk_warnings": [ ... ],
          "action_items": [ ... ]
        }
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "report": {
      "id": "clx4jkl...",
      "isPaid": true,
      "competitivenessScore": 65,
      "content": { /* 完整报告 JSON */ }
    }
  },
  "message": "完整报告已生成"
}
```

**错误响应**:
| Code | 说明 |
|------|------|
| 402 PAYMENT_REQUIRED | 需要付费后才能生成完整报告 |
| 404 REPORT_NOT_FOUND | 免费报告不存在 |
| 500 AI_GENERATION_FAILED | AI 生成失败 |

---

## 8. 获取历史报告

### `GET /reports`

**需要登录**: ✅

**查询参数**:
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | number | ❌ | 1 | 页码 |
| pageSize | number | ❌ | 10 | 每页数量（最大 50） |
| type | string | ❌ | all | 筛选类型：all / free / paid |

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "clx4jkl...",
        "title": "GPA 规划报告",
        "gpaSnapshot": 3.28,
        "gpaScale": 4.0,
        "competitivenessScore": 65,
        "isPaid": true,
        "reportType": "full",
        "createdAt": "2026-05-19T12:00:00Z"
      },
      {
        "id": "clx5mno...",
        "title": "GPA 免费分析",
        "gpaSnapshot": 3.15,
        "gpaScale": 4.0,
        "competitivenessScore": 58,
        "isPaid": false,
        "reportType": "free",
        "createdAt": "2026-03-15T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

---

## 9. 查看单个报告

### `GET /reports/:id`

**需要登录**: ✅

**业务逻辑**:
```
1. 查找报告，验证属于当前用户
2. 如果 isPaid = false → 返回部分结果（模糊预览）
3. 如果 isPaid = true → 返回完整内容
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "report": {
      "id": "clx4jkl...",
      "title": "GPA 规划报告",
      "gpaSnapshot": 3.28,
      "gpaScale": 4.0,
      "competitivenessScore": 65,
      "isPaid": true,
      "reportType": "full",
      "content": { /* 完整或部分内容 */ },
      "createdAt": "2026-05-19T12:00:00Z"
    }
  }
}
```

**错误响应**:
| Code | 说明 |
|------|------|
| 404 REPORT_NOT_FOUND | 报告不存在 |

---

## 10. 创建支付订单

### `POST /payments`

**需要登录**: ✅

**请求参数**:
```json
{
  "reportId": "clx4jkl...",
  "productType": "single_report",
  "paymentMethod": "wechat"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| reportId | string | ✅ | 关联的报告 ID |
| productType | string | ✅ | single_report / membership_month / membership_quarter |
| paymentMethod | string | ✅ | wechat / alipay |

**业务逻辑**:
```
1. 验证 reportId 存在且属于当前用户
2. 检查是否已支付（已支付则返回 409）
3. 根据 productType 确定金额
4. 创建 payment 记录（status = pending）
5. 调用微信/支付宝 API 创建预支付订单
6. 返回支付参数（前端调起支付）
```

**成功响应** (201):
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "clx6pqr...",
      "amount": 1990,
      "currency": "CNY",
      "productName": "AI 选课方案",
      "status": "pending"
    },
    "payParams": {
      "prepayId": "wx1234567890...",
      "timeStamp": "1684500000",
      "nonceStr": "abc123",
      "signType": "RSA",
      "paySign": "xxx..."
    }
  },
  "message": "支付订单创建成功"
}
```

**错误响应**:
| Code | 说明 |
|------|------|
| 404 REPORT_NOT_FOUND | 报告不存在 |
| 409 ALREADY_PAID | 该报告已支付 |
| 500 PAYMENT_CREATE_FAILED | 支付订单创建失败 |

---

## 11. 支付成功后解锁报告

### `POST /payments/callback/wechat`

**需要登录**: ❌（微信服务端回调，验证签名）

**请求参数** (微信回调格式):
```json
{
  "id": "EV-20180806...",
  "event_type": "TRANSACTION.SUCCESS",
  "resource": { /* 加密数据 */ }
}
```

**业务逻辑**:
```
1. 验证微信回调签名
2. 解密 resource 获取 transaction_id
3. 查找对应 payment 记录
4. 更新 payment 状态为 paid
5. 更新 report 的 isPaid = true
6. 触发完整报告生成（异步队列或直接调用）
```

**成功响应** (200):
```json
{
  "code": "SUCCESS",
  "message": "OK"
}
```

**错误处理**:
```
- 签名验证失败 → 返回 401，记录日志
- 订单不存在 → 返回 200（避免微信重试），记录异常
- 重复回调 → 返回 200（幂等处理）
- 业务异常 → 返回 200，记录日志，人工处理
```

---

## 辅助 API

### 获取课程列表（用于选课模拟）

#### `GET /courses`

**需要登录**: ✅

**查询参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| type | string | completed / current / available |
| semester | string | 按学期筛选 |

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "clx3ghi...",
        "courseName": "高等数学 A",
        "courseType": "required",
        "credit": 4,
        "score": "A",
        "semester": "freshman_fall",
        "recordType": "completed"
      }
    ],
    "summary": {
      "totalCredits": 80,
      "completedCredits": 65,
      "currentGpa": 3.28
    }
  }
}
```

### 批量添加课程

#### `POST /courses/batch`

**需要登录**: ✅

**请求参数**:
```json
{
  "courses": [
    {
      "courseName": "高等数学 A",
      "courseType": "required",
      "credit": 4,
      "score": "A",
      "scoreType": "grade",
      "semester": "freshman_fall",
      "category": "math"
    }
  ]
}
```

### AI 选课模拟（付费功能）

#### `POST /reports/:id/simulate`

**需要登录**: ✅

**请求参数**:
```json
{
  "availableCourses": [
    { "courseName": "机器学习", "credit": 3, "difficulty": "medium" },
    { "courseName": "数据可视化", "credit": 2, "difficulty": "low" }
  ],
  "targetGpa": 3.5
}
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "simulations": [
      {
        "combination": ["机器学习", "数据可视化"],
        "predictedGpa": 3.42,
        "gpaChange": 0.14,
        "recommendation": "推荐",
        "reason": "两门课难度适中，学分性价比高"
      },
      {
        "combination": ["机器学习"],
        "predictedGpa": 3.38,
        "gpaChange": 0.10,
        "recommendation": "稳妥",
        "reason": "只选一门核心课，风险较低"
      }
    ],
    "bestCombination": 0,
    "analysis": "选修机器学习+数据可视化组合预计可将 GPA 提升至 3.42..."
  }
}
```

---

## 价格配置

```javascript
// config/pricing.js
const PRICING = {
  single_report: {
    amount: 1990,       // ¥19.90
    name: 'AI 选课方案'
  },
  full_report: {
    amount: 2990,       // ¥29.90
    name: '完整选校报告'
  },
  membership_month: {
    amount: 3900,       // ¥39.00
    name: 'Pro 月卡'
  },
  membership_quarter: {
    amount: 9900,       // ¥99.00
    name: 'Pro 季卡'
  }
};
```

---

## 速率限制

```javascript
// 限流规则
const RATE_LIMITS = {
  'POST /auth/*':           { window: '15min', max: 10 },   // 登录注册
  'POST /reports/free':     { window: '1day',  max: 3 },    // 免费报告
  'POST /reports/full':     { window: '1hour', max: 5 },    // 付费报告
  'POST /payments':         { window: '1min',  max: 5 },    // 创建支付
  'GET /reports':           { window: '1min',  max: 30 },   // 查看报告
  'default':                { window: '1min',  max: 60 }    // 默认
};
```

---

## 中间件链

```
请求进入
  ↓
[CORS] → [Rate Limiter] → [Body Parser]
  ↓
[Auth Middleware]（仅需要登录的路由）
  ↓
[Validation Middleware]（参数校验）
  ↓
[Route Handler]
  ↓
[Error Handler]（统一错误处理）
  ↓
响应返回
```

---

*最后更新：2026-05-19*
*作者：CodeCat 🧠 for 约翰上将*
