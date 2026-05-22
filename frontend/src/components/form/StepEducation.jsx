import { useState } from 'react'

const universitiesCN = [
  '清华大学', '北京大学', '复旦大学', '上海交通大学', '浙江大学',
  '中国科学技术大学', '南京大学', '武汉大学', '华中科技大学', '中山大学',
  '哈尔滨工业大学', '西安交通大学', '北京航空航天大学', '同济大学', '北京理工大学',
  '东南大学', '南开大学', '天津大学', '山东大学', '厦门大学',
  '吉林大学', '大连理工大学', '华南理工大学', '电子科技大学', '重庆大学',
  '中南大学', '湖南大学', '兰州大学', '东北大学', '西北工业大学',
  '北京师范大学', '华东师范大学', '中国农业大学', '中国海洋大学', '中央民族大学',
  '北京交通大学', '北京科技大学', '北京邮电大学', '华北电力大学', '北京工业大学',
  '上海大学', '苏州大学', '南京理工大学', '南京航空航天大学', '河海大学',
  '江南大学', '南京师范大学', '南京农业大学', '中国矿业大学', '中国药科大学',
  '武汉理工大学', '华中师范大学', '华中农业大学', '中南财经政法大学', '中国地质大学',
  '西南大学', '西南交通大学', '四川大学', '西安电子科技大学',
  '西北农林科技大学', '陕西师范大学', '长安大学', '西北大学',
  '郑州大学', '南昌大学', '云南大学', '广西大学', '贵州大学',
  '海南大学', '内蒙古大学', '辽宁大学', '延边大学', '东北林业大学',
  '东北农业大学', '哈尔滨工程大学', '太原理工大学', '合肥工业大学', '安徽大学',
  '福州大学', '暨南大学', '华南师范大学', '深圳大学', '南方科技大学',
  '上海财经大学', '中央财经大学', '对外经济贸易大学', '西南财经大学',
  '北京外国语大学', '上海外国语大学', '北京语言大学', '广东外语外贸大学',
  '中国政法大学', '华东政法大学', '西南政法大学',
  '北京体育大学', '上海体育学院', '首都体育学院',
  '中国科学院大学', '上海科技大学', '西湖大学',
  '宁波诺丁汉大学', '西交利物浦大学', '昆山杜克大学', '上海纽约大学',
  '香港中文大学（深圳）', '香港科技大学（广州）',
]

const universitiesUS = [
  'Massachusetts Institute of Technology (MIT)',
  'Stanford University',
  'Harvard University',
  'California Institute of Technology (Caltech)',
  'University of Chicago',
  'University of Pennsylvania',
  'Princeton University',
  'Yale University',
  'Cornell University',
  'Columbia University',
  'Johns Hopkins University',
  'University of California, Berkeley (UCB)',
  'University of California, Los Angeles (UCLA)',
  'University of Michigan - Ann Arbor',
  'New York University (NYU)',
  'Carnegie Mellon University',
  'Duke University',
  'Northwestern University',
  'University of Washington',
  'University of California, San Diego (UCSD)',
  'Georgia Institute of Technology',
  'University of Illinois at Urbana-Champaign',
  'University of Wisconsin-Madison',
  'University of Texas at Austin',
  'Rice University',
  'University of Southern California',
  'Boston University',
  'Purdue University',
  'Ohio State University',
  'University of Maryland, College Park',
  'Brown University',
  'Dartmouth College',
  'Vanderbilt University',
  'University of North Carolina at Chapel Hill',
  'University of Virginia',
  'University of Florida',
  'Pennsylvania State University',
  'University of Minnesota',
  'Washington University in St. Louis',
  'University of California, Davis',
  'University of California, Santa Barbara',
  'University of Rochester',
  'Tufts University',
  'Northeastern University',
  'University of Pittsburgh',
  'University of California, Irvine',
  'University of Colorado Boulder',
  'Arizona State University',
  'Michigan State University',
  'University of Arizona',
]

const universitiesUK = [
  'University of Oxford',
  'University of Cambridge',
  'Imperial College London',
  'UCL (University College London)',
  'University of Edinburgh',
  'King\'s College London',
  'London School of Economics and Political Science (LSE)',
  'University of Manchester',
  'University of Bristol',
  'University of Warwick',
  'University of Glasgow',
  'University of Birmingham',
  'University of Sheffield',
  'University of Nottingham',
  'University of Leeds',
  'University of Southampton',
  'University of St Andrews',
  'Durham University',
  'University of Liverpool',
  'University of Exeter',
  'Newcastle University',
  'Queen Mary University of London',
  'Lancaster University',
  'University of York',
  'Cardiff University',
  'University of Bath',
  'University of Aberdeen',
  'University of Leicester',
  'University of Sussex',
  'University of Strathclyde',
]

const universitiesJP = [
  '東京大学 (University of Tokyo)',
  '京都大学 (Kyoto University)',
  '大阪大学 (Osaka University)',
  '東北大学 (Tohoku University)',
  '名古屋大学 (Nagoya University)',
  '九州大学 (Kyushu University)',
  '北海道大学 (Hokkaido University)',
  '東京工業大学 (Tokyo Institute of Technology)',
  '早稲田大学 (Waseda University)',
  '慶應義塾大学 (Keio University)',
  '筑波大学 (University of Tsukuba)',
  '神戸大学 (Kobe University)',
  '広島大学 (Hiroshima University)',
  '一橋大学 (Hitotsubashi University)',
  '東京理科大学 (Tokyo University of Science)',
  '上智大学 (Sophia University)',
  '東京医科歯科大学 (Tokyo Medical and Dental University)',
  '千葉大学 (Chiba University)',
  '横浜国立大学 (Yokohama National University)',
  '明治大学 (Meiji University)',
  '立教大学 (Rikkyo University)',
  '同志社大学 (Doshisha University)',
  '立命館大学 (Ritsumeikan University)',
  '関西大学 (Kansai University)',
]

const universitiesKR = [
  '서울대학교 (Seoul National University)',
  'KAIST - 한국과학기술원',
  '고려대학교 (Korea University)',
  '연세대학교 (Yonsei University)',
  'POSTECH - 포항공과대학교',
  '성균관대학교 (Sungkyunkwan University)',
  '한양대학교 (Hanyang University)',
  '서강대학교 (Sogang University)',
  '이화여자대학교 (Ewha Womans University)',
  '중앙대학교 (Chung-Ang University)',
  '경희대학교 (Kyung Hee University)',
  '건국대학교 (Konkuk University)',
  '동국대학교 (Dongguk University)',
  '홍익대학교 (Hongik University)',
]

const universitiesHK = [
  'The University of Hong Kong (HKU)',
  'The Chinese University of Hong Kong (CUHK)',
  'The Hong Kong University of Science and Technology (HKUST)',
  'City University of Hong Kong (CityU)',
  'The Hong Kong Polytechnic University (PolyU)',
  'Hong Kong Baptist University (HKBU)',
  'Lingnan University',
  'The Education University of Hong Kong',
]

const universitiesSG = [
  'National University of Singapore (NUS)',
  'Nanyang Technological University (NTU)',
  'Singapore Management University (SMU)',
  'Singapore University of Technology and Design (SUTD)',
  'Singapore Institute of Technology (SIT)',
]

const universitiesTW = [
  '國立臺灣大學 (National Taiwan University)',
  '國立清華大學 (National Tsing Hua University)',
  '國立交通大學 (National Yang Ming Chiao Tung University)',
  '國立成功大學 (National Cheng Kung University)',
  '國立臺灣科技大學 (National Taiwan University of Science and Technology)',
  '國立陽明交通大學 (National Yang Ming Chiao Tung University)',
  '國立中央大學 (National Central University)',
  '國立中山大學 (National Sun Yat-sen University)',
  '輔仁大學 (Fu Jen Catholic University)',
  '東海大學 (Tunghai University)',
]

const universitiesAU = [
  'University of Melbourne',
  'University of Sydney',
  'Australian National University (ANU)',
  'University of Queensland',
  'Monash University',
  'University of New South Wales (UNSW)',
  'University of Western Australia',
  'University of Adelaide',
  'University of Technology Sydney',
  'Macquarie University',
  'RMIT University',
  'Deakin University',
  'Griffith University',
  'University of Wollongong',
  'University of Newcastle',
]

const universitiesCA = [
  'University of Toronto',
  'University of British Columbia (UBC)',
  'McGill University',
  'University of Alberta',
  'McMaster University',
  'University of Waterloo',
  'University of Ottawa',
  'Western University',
  'Queen\'s University',
  'University of Calgary',
  'Dalhousie University',
  'Simon Fraser University',
  'University of Victoria',
  'York University',
  'Carleton University',
]

const universitiesEU = [
  'ETH Zurich (Swiss Federal Institute of Technology)',
  'EPFL (École polytechnique fédérale de Lausanne)',
  'Technical University of Munich (TUM)',
  'Ludwig-Maximilians-Universität München (LMU)',
  'Heidelberg University',
  'Humboldt-Universität zu Berlin',
  'Freie Universität Berlin',
  'RWTH Aachen University',
  'TU Berlin',
  'University of Göttingen',
  'Delft University of Technology',
  'University of Amsterdam',
  'Utrecht University',
  'Wageningen University',
  'KU Leuven',
  'Ghent University',
  'Université PSL (Paris Sciences & Lettres)',
  'Sorbonne University',
  'Université Paris-Saclay',
  'École Polytechnique',
  'Sciences Po',
  'KTH Royal Institute of Technology',
  'Uppsala University',
  'Lund University',
  'University of Copenhagen',
  'Aarhus University',
  'University of Helsinki',
  'Aalto University',
  'Trinity College Dublin',
  'University College Dublin',
  'University of Bologna',
  'Politecnico di Milano',
  'Sapienza University of Rome',
  'University of Vienna',
  'Universitat de Barcelona',
  'Universidad Autónoma de Madrid',
  'University of Zurich',
  'University of Oslo',
  'University of Lisbon',
]

const universitiesSEA = [
  'National University of Singapore (NUS)',
  'Nanyang Technological University (NTU)',
  'Chulalongkorn University (Thailand)',
  'Mahidol University (Thailand)',
  'University of Malaya (Malaysia)',
  'Universiti Putra Malaysia (UPM)',
  'Universiti Kebangsaan Malaysia (UKM)',
  'University of the Philippines',
  'Ateneo de Manila University',
  'De La Salle University (Philippines)',
  'Universitas Indonesia',
  'Institut Teknologi Bandung (ITB)',
  'Universitas Gadjah Mada (UGM)',
  'Vietnam National University, Hanoi',
  'Vietnam National University, Ho Chi Minh City',
]

const universitiesME = [
  'King Abdullah University of Science and Technology (KAUST)',
  'King Fahd University of Petroleum and Minerals',
  'King Saud University',
  'American University of Beirut (AUB)',
  'American University in Cairo (AUC)',
  'Qatar University',
  'Khalifa University (UAE)',
  'United Arab Emirates University',
  'American University of Sharjah',
  'Technion - Israel Institute of Technology',
  'Hebrew University of Jerusalem',
  'Tel Aviv University',
  'Weizmann Institute of Science',
]

const universitiesIN = [
  'Indian Institute of Technology Bombay (IIT Bombay)',
  'Indian Institute of Technology Delhi (IIT Delhi)',
  'Indian Institute of Technology Madras (IIT Madras)',
  'Indian Institute of Technology Kanpur (IIT Kanpur)',
  'Indian Institute of Technology Kharagpur (IIT KGP)',
  'Indian Institute of Science (IISc Bangalore)',
  'Indian Institute of Technology Roorkee',
  'Indian Institute of Technology Guwahati',
  'University of Delhi',
  'Jawaharlal Nehru University (JNU)',
  'BITS Pilani',
  'VIT University',
]

const universitiesNZ = [
  'University of Auckland',
  'University of Otago',
  'Victoria University of Wellington',
  'University of Canterbury',
  'Massey University',
  'University of Waikato',
  'Auckland University of Technology (AUT)',
  'Lincoln University',
]

const universitiesSA = [
  'Universidad de Buenos Aires (UBA)',
  'Universidad de São Paulo (USP)',
  'Universidade Estadual de Campinas (UNICAMP)',
  'Pontificia Universidad Católica de Chile (PUC)',
  'Universidad de Chile',
  'Universidad de los Andes (Colombia)',
  'Universidad Nacional Autónoma de México (UNAM)',
  'Tecnológico de Monterrey',
  'Universidad de Concepción',
  'Universidad Nacional de Colombia',
]

const universitiesAF = [
  'University of Cape Town',
  'University of the Witwatersrand',
  'Stellenbosch University',
  'University of Pretoria',
  'Cairo University',
  'University of Nairobi',
  'Makerere University',
  'University of Ghana',
  'University of Lagos',
  'University of Dar es Salaam',
]

const universityGroups = [
  { key: 'cn', label: '🇨🇳 中国', universities: universitiesCN },
  { key: 'us', label: '🇺🇸 美国', universities: universitiesUS },
  { key: 'uk', label: '🇬🇧 英国', universities: universitiesUK },
  { key: 'jp', label: '🇯🇵 日本', universities: universitiesJP },
  { key: 'kr', label: '🇰🇷 韩国', universities: universitiesKR },
  { key: 'hk', label: '🇭🇰 香港', universities: universitiesHK },
  { key: 'tw', label: '🇹🇼 台湾', universities: universitiesTW },
  { key: 'sg', label: '🇸🇬 新加坡', universities: universitiesSG },
  { key: 'au', label: '🇦🇺 澳洲', universities: universitiesAU },
  { key: 'ca', label: '🇨🇦 加拿大', universities: universitiesCA },
  { key: 'eu', label: '🇪🇺 欧洲', universities: universitiesEU },
  { key: 'sea', label: '🌏 东南亚', universities: universitiesSEA },
  { key: 'in', label: '🇮🇳 印度', universities: universitiesIN },
  { key: 'me', label: '🇸🇦 中东', universities: universitiesME },
  { key: 'nz', label: '🇳🇿 新西兰', universities: universitiesNZ },
  { key: 'sa', label: '🇧🇷 南美', universities: universitiesSA },
  { key: 'af', label: '🌍 非洲', universities: universitiesAF },
]

const allUniversities = universityGroups.flatMap((g) => g.universities)

const tiers = [
  { value: '985', label: '985' },
  { value: '211', label: '211' },
  { value: 'double_first', label: '双一流' },
  { value: 'normal', label: '普通本科' },
  { value: 'joint', label: '中外合办' },
  { value: 'overseas', label: '海外院校' },
]

export default function StepEducation({ formData, updateField }) {
  const [regionFilter, setRegionFilter] = useState('all')
  const [showDropdown, setShowDropdown] = useState(false)

  const filteredUniversities = (() => {
    if (!formData.university) return []
    const q = formData.university.toLowerCase()
    const pool = regionFilter === 'all'
      ? allUniversities
      : universityGroups.find((g) => g.key === regionFilter)?.universities || allUniversities
    return pool.filter((u) => u.toLowerCase().includes(q))
  })()

  return (
    <div className="space-y-6">
      {/* 本科学校 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          本科学校 <span className="text-red-500">*</span>
        </label>

        {/* 地区筛选 */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          <button
            type="button"
            onClick={() => setRegionFilter('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              regionFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {universityGroups.map((g) => (
            <button
              key={g.key}
              type="button"
              onClick={() => setRegionFilter(g.key)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                regionFilter === g.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={formData.university}
            onChange={(e) => {
              updateField('university', e.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="输入学校名称搜索（支持中英文），或直接输入自定义名称"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          {showDropdown && formData.university && (
            <div className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-lg">
              {filteredUniversities.length > 0 ? (
                filteredUniversities.map((uni) => (
                  <button
                    key={uni}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      updateField('university', uni)
                      setShowDropdown(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-sm"
                  >
                    {uni}
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-gray-500">
                  未找到匹配院校 — 直接输入你的学校名称即可
                </p>
              )}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          覆盖全球 17 个地区 · 500+ 院校 · 未列出的学校直接输入名称即可
        </p>
      </div>

      {/* 学校层次 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">学校层次</label>
        <div className="flex flex-wrap gap-3">
          {tiers.map((tier) => (
            <button
              key={tier.value}
              type="button"
              onClick={() => updateField('universityTier', tier.value)}
              className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors text-sm ${
                formData.universityTier === tier.value
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* 学院 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">学院（选填）</label>
        <input
          type="text"
          value={formData.college}
          onChange={(e) => updateField('college', e.target.value)}
          placeholder="如：计算机学院 / School of Engineering"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* 本科专业 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          本科专业 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.major}
          onChange={(e) => updateField('major', e.target.value)}
          placeholder="如：计算机科学与技术 / Computer Science"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* 辅修/双学位 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">辅修 / 双学位（选填）</label>
        <input
          type="text"
          value={formData.minor}
          onChange={(e) => updateField('minor', e.target.value)}
          placeholder="如：金融学"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* 学制 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">学制</label>
        <div className="flex gap-3">
          {[
            { value: 3, label: '3 年制' },
            { value: 4, label: '4 年制' },
            { value: 5, label: '5 年制' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField('duration', option.value)}
              className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                formData.duration === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 预计毕业时间 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          预计毕业时间 <span className="text-red-500">*</span>
        </label>
        <input
          type="month"
          value={formData.graduationDate}
          onChange={(e) => updateField('graduationDate', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>
    </div>
  )
}
