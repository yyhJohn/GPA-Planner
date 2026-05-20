// ============================================================
// 类型定义（JSDoc 风格，便于 IDE 提示）
// ============================================================

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} [name]
 * @property {string} [avatarUrl]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} StudentProfile
 * @property {string} id
 * @property {string} userId
 * @property {string} [gender]
 * @property {string} grade
 * @property {string} university
 * @property {string} universityTier
 * @property {string} [college]
 * @property {string} major
 * @property {string} [minor]
 * @property {number} duration
 * @property {string} graduationDate
 * @property {number} currentGpa
 * @property {number} gpaScale
 * @property {string} [gpaRanking]
 * @property {number} [majorGpa]
 * @property {number} [percentageAvg]
 * @property {string} [gpaCalcRule]
 * @property {boolean} hasRetake
 * @property {string} hasLanguageScore
 * @property {number} [ieltsTotal]
 * @property {number} [ieltsL]
 * @property {number} [ieltsR]
 * @property {number} [ieltsW]
 * @property {number} [ieltsS]
 * @property {number} [toeflTotal]
 * @property {number} [toeflR]
 * @property {number} [toeflL]
 * @property {number} [toeflS]
 * @property {number} [toeflW]
 * @property {number} [greTotal]
 * @property {number} [greQuant]
 * @property {number} [greVerbal]
 * @property {number} [greAw]
 * @property {number} [gmatScore]
 * @property {number} [cet4Score]
 * @property {number} [cet6Score]
 * @property {string} [plannedExamDate]
 * @property {string} [tuitionBudget]
 * @property {string} [livingBudget]
 * @property {string} [needScholarship]
 * @property {boolean} [acceptLoan]
 * @property {string} [postGradPlan]
 * @property {string[]} [targetIndustry]
 * @property {string} [targetRole]
 * @property {string} [cityPreference]
 * @property {string} [concerns]
 * @property {string} [referralSource]
 * @property {string} [additionalInfo]
 */

/**
 * @typedef {Object} Course
 * @property {string} [id]
 * @property {string} courseName
 * @property {string} courseType
 * @property {number} credit
 * @property {string} score
 * @property {string} scoreType
 * @property {string} semester
 * @property {string} [category]
 * @property {boolean} [isRetake]
 * @property {string} [originalScore]
 * @property {string} [recordType]
 * @property {string} [difficulty]
 */

/**
 * @typedef {Object} Project
 * @property {string} [id]
 * @property {string} name
 * @property {string} role
 * @property {string} type
 * @property {string} [techStack]
 * @property {string} [description]
 * @property {string} [duration]
 * @property {string} [outcome]
 */

/**
 * @typedef {Object} Internship
 * @property {string} [id]
 * @property {string} company
 * @property {string} position
 * @property {string} [department]
 * @property {string} duration
 * @property {string} [description]
 * @property {string} [achievement]
 * @property {string} [relatedLevel]
 */

/**
 * @typedef {Object} Research
 * @property {string} [id]
 * @property {string} topic
 * @property {string} [advisor]
 * @property {string} [lab]
 * @property {string} duration
 * @property {string} [role]
 * @property {string} [description]
 * @property {string} [output]
 * @property {string} [fieldTags]
 */

/**
 * @typedef {Object} Competition
 * @property {string} [id]
 * @property {string} name
 * @property {string} level
 * @property {string} award
 * @property {string} date
 * @property {string} [role]
 * @property {string} [description]
 */

/**
 * @typedef {Object} TargetPreference
 * @property {string} targetDegree
 * @property {string[]} targetMajors
 * @property {string} acceptCrossMajor
 * @property {string[]} [priorityFactors]
 * @property {string[]} targetRegions
 * @property {string[]} [regionPrefOrder]
 * @property {boolean} [multiRegionApply]
 */

/**
 * @typedef {Object} FormData
 * @property {string} name
 * @property {string} gender
 * @property {string} grade
 * @property {string} email
 * @property {string} phone
 * @property {string} wechatId
 * @property {string} university
 * @property {string} universityTier
 * @property {string} college
 * @property {string} major
 * @property {string} minor
 * @property {number} duration
 * @property {string} graduationDate
 * @property {string} currentGpa
 * @property {string} gpaScale
 * @property {string} gpaRanking
 * @property {string} majorGpa
 * @property {string} percentageAvg
 * @property {string} gpaCalcRule
 * @property {boolean} hasRetake
 * @property {Object[]} retakeDetails
 * @property {Course[]} courses
 * @property {Course[]} currentCourses
 * @property {Course[]} availableCourses
 * @property {string} targetDegree
 * @property {string[]} targetMajors
 * @property {string} acceptCrossMajor
 * @property {string[]} priorityFactors
 * @property {string[]} targetRegions
 * @property {string[]} regionPrefOrder
 * @property {boolean} multiRegionApply
 * @property {Project[]} projects
 * @property {Internship[]} internships
 * @property {Research[]} research
 * @property {Competition[]} competitions
 * @property {string} hasLanguageScore
 * @property {string} ieltsTotal
 * @property {string} ieltsL
 * @property {string} ieltsR
 * @property {string} ieltsW
 * @property {string} ieltsS
 * @property {string} toeflTotal
 * @property {string} toeflR
 * @property {string} toeflL
 * @property {string} toeflS
 * @property {string} toeflW
 * @property {string} greTotal
 * @property {string} greQuant
 * @property {string} greVerbal
 * @property {string} greAw
 * @property {string} gmatScore
 * @property {string} cet4Score
 * @property {string} cet6Score
 * @property {string} plannedExamDate
 * @property {string} tuitionBudget
 * @property {string} livingBudget
 * @property {string} needScholarship
 * @property {boolean} acceptLoan
 * @property {string} postGradPlan
 * @property {string[]} targetIndustry
 * @property {string} targetRole
 * @property {string} cityPreference
 * @property {string[]} concerns
 * @property {string} referralSource
 * @property {string} additionalInfo
 */

/**
 * @typedef {Object} Report
 * @property {string} id
 * @property {string} title
 * @property {number} gpaSnapshot
 * @property {number} gpaScale
 * @property {number} [competitivenessScore]
 * @property {boolean} isPaid
 * @property {string} reportType
 * @property {Object} content
 * @property {string} createdAt
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {*} [data]
 * @property {string} [message]
 * @property {{ code: string, message: string }} [error]
 */

/**
 * @typedef {Object} Pagination
 * @property {number} page
 * @property {number} pageSize
 * @property {number} total
 * @property {number} totalPages
 */
