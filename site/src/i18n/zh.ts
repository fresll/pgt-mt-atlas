import type { Dict } from './ru'

const zh: Dict = {
  "countWords": {
    "value": [
      "个数值",
      "个数值",
      "个数值"
    ],
    "variant": [
      "种变异",
      "种变异",
      "种变异"
    ],
    "blastocyst": [
      "个囊胚",
      "个囊胚",
      "个囊胚"
    ],
    "embryo": [
      "个胚胎",
      "个胚胎",
      "个胚胎"
    ],
    "comparison": [
      "组比较",
      "组比较",
      "组比较"
    ],
    "pathogenic": [
      "个携带致病性变异的囊胚",
      "个携带致病性变异的囊胚",
      "个携带致病性变异的囊胚"
    ]
  },
  "site": {
    "title": "PGT-mt图谱",
    "tagline": "收录胚胎植入前线粒体DNA遗传学检测（PGT-mt）中已发表胚胎mtDNA异质性数值的开放数据库。每个数值均链接至其来源。",
    "curated": "由Ilya Mazunin创建、整理与维护",
    "preview": "预览版。网站尚未发布；数据与文本有待数据库维护者审核。",
    "skip": "跳至正文"
  },
  "nav": {
    "fundamentals": "基础知识",
    "home": "首页",
    "science": "专业数据",
    "scienceIndex": "各栏目概览",
    "patients": "患者专区",
    "about": "关于本项目",
    "curator": "Ilya Mazunin",
    "data": "数值表",
    "landscape": "不同胚胎之间",
    "concordance": "单个胚胎内部",
    "offspring": "胚胎、胎儿与儿童",
    "model": "PGT-mt × PGT-A模型",
    "cases": "已发表病例",
    "sources": "数据来源",
    "methods": "方法与局限",
    "contribute": "提交数据",
    "language": "语言",
    "switchTo": "俄语",
    "primaryLabel": "主菜单",
    "scienceLabel": "专业栏目",
    "sectionSelect": "栏目",
    "chapterSelect": "章节",
    "menu": "菜单",
    "menuClose": "关闭",
    "theme": "配色主题：{{mode}}",
    "themeMode": {
      "system": "跟随系统",
      "light": "浅色",
      "dark": "深色"
    }
  },
  "footer": {
    "visits": "访问次数：",
    "visitsHelp": "图谱总访问次数",
    "visitsUnavailable": "暂时无法获取访问次数",
    "updated": "数据更新于{{date}} · 数据集版本{{version}}",
    "disclaimer": "PGT-mt图谱不能替代临床遗传学咨询。PGT-mt图谱的创建与维护者不提供医疗建议。",
    "contribute": "研究人员：提交数据",
    "linksLabel": "网站链接"
  },
  "badge": {
    "observed": "观测数据",
    "model": "模型计算结果",
    "outsideArticle": "扩展视图",
    "draft": "草稿"
  },
  "contact": {
    "address": "地址：",
    "copy": "复制地址",
    "copied": "地址已复制",
    "copyFailed": "复制失败，请选中地址并手动复制",
    "noClient": "若未打开邮件应用，请复制地址，使用您常用的邮件服务发送消息。"
  },
  "common": {
    "value": "数值",
    "variant": "mtDNA变异",
    "source": "来源",
    "stage": "发育阶段",
    "material": "样本材料",
    "sample": "样本类型",
    "derivation": "数值的获取方式",
    "note": "工作簿中的备注",
    "provenance": "数据溯源",
    "sheetRow": "工作表“{{sheet}}”，第{{row}}行",
    "legacyId": "原编号",
    "variantClass": "变异分类",
    "classBasis": {
      "stated_in_source": "依据：{{source}}，{{locator}}；核查日期：{{date}}",
      "implied_in_source": "根据{{source}}，{{locator}}推断；核查日期：{{date}}",
      "not_verified": "沿用补充工作簿分类；原始文献中未找到明确说明（核查日期：{{date}}）"
    },
    "doi": "DOI",
    "pmid": "PMID",
    "noDoi": "无DOI",
    "status": "状态",
    "all": "全部",
    "showTable": "数据表",
    "downloadCsv": "下载CSV",
    "downloadVisibleCsv": "下载当前显示的记录（CSV）",
    "close": "关闭",
    "selected": "已选记录",
    "clickHint": "选择数据点以查看来源及溯源信息。",
    "n": "n",
    "notDetected": "未检出",
    "lod": "检出限：{{lod}}%",
    "interval": "文献仅报告区间：{{low}}–{{high}}%",
    "lessThan": "低于{{v}}%",
    "upperBoundUnknown": "未报告上界，请参阅来源备注",
    "loadingChart": "正在加载图表…",
    "main": "主要发现",
    "scrollHint": "图表宽于屏幕，请横向滚动以查看全部变异 →",
    "noJs": "交互图表需要JavaScript。相同数据见下方表格。",
    "chartError": "无法加载交互图表模块。请检查网络并刷新页面；相同数据见下方表格。",
    "imageError": "图像未加载，请刷新页面。",
    "figureInArticle": "参考视图",
    "explore": "探索",
    "mode": "模式",
    "threshold": "筛选界值",
    "reset": "重置",
    "resetChartView": "恢复初始视图",
    "embryo": "胚胎",
    "child": "儿童",
    "tissue": "组织",
    "phase": "阶段",
    "age": "年龄",
    "method": "方法",
    "delta": "Δ（组织 − 胚胎），百分点",
    "pp": "百分点",
    "published": "已发表",
    "in_press": "待刊",
    "conference_abstract": "会议摘要",
    "preprint": "预印本"
  },
  "pubStatus": {
    "published": "已发表",
    "in_press": "待刊",
    "conference_abstract": "会议摘要",
    "preprint": "预印本"
  },
  "verification": {
    "title": "与已发表补充材料核对",
    "match": "与ESM一致",
    "value_mismatch": "数值与ESM不一致",
    "fraction_label_mismatch": "样本分类与ESM不一致",
    "not_in_dataset": "未纳入数据集",
    "missing_in_dataset": "数据集中缺失",
    "mismatch": "不一致",
    "datasetKept": "在数据库维护者审核前，保留数据集原值。",
    "corrected": "已按ESM 2更正",
    "correctedNote": "这些差异已通过有记录的更正层解决。网站显示已发表ESM 2中的数值，并保留原工作簿数值以供比较。",
    "correctedTitle": "已按发表来源更正",
    "sourceValue": "补充工作簿中的数值"
  },
  "home": {
    "lead": "本图谱汇集已发表的异质性水平，并说明如何解读这些数值。",
    "k1": "个胚胎异质性数值",
    "k2": "{{word}}的活检样本与同一胚胎其他部分进行了比较（其中{{icm}}个含内细胞团测量）",
    "k3": "{{word}}涉及胚胎与组织样本，来自{{children}}名胎儿与儿童；其中{{ndChildren}}名胎儿与儿童的两类样本均未检出该变异",
    "sciTitle": "专业人员专区",
    "sciText": "交互图表、可追溯来源的数据表，以及方法与局限说明。",
    "patTitle": "患者专区",
    "fundTitle": "PGT-mt基础知识",
    "fundText": "面向临床医生、胚胎学家和学生的六章课程，介绍mtDNA遗传及PGT-mt结果解读。",
    "ctaPatients": "患者与家庭",
    "ctaSpecialists": "专业数据",
    "ctaFundamentals": "PGT-mt基础知识——六章课程",
    "patText": "异质性的含义、PGT-mt的作用，以及检测报告中的百分比为何不等于诊断。",
    "caveat": "本数据集为描述性数据集：它不是荟萃分析，不界定安全阈值，也不能替代临床遗传学咨询。",
    "kicker": "独立科学数据库",
    "explore": "探索数据",
    "allSections": "科学栏目",
    "figCaption": "囊胚。第一个放大图显示滋养外胚层细胞及其细胞核和小型线粒体；第二个显示含有野生型mtDNA及携带致病性变异mtDNA的线粒体。",
    "labels": {
      "te": "滋养外胚层",
      "icm": "内细胞团",
      "cell": "滋养外胚层\n细胞",
      "wt": "野生型\nmtDNA",
      "variant": "mtDNA\n致病性变异"
    },
    "aboutTitle": "科学数据库",
    "aboutNote": "收录内容",
    "k4": "{{word}}（{{doi}}篇有DOI）",
    "landscapeTitle": "不同胚胎之间",
    "concordanceTitle": "单个胚胎内部",
    "concordanceSubtitle": "同一胚胎不同部分的异质性水平一致性",
    "offspringSubtitle": "胚胎活检与产前或出生后样本中的异质性",
    "sectionsTitle": "图谱栏目",
    "sectionsNote": "从活检到数据",
    "biopsyCaption": "滋养外胚层（TE）活检：取少量TE细胞，通过PGT-mt测量样本中携带致病性变异的mtDNA所占比例。",
    "dataLink": "完整数据集",
    "sourcesLink": "数据来源",
    "methodsLink": "方法与局限",
    "dataTitle": "仅收录已发表数值",
    "dataText": "图谱中的每个数值均链接至原始来源。这些来源也为数学模型提供依据。",
    "mitoCaption": "具有嵴和环状mtDNA分子的线粒体。",
    "curatorBio": "生物科学博士、遗传学家",
    "biography": "科研履历"
  },
  "landscape": {
    "title": "不同胚胎之间",
    "subtitle": "按mtDNA变异及来源展示胚胎异质性水平",
    "lead": "每个点代表一个胚胎已发表或推导的异质性数值。空心标记表示推导值；菱形表示不作为移植候选的1PN/3PN胚胎。每种变异内部以不同列区分来源。",
    "yAxis": "胚胎样本mtDNA异质性水平，%",
    "share": "≤{{t}}%的比例",
    "derivedLegend": "空心标记：通过平均或从已发表图中数字化获取的数值",
    "aggregate": "合并≥6个相同数值（×n）",
    "highlightDerived": "突出显示推导值",
    "stageFilter": "发育阶段",
    "customThreshold": "自定义筛选界值，%",
    "bands": "背景色带：18%以下为浅绿，18–30%为浅蓝，30–100%为浅红。18%参考值来自肌肉测量的估计（Hellebrekers等，2012），并非胚胎活检样本阈值。纽卡斯尔项目主要采用<30%（Hyslop等，2025）。比例计算包含≤所选界值的数值。这些不是通用临床阈值。",
    "groupTitle": "相同数值：{{n}}条观测",
    "groupHint": "×{{n}}标记合并同一来源的相同数值。请选择一条观测：",
    "groupInTable": "下表仅显示此组观测。",
    "showAll": "显示全部观测",
    "groupClick": "选择以查看组内全部观测",
    "main": "异质性≤18%的胚胎比例在不同变异间差异很大：{{list}}。这些比例描述已发表系列，不能用于估计单个家庭的概率。",
    "intervalNote": "两个m.10197G>A胚胎仅发表了区间，以线段显示，不以中点填补。仅当区间上界≤筛选界值时，才计入≤界值的比例。",
    "guide18": "18%估计值（肌肉；Hellebrekers 2012）",
    "guide30": "30%筛选标准（纽卡斯尔）"
  },
  "concordance": {
    "fractionCounts": "由三个样本（11个胚胎）和两个样本（29个）计算的极差不能直接比较",
    "title": "单个胚胎内部",
    "subtitle": "同一胚胎不同部分的异质性水平一致性",
    "lead": "图A和B展示同一批囊胚（n = {{n}}）。图C还包括一名携带m.3243A>G女性的{{c}}个卵裂期胚胎（Monnot等，2011；每个胚胎两个卵裂球）。",
    "main": "同一囊胚各样本的异质性水平通常相近。胚胎内极差的中位数为{{all}}个百分点；致病性变异组为{{pat}}个百分点（最大{{max}}个百分点）。携带致病性变异的囊胚中，{{share}}%的极差≤5个百分点。",
    "a": "A. 同一胚胎的各样本",
    "b": "B. 差值：分析样本 − 临床活检样本",
    "c": "C. 胚胎内极差",
    "yA": "mtDNA异质性水平，%",
    "yB": "异质性差值Δ，百分点",
    "yC": "极差，百分点",
    "pathogenic": "致病性变异",
    "hv2": "HV2——对照胚胎",
    "showHv2": "显示HV2",
    "band5": "灰色带：±5个百分点；仅为示意参考，无已发表来源",
    "median": "中位数",
    "cleavage": "卵裂期，2个卵裂球",
    "blastPat": "囊胚，致病性变异",
    "blastHv2": "囊胚，HV2",
    "remMinusBx": "剩余TE − 活检",
    "icmMinusBx": "ICM − 活检",
    "combMinusBx": "ICM+TE − 活检",
    "combShort": "ICM+TE<br>（混合样本）",
    "hu": "附加数据：同一囊胚的16个样本（Hu等，2026）",
    "huText": "活检样本m.3250T>C水平为17.8%的囊胚被分为16份样本，每份含3–5个细胞；未分离ICM。小型细胞样本的变异性不能与较大胚胎部分的变异性直接比较，因此未绘于图中。",
    "verifyNote": "Tofilo等（2026）中，胚胎6的数值（ICM及剩余TE）与胚胎3、4的样本分类（混合ICM+TE）依据已发表ESM 2。胚胎详情保留原工作簿数值。该研究标为“ICM”的样本也含有附着TE细胞（“ICM+”）。"
  },
  "offspring": {
    "bothNDPair": "未检出 → 未检出",
    "bothNDChildren": "来自{{children}}名胎儿与儿童的{{pairs}}组配对比较中，两份样本均未检出变异（ND）。这些结果并非精确的零值测量。",
    "bothND": "未检出 → 未检出：{{n}}组",
    "recordSummary": "{{records}}条记录，其中包括来自{{children}}名胎儿与儿童的{{pairs}}组胚胎–组织配对",
    "childSummary": "{{all}}名胎儿与儿童中，{{low}}名的胚胎异质性水平较低；其中{{concordant}}名的全部组织结果均为低水平或未检出。一名儿童（C5）的不同实验室结果不一致。",
    "deltaBound": "Δ以百分点表示。仅组织结果为ND时，Δ有下界，以空心标记和向上箭头显示；仅胚胎结果为ND时，Δ有上界。ND → ND配对在组下方计数，不绘于Δ = 0。",
    "ndBand": "未检出（无数值轴）",
    "title": "胚胎、胎儿与儿童",
    "subtitle": "胚胎活检与产前或出生后样本中的异质性",
    "lead": "比较移植胚胎与胎儿或儿童组织。观测并非相互独立：多次测量可能来自同一儿童的不同组织或时间点。",
    "main": "{{children}}名胎儿与儿童的{{pairs}}。{{disc}}",
    "discOne": "此处归为不一致的全部比较（{{ids}}）均涉及同一名儿童，其出生后样本采用另一方法分析。此处“不一致”指胚胎结果≤18%、组织结果>18%的配对；这是描述性分组，并非临床阈值。",
    "discMany": "胚胎–组织差异：{{ids}}。",
    "pairForms": [
      "组比较",
      "组比较",
      "组比较"
    ],
    "xA": "移植胚胎mtDNA异质性水平，%",
    "yA": "胎儿／儿童组织mtDNA异质性水平，%",
    "yB": "Δ（组织 − 胚胎），百分点",
    "prenatal": "产前样本",
    "blood": "血液／脐带血",
    "otherPost": "其他出生后组织",
    "identity": "y = x（数值相同）",
    "showExcluded": "显示排除及删失记录",
    "lowSpread": "报告为未检出的胚胎结果显示于单独的ND色带，无数值轴。精确数值结果见表格。",
    "dependency": "比较：{{pairs}}组；胎儿与儿童：{{children}}名。C5的重复测量占这{{pairs}}组比较中的{{k}}组。",
    "excludedTitle": "未绘制记录",
    "colorByVariant": "颜色表示mtDNA变异，形状表示样本材料，标签标识病例。"
  },
  "model": {
    "without3pn": "排除3PN胚胎后的m.14487T>C附加分母：{{sign}}18%——{{k}}/{{n}}。主数据集保留全部已发表胚胎数值；3PN胚胎不作为移植候选。",
    "versionLabel": "模型版本：{{v}}",
    "title": "PGT-mt × PGT-A模型",
    "subtitle": "联合PGT-mt与胚胎植入前非整倍体检测（PGT-A）的筛选情景，以及对模型假设的敏感性",
    "banner": "模型估计给定一组囊胚中至少一个同时满足两项实验室标准的概率。输入比例来自彼此差异较大的已发表系列。这些估计不是个体化预测。",
    "yAxis": "P（≥1个符合标准）",
    "xAxis": "囊胚数，N",
    "panelTabs": "情景中的整倍体囊胚比例",
    "panel": "情景E = {{p}}",
    "pHet": "H为已发表异质性数值中≤所选筛选界值的比例。它描述所纳入的系列，并不代表单个患者。",
    "pEupl": "E为情景假定的整倍体囊胚比例",
    "pEuplSource": "参考来源",
    "meaningTitle": "结果的含义",
    "meaning": "P(≥1)是N个囊胚中至少一个同时满足两项模型标准的模型概率：PGT-A判为整倍体，且异质性≤所选筛选界值。它不是妊娠、活产或生育健康儿童的概率，也不是对单个患者的预测。",
    "improvement": "估计家庭及变异效应需要多个独立家庭完整且可关联的周期数据。情景中的整倍体囊胚比例未经年龄校准。",
    "formula": "公式",
    "assumptions": "模型假设（未经证实）",
    "a1": "q = H × E：假定异质性状态与染色体状态相互独立；",
    "a2": "ρ = 0时，各囊胚为成功概率相同的独立试验；N为给定囊胚数，并非卵母细胞数或周期平均产量；",
    "a3": "ρ > 0时，各胚胎共享一个满足两项标准的随机概率。所选ρ为情景参数，并非由图谱数据估计；",
    "a4": "H描述不同发育阶段和分析方法的已发表合并记录；E是假定的整倍体囊胚比例。",
    "tableTitle": "数据集中全部变异的P(≥1)",
    "smallN": "n较小——比例估计不稳定",
    "dashed": "细长虚线：30%界值的曲线，仅在其与18%曲线不同时显示；主要线型用于区分变异",
    "nMax": "N上限",
    "boundary": "界值规则",
    "rhoLabel": "胚胎间依赖性，ρ",
    "independent": "上界：胚胎相互独立",
    "rhoNote": "ρ描述是否满足两项标准这一二元结局的依赖性。它是指定的贝塔–二项相关系数，并非观测到的异质性百分比间的相关性。所有变异使用相同情景值。",
    "showRange": "显示对H条件区间的敏感性",
    "intervalNote": "色带在E和ρ固定时，对H的条件95% Wilson置信区间进行变换。二项区间假定观测独立，不考虑家庭聚集、发表偏倚或测量误差。ρ > 0时，色带仍表示对输入的敏感性，并非针对相互依赖的胚胎或临床成功率所估计的区间。",
    "iid95": "95% Wilson置信区间（忽略聚集）",
    "inputSummary": "输入包括{{sources}}篇文献的{{n}}条记录：{{blastocysts}}条明确标为囊胚，{{unspecified}}条未说明发育阶段。{{nd}}条未检出结果无检出限信息。这些是存在较大差异的已发表观测，并非完整且独立的治疗周期。",
    "inputIntervalNote": "各变异的H = k/n由纳入记录计算。完整数据集包括卵裂期胚胎、3PN胚胎及仅针对移植胚胎报告的数值（Hyslop 2025、Thorburn 2009）。优先选择低异质性胚胎使H偏高。筛选器仅保留明确标为囊胚TE活检的样本。区间以上界表示，未检出结果假定低于界值。Wilson区间忽略聚集。",
    "crossing": "跨越界值的区间：{{n}}",
    "sampleComposition": "输入样本构成",
    "sourceCount": "文献：{{n}}篇",
    "stageCount": "囊胚：{{b}}；阶段未说明：{{u}}",
    "ndCount": "未检出、未报告检出限：{{n}}",
    "tableN": "表格所用囊胚数，N",
    "tableAge": "年龄{{age}}",
    "vus": "意义未明变异（VUS）",
    "dependentFormula": "0 < ρ < 1时，共享概率Q服从均值为q的贝塔分布。给定Q时胚胎条件独立；对Q积分产生正依赖性。ρ = 0时采用二项分布极限。",
    "boundsTitle": "异质性状态与倍性可能关联时",
    "boundsNote": "边际比例H和E仅确定单个胚胎联合概率q的上下界。表格显示这些界限，而非置信区间。它们以输入比例为条件，不描述胚胎间依赖性。",
    "evidenceTitle": "原始研究中的联合结果",
    "evidenceNote": "此处固定终点为H≤18%及严格整倍体。各分母均为相应已发表系列中通过TE活检评估的囊胚数。这些小型系列描述特定mtDNA变异携带者，其比例不能为其他家庭校准情景曲线。",
    "confirmedEuploid": "确认整倍体",
    "jointPass": "同时满足两项标准",
    "evidence": {
      "tofilo": "一名变异携带者；六份活检样本中一份满足两项标准。",
      "hu": "一名意义未明变异（VUS）携带者。这些结果不能表征致病性变异。",
      "ji": "一名患者、两个周期；PGT-A对14/15个囊胚提供有效结果。另一囊胚H=99.4%，因此无论未知倍性如何，都不满足联合标准。",
      "spathB": "患者B。所有活检样本均未检出变异，未报告检出限。比例假定ND结果低于18%。各样本的H状态相同，无法评估两项标准的独立性。",
      "spathD": "患者D。涉及ND的比例假定检出限低于18%。联合比例3/9与边际比例乘积8/27不同。此小型系列不能确立关联。"
    },
    "salleveltNote": "Sallevelt 2017：22条数值记录中3条低于18%，其中包括一枚3PN胚胎的低值。2PN胚胎中，经确认符合该标准的比例为2/23。四次分析因空白对照阳性而无明确结论；若接受其余19项分类，低于18%的比例界限为2/23–6/23。这是不完整数据的界限，并非置信区间。",
    "publicationCarriers": "各文献报告的携带者人数（不可相加）",
    "correlationExample": "采用当前数据的教学示例：H = {{h}}、E = {{e}}、N = 6时，ρ = 0得到{{p0}}，ρ = 0.2得到{{p2}}。这是情景计算，并非个体预测。",
    "scenarioNote": "情景值未对应特定年龄。",
    "symbols": "H：≤所选筛选界值的比例；E：假定整倍体囊胚比例；◆ 模型计算结果。",
    "teOnly": "仅囊胚TE活检",
    "carrierCaveat": "仅有1–2名携带者时，比例描述这些女性，而非变异整体。仅当现有信息支持匹配时才跨文献关联记录。人数按各文献分别报告；同一女性可能出现在多篇文献中，因此不可相加。",
    "unknown": "尚未确定",
    "carriers": "携带者人数：{{n}}；记录：{{records}}条"
  },
  "data": {
    "maternalCluster": "母系分组",
    "embryoSample": "胚胎样本",
    "day3Blastomere": "第3天的一个卵裂球",
    "atlasRow": "图谱来源工作表，第{{row}}行",
    "countSummary": "{{records}}条记录，其中包括{{children}}名胎儿与儿童的{{pairs}}组胚胎–组织配对。共{{pubs}}篇文献，其中{{embryoPubs}}篇报告胚胎数值。",
    "locator": "来源位置",
    "title": "数值表",
    "lead": "全部观测及每个数值的溯源信息。CSV下载采用英文标签和备注；标识符与数值数据不变。",
    "embryos": "胚胎（不同胚胎之间）",
    "offspring": "胚胎、胎儿与儿童",
    "filterVariant": "变异",
    "filterSource": "来源",
    "search": "搜索（编号、原编号、变异、来源）",
    "release": "当前数据集：{{n}}个胚胎异质性数值。初始冻结版本{{base}}：{{nBase}}个数值。此后的变更：{{changes}}（见方法）。",
    "csvTitle": "数据库表（CSV）",
    "version": "数据集版本{{v}}；源文件{{file}}（SHA-256 {{sha}}…）"
  },
  "cases": {
    "phenotype": "表型",
    "title": "病例",
    "lead": "已发表病例与病例系列，包括异质性水平、取样组织及报告结局。省略个人医疗详情；每个数值保留来源归属。",
    "range": "胚胎间范围",
    "transferred": "移植胚胎",
    "offspring": "胎儿／儿童组织",
    "dataType": "数据类型",
    "origin": "数值来源"
  },
  "sources": {
    "verificationSummary": "DOI于2026年10月11日与PubMed核对；PMID见表格。无PubMed记录的文献注明例外。",
    "title": "数据来源",
    "lead": "为数据集数值、图表参考线及模型参数提供依据的文献。各条目标识原始研究、作者与DOI。",
    "rolesTitle": "在图谱中的用途",
    "filter": "显示",
    "filterData": "含数据集数值",
    "filterOther": "参考值、模型、病例",
    "colPublication": "文献",
    "colType": "类型",
    "colRecords": "记录数",
    "colRoles": "用途",
    "roleShort": {
      "observations": "观测",
      "case_summary": "已发表病例",
      "threshold": "图表参考值",
      "model_parameter": "PGT-mt × PGT-A模型",
      "excluded_data": "已评估，未纳入",
      "classification_basis": "变异分类"
    },
    "roles": {
      "observations": "观测：个体异质性数值（{{section}}）",
      "case_summary": "已发表病例或系列摘要（病例）",
      "threshold": "图表参考线（{{section}}）",
      "model_parameter": "情景模型参数：按年龄划分的整倍体囊胚比例",
      "excluded_data": "已评估但未纳入的数据（原因见方法）",
      "classification_basis": "{{section}}分类依据"
    },
    "sections": {
      "heteroplasmy-landscape": "不同胚胎之间",
      "embryo-concordance": "单个胚胎内部",
      "embryo-to-offspring": "胚胎、胎儿与儿童"
    },
    "doiException": "DOI例外说明",
    "records": "条数据集记录",
    "verified": "已核查",
    "supplementary": "补充材料"
  },
  "about": {
    "title": "关于本项目"
  },
  "patients": {
    "title": "患者与家庭专区",
    "tocLabel": "本页内容",
    "print": "打印本页及问题清单",
    "more": "详见PGT-mt基础知识各章："
  },
  "curator": {
    "title": "Ilya Mazunin",
    "role": "PGT-mt图谱创建与维护者",
    "contents": "目录",
    "photoAlt": "Ilya Mazunin",
    "profilesLabel": "个人主页",
    "bio": "科研履历",
    "bioNote": "科研之路",
    "bioOther": "俄语履历",
    "projectRole": "项目职责",
    "research": "研究方向",
    "researchNote": "五个领域",
    "career": "科研经历",
    "careerNote": "时间线",
    "current": "现任职务",
    "past": "曾任职务",
    "education": "教育与学位",
    "educationNote": "学位",
    "teaching": "教材",
    "projects": "科研项目与专业活动",
    "projectsNote": "实验室之外",
    "professional": "专业协会",
    "ventures": "创业活动",
    "pubs": "代表性论文",
    "pubsNote": "按研究领域",
    "pubsCount": "选自履历所列{{original}}篇原创研究与{{reviews}}篇综述；另有{{patents}}项专利及软件登记。",
    "profiles": "科研主页与联系",
    "profilesNote": "联系",
    "researchProfiles": "科研主页",
    "contact": "联系",
    "collaboration": "科研合作",
    "patients": "患者咨询",
    "pending": "待数据库维护者批准",
    "noAdvice": "本网站不提供医疗建议。个人情况请与主治医生及临床遗传学专家讨论。",
    "coi": "利益披露",
    "coiNote": "透明度"
  },
  "methods": {
    "title": "方法与局限"
  },
  "notFound": "未找到页面",
  "pageContents": {
    "label": "本页内容",
    "top": "返回顶部"
  },
  "contribute": {
    "title": "提交数据",
    "kicker": "共同完善国际证据基础",
    "motto": "每一种结局都重要。未成功的结局也是数据。",
    "lead": "PGT-mt图谱欢迎全球研究团队与诊所贡献数据。如果您开展过PGT-mt或研究过携带mtDNA变异的胚胎，您的结果能帮助更全面地描述该方法，包括未成功周期及未移植胚胎。",
    "downloadTemplate": "下载模板（.xlsx）",
    "contactLink": "联系数据库维护者",
    "templateMeta": "PGT-mt科研数据提交 · 版本{{v}} · {{date}} · Excel",
    "why": {
      "title": "为何每一种结局都重要",
      "note": "发表偏倚",
      "p1": "PGT-mt成功结局比未成功结局更常发表。生育健康儿童的周期，比无合适胚胎、着床失败或妊娠丢失的周期更容易发表。",
      "p2": "因此，文献可能呈现有偏图景，让人误以为几乎总能获得合适胚胎且结局可预测。未成功结局仍被低估，而家庭在遗传咨询中需要这些信息。",
      "p3": "图谱同样认真记录全部结局。报告未成功结局有助于完善证据，提高准确性。"
    },
    "cycles": {
      "title": "为何完整周期很重要",
      "note": "从卵母细胞到儿童",
      "lead": "估计PGT-mt多大程度上能带来胚胎移植和活产，需要完整分母：周期内全部卵母细胞及胚胎，包括未移植者。周期可在下列任一阶段终止；每种结局都提供信息。",
      "steps": [
        "获取卵母细胞",
        "成熟（MII）",
        "受精（2PN）",
        "囊胚",
        "活检及PGT-mt",
        "符合标准的胚胎",
        "移植",
        "妊娠",
        "活产与随访"
      ],
      "losses": [
        "未成熟及退化卵母细胞",
        "未受精卵母细胞",
        "发育停滞",
        "无检测结果",
        "无符合标准胚胎",
        "未着床",
        "妊娠丢失"
      ],
      "lossesTitle": "周期可能终止的阶段——每种结局都重要：",
      "p": "测量周期内全部胚胎的异质性，包括非整倍体、发育停滞及未移植胚胎，有助于描述mtDNA变异在卵子发生和早期发育中的传递。缺少这些观测，家庭风险估计便不完整。"
    },
    "interest": {
      "title": "欢迎提交的数据",
      "note": "研究与观测",
      "items": [
        "完整PGT-mt周期：每个已启动周期，包括未移植即终止者。",
        "每个胚胎的异质性数值，而非仅移植者；PGT-A及形态学结果。",
        "对捐赠用于研究的胚胎开展的研究：滋养外胚层活检与内细胞团、剩余滋养外胚层的比较，重复活检，单个卵裂球。",
        "卵母细胞与极体；携带者组织的异质性。",
        "产前诊断及儿童出生后随访，注明组织、年龄和方法。",
        "未成功及意外结局：无符合标准胚胎、着床失败、妊娠丢失，或胚胎与胎儿组织结果不一致。",
        "方法学数据：验证、检出限、线性、全基因组扩增影响及重复测量。",
        "图谱尚未纳入的已发表研究：提供文献及数值在文中的位置即可。"
      ]
    },
    "how": {
      "title": "如何提交",
      "note": "提交步骤",
      "steps": [
        [
          "联系数据库维护者",
          "简述研究、数据集规模及发表状态。"
        ],
        [
          "填写模板",
          "下载PGT-mt科研数据提交，填写适用工作表。推荐已发表研究时，请发送文献信息或DOI。"
        ],
        [
          "商定数据分享方式",
          "数据库维护者将建议安全文件渠道。患者数据不得通过未加密邮件发送，不得上传至网站或GitHub。"
        ],
        [
          "科学审核",
          "数据库维护者核查完整性、一致性、与已发表数据的重叠、授权、许可、去标识化及伦理要求；必要时联系作者澄清。"
        ],
        [
          "决定与署名",
          "您将收到决定及理由。纳入数值将在图谱中注明来源和作者。"
        ]
      ]
    },
    "template": {
      "detailsTitle": "模板详情：工作表、填写说明与去标识化",
      "title": "结构化科研数据模板",
      "note": "Excel模板",
      "lead": "PGT-mt科研数据提交模板记录PGT-mt周期的最小数据集：患者及周期、胚胎、方法与结局，并设完整周期及未成功结局附加字段。关联工作表描述每个卵母细胞、胚胎、样本和结局，不含直接标识信息。",
      "sheetsTitle": "模板工作表",
      "fields": "{{n}}个字段，其中{{r}}个必填",
      "extra": "另含英俄双语说明、各字段定义、单位及允许值的数据字典，以及下拉选项。",
      "rulesTitle": "零值、缺失数据与低于检出限的结果不同",
      "rules": [
        "空白单元格表示“未报告／未知”。",
        "计数为0表示“已计数，数量为零”。",
        "低于检出限是独立数值类型（below_lod），需注明检出限，不能填0。",
        "已发表的区间或界限按原文保留，不以中点填补。",
        "分析失败或未开展仍保留在表中，因为它属于周期记录。"
      ],
      "privacyTitle": "不含直接标识信息",
      "privacy": "模板不设姓名、姓名首字母、出生或操作确切日期、地址、患者联系方式或病历号字段。年龄按组记录，时间为相对时间（胚胎天数、孕周、儿童月龄），全部编码均去标识化。"
    },
    "review": {
      "title": "科学审核",
      "note": "从提交到纳入",
      "lead": "所有提交均遵循相同审核流程。提交数据不会自动出现在公开图表中。纳入需数据库维护者单独决定，并通过审核后的数据集变更实现。",
      "figCaption": "数据路径：研究团队表格（红点为同样必需的未成功结局）、提交、科学审核、纳入图谱；部分提交被拒绝并说明理由。",
      "labels": {
        "researcher": "研究\n团队",
        "submitted": "已提交",
        "review": "审核中",
        "validated": "已验证",
        "atlas": "PGT-mt图谱",
        "rejected": "未接受"
      },
      "statusTitle": "状态",
      "status": {
        "submitted": [
          "已提交",
          "已登记询问或文件；不展示数据。"
        ],
        "under_review": [
          "审核中",
          "核查完整性、一致性、重叠、授权与去标识化；问题转交作者。"
        ],
        "validated": [
          "已验证",
          "数据已通过审核，准备按证据级别纳入。"
        ],
        "included": [
          "已纳入",
          "通过独立审核变更将数值加入数据集，并展示来源归属。"
        ],
        "rejected": [
          "未接受",
          "数据未纳入；向作者说明理由，作者可提交修订版。"
        ]
      },
      "tiersTitle": "证据级别",
      "tiersLead": "每个数值旁始终显示来源与证据状态。不同类别不会在未明确标注的情况下合并。",
      "tiers": {
        "peer_reviewed_published": [
          "经同行评审的文献",
          "在科学期刊通过独立同行评审的结果。"
        ],
        "published_not_peer_reviewed": [
          "已发表但未经独立同行评审",
          "预印本、会议摘要、学位论文及报告。"
        ],
        "unpublished_research_data": [
          "未发表科研数据",
          "研究团队与诊所分享给图谱、经审核的数据。"
        ],
        "unverified_report": [
          "未经核实的报告",
          "无法核实的信息，绝不绘于图表。"
        ]
      },
      "unpublishedTitle": "未发表数据另需",
      "unpublished": {
        "authority": "确认研究人员有权代表机构或数据所有者分享数据；",
        "permission": "允许使用数据并公开展示去标识化数值（可设暂缓公开期）；",
        "deidentification": "核查去标识化：无直接或间接标识信息；",
        "ethics": "确认伦理要求：伦理委员会批准，以及患者同意将数据用于研究。"
      }
    },
    "credit": {
      "title": "贡献认可",
      "note": "保留作者归属",
      "items": [
        "每个纳入数值注明原始文献、作者及DOI；未发表数据注明提供数据的研究团队与机构。",
        "贡献团队以其选择的形式获得图谱致谢。",
        "图谱欢迎科研合作。有实质贡献的团队可受邀合作发表科学论文。"
      ],
      "authorship": "共同署名不会自动产生：每篇文献单独讨论，并按公认作者资格标准（ICMJE）确定。"
    },
    "contact": {
      "title": "联系数据库维护者",
      "note": "科研咨询",
      "lead": "科研咨询、数据贡献或研究合作，请联系PGT-mt图谱创建与维护者Ilya Mazunin。",
      "inactiveTitle": "联系渠道尚未启用",
      "inactive": "数据库维护者尚未选定科研咨询地址，因此此处暂无表单或发送按钮。确定渠道后，将在此显示撰写消息链接。",
      "interim": "在此之前，可通过维护者页面列出的专业主页联系。",
      "curatorPage": "数据库维护者页面",
      "write": "联系数据库维护者",
      "includeTitle": "首封消息应包含什么",
      "include": [
        "姓名、职务、机构及国家；",
        "数据类型：已发表（DOI）或未发表；",
        "mtDNA变异及周期、胚胎、结局数量；",
        "是否包含未成功结局及完整周期；",
        "您偏好的安全数据文件分享方式。"
      ],
      "subjectLabel": "主题",
      "subject": "PGT-mt数据贡献",
      "body": "Mazunin博士：\n\n姓名、职务、机构、国家：\n数据类型（已发表——DOI／未发表）：\nmtDNA变异：\n周期／胚胎／结局数量：\n是否包含未成功结局及完整周期：\n\n本消息未附加任何患者医疗信息。",
      "warning": "初次咨询请勿附加患者医疗信息。数据文件仅在商定安全渠道后发送。"
    }
  },
  "fundamentals": {
    "title": "PGT-mt基础知识",
    "kicker": "科学背景与教育",
    "lead": "六章课程介绍线粒体遗传学、异质性、遗传瓶颈、胚胎发育与活检、PGT-mt方法及结果解读。科学论述链接至原始文献。",
    "howTo": "每章分两层：“基础”以通俗语言解释核心概念；“进阶”讨论机制、方法学局限及原始来源。两层共享相同图解和模型。",
    "tocTitle": "目录",
    "tocNote": "六章课程",
    "chapter": "第{{n}}章",
    "chapters": "章节",
    "modelsTitle": "交互模型",
    "modelsNote": "概念示意",
    "modelsText": "三个教学模型均不使用实验数据，也不预测个体结局。已发表观测见图谱科学栏目。",
    "bibliography": "参考文献",
    "bibliographyNote": "本栏目引用来源",
    "bibliographyLead": "本栏目各章引用的文献",
    "publicationsLink": "文献",
    "bibliographyTail": "为本栏目各章引用来源",
    "disclaimer": "教学材料，并非临床操作规程。",
    "level": "阅读层次",
    "essentials": "基础",
    "advanced": "进阶",
    "essentialsHint": "通俗解释",
    "advancedHint": "机制与来源",
    "figures": "图解与模型",
    "figuresNote": "两个层次通用",
    "toData": "从概念到图谱数据",
    "toDataNote": "实际数据",
    "refs": "本章参考文献",
    "refsNote": "含DOI",
    "refsChecked": "全部DOI已与PubMed核对；例外在条目旁标注。",
    "prev": "上一章",
    "next": "下一章",
    "allChapters": "全部章节",
    "usedIn": "引用章节",
    "refStatus": {
      "pubmed": "DOI已与PubMed记录核对",
      "publisher": "DOI取自出版商PDF；PubMed未收录",
      "preprint": "预印本，未经同行评审"
    },
    "het": {
      "title": "细胞中的异质性",
      "kind": "交互图解",
      "slider": "携带致病性变异的mtDNA比例",
      "count": "{{n}}个mtDNA分子中，{{m}}个携带致病性变异",
      "wt": "同质性：仅有野生型mtDNA",
      "het": "异质性：两种mtDNA共存于细胞内",
      "mut": "同质性：仅有携带致病性变异的mtDNA",
      "legendWt": "野生型mtDNA",
      "legendMut": "携带致病性变异的mtDNA",
      "caption": "含细胞核及五个线粒体的细胞；圆环为mtDNA分子。",
      "note": "本图用于解释异质性，并非疾病发生模型。真实细胞含数百至数千份mtDNA，此处显示100份。样本测量值是多个细胞的平均值，这些细胞的异质性水平可能不同。功能影响取决于变异及组织（第2章）。"
    },
    "thr": {
      "title": "阈值效应",
      "kind": "示意图",
      "x": "mtDNA异质性水平，%",
      "y": "呼吸链功能",
      "a": "变异／组织A",
      "b": "变异／组织B",
      "zone": "阈值",
      "caption": "异质性与功能的关系并非线性。突变mtDNA比例较低时，野生型拷贝可代偿缺陷；超过阈值后，功能急剧下降。阈值随变异、组织及呼吸链复合体而异[@rossignol2003]。示意曲线并非实测数据。"
    },
    "bn": {
      "title": "遗传瓶颈模拟器",
      "kind": "交互模型",
      "h0": "初始异质性水平",
      "n": "假定有效群体大小N",
      "count": "虚拟卵母细胞数",
      "redraw": "重新随机抽样",
      "axis": "模拟卵母细胞mtDNA异质性水平，%",
      "start": "初始水平",
      "summary": "中位数{{med}}%；半数数值位于{{q1}}%至{{q3}}%；范围{{min}}–{{max}}%。理论标准差：{{sd}}个百分点。",
      "banner": "简化随机模型，展示有效群体大小如何影响卵母细胞间异质性变异。它不预测单个患者胚胎的分布。",
      "modelTitle": "数学模型",
      "model": "每个虚拟卵母细胞从突变mtDNA比例为h₀的群体中，随机且独立地抽取N个分离单位。突变单位数K服从二项分布，K ~ Bin(N, h₀)；卵母细胞异质性h = K / N。h的均值为h₀，方差为h₀(1 − h₀) / N。这是单步Wright–Fisher抽样；描述携带者分离的Kimura分布将其推广至反复漂变[@otten2018]。",
      "limitsTitle": "模型局限",
      "limits": [
        "N是假定的统计参数，并非细胞内mtDNA分子的实际数量；已发表携带者估计值差异很大（例如10–145）[@otten2018]。",
        "模型仅包含随机漂变，不含选择、优先复制、细胞死亡或卵母细胞成熟，而这些似乎对某些变异很重要（第3章）。",
        "卵母细胞假定独立同分布；不含家庭内相关、周期间变异或年龄效应。",
        "不包含测量误差、检出限，也不区分卵母细胞、胚胎与活检。"
      ],
      "seed": "第{{n}}次抽样"
    },
    "dev": {
      "title": "植入前发育阶段",
      "kind": "示意图",
      "caption": "人类植入前发育及PGT-mt活检阶段：第3天取一个卵裂球，或第5–6天取数个滋养外胚层细胞。大小仅为示意。",
      "labels": {
        "d1": "第1天\n合子",
        "d2": "第2天\n4细胞",
        "d3": "第3天\n8细胞",
        "d4": "第4天\n桑椹胚",
        "d5": "第5–6天\n囊胚",
        "bxBlastomere": "卵裂球",
        "bxTe": "TE\n细胞"
      }
    },
    "bx": {
      "title": "探索囊胚与活检样本",
      "kind": "交互图解",
      "choose": "选择图中结构或使用按钮",
      "caption": "第5–6天囊胚：左侧为内细胞团，外围为滋养外胚层，中间为囊胚腔；数个滋养外胚层细胞经透明带开口取出进行活检。",
      "origin": "来源",
      "fate": "发育去向",
      "diagnostic": "诊断意义",
      "caveat": "注意事项",
      "labels": {
        "te": "滋养外胚层",
        "icm": "内细胞团",
        "cav": "囊胚腔",
        "bx": "TE活检"
      },
      "parts": {
        "te": {
          "name": "滋养外胚层（TE）",
          "origin": "胚胎外层细胞，在囊胚形成时（第5–6天）构成围绕囊胚腔的上皮层。",
          "fate": "形成胎盘及胚外膜；TE细胞不参与胎儿组织形成。",
          "diagnostic": "囊胚期活检取样TE细胞。多项研究中，TE异质性水平与ICM高度一致[@treff2012; @rubens2025; @tofilo2026]。",
          "caveat": "一致不等于完全相同。单个TE细胞可有差异，因此活检细胞数很重要[@rubens2025]。"
        },
        "icm": {
          "name": "内细胞团（ICM）",
          "origin": "囊胚一极的细胞群，在囊胚形成时与外层区分开。",
          "fate": "形成胚体（及部分胚外组织）；临床关注ICM衍生组织中的异质性。",
          "diagnostic": "为保持胚胎存活，临床活检不取样ICM。其异质性通过解剖不适于移植且捐赠研究的胚胎进行研究[@tofilo2026; @rubens2025]。",
          "caveat": "囊胚ICM尚非胎儿组织；TE与ICM一致不保证儿童各组织水平相同。"
        },
        "bx": {
          "name": "滋养外胚层活检",
          "origin": "活检针经透明带开口取出数个TE细胞，不接触ICM。",
          "fate": "形成胎盘及胚外膜；TE细胞不参与胎儿组织形成。但此处活检样本用于遗传分析。",
          "diagnostic": "测得异质性为所取细胞的平均水平。已发表数据显示可靠估计需要5–10个细胞[@rubens2025]。",
          "caveat": "这是在一个时间点取自未来形成胎盘细胞谱系的样本。细胞数、活检操作及分析方法由实验室确定并验证。"
        }
      }
    }
  },
  "patientContent": {
    "intro": "本栏目介绍线粒体DNA变异的胚胎植入前遗传学检测（PGT-mt）、可能的帮助及信息局限。它能帮助您准备与临床遗传学专家的讨论，但不能替代咨询。",
    "sections": [
      {
        "title": "什么是线粒体DNA？",
        "paragraphs": [
          "线粒体帮助细胞供能。它们拥有小型独立基因组，称为线粒体DNA（mtDNA），子女从母亲继承。",
          "细胞通常含数百至数千份mtDNA。致病性变异是可能导致疾病的改变。它通常来自母亲，也可能首次出现。往往只有部分mtDNA拷贝携带变异，其比例称为异质性水平，以百分比表示。",
          "同一女性血液、尿液、肌肉及不同卵细胞（卵母细胞）的异质性水平可能不同。",
          "女性以异质性状态携带mtDNA致病性变异时，PGT-mt有用：部分拷贝携带变异，其余不携带。若全部拷贝均携带（同质性），检测无法找到比例更低的胚胎。若疾病由核基因变异引起，则需要另一检测PGT-M。男性不向子女传递mtDNA变异。"
        ]
      },
      {
        "title": "PGT-mt如何进行",
        "paragraphs": [
          "体外受精（IVF）过程中，在第3天或第5–6天取细胞。通常第3天取一个卵裂球（早期胚胎细胞），或第5–6天取数个滋养外胚层细胞。滋养外胚层是参与形成胎盘的外层细胞。实验室测量样本中携带变异mtDNA的比例。",
          "同一女性的胚胎可有不同异质性水平。检测有助于找到水平最低的胚胎，前提是低于事先与临床遗传学专家针对特定变异商定的界值。若全部胚胎超过界值，通常不建议移植。",
          "周期开始前无法精确预测结果。低异质性胚胎数随患者及治疗周期而变；部分周期一个也没有。"
        ]
      },
      {
        "title": "百分比为何不等于诊断？",
        "paragraphs": [
          "PGT-mt将胚胎异质性水平与商定界值比较，无法确定未来儿童是否会患线粒体病。",
          "检测在单一时间点测量一个或数个细胞中携带变异mtDNA的比例。儿童健康取决于此变异在后续发育中如何分布于各组织器官。",
          "不存在通用的“安全”异质性百分比。已发表参考值来自不同类型证据：18%为成年携带者肌肉测量的估计，而30%是某临床项目采用的胚胎筛选标准。不同mtDNA变异的阈值不同，没有任何数值能保证儿童健康。基础课程第6章解释这些差异。"
        ]
      },
      {
        "title": "PGT-mt与染色体检测（PGT-A）",
        "paragraphs": [
          "染色体数目也影响妊娠机会及儿童健康。在同一样本上，可将PGT-mt与胚胎植入前非整倍体检测（PGT-A）联合开展，评估染色体数目。医生与家庭结合母亲年龄决定是否采用。",
          "随着母亲年龄增加，染色体数目符合预期的胚胎比例下降。这对胚胎选择的限制常大于mtDNA异质性。"
        ]
      },
      {
        "title": "降低风险，但不能消除",
        "paragraphs": [
          "已发表数据表明PGT-mt降低线粒体病传递风险，但不能消除风险。",
          "任何PGT-mt移植前均应与医生讨论产前诊断，包括活检样本未检出变异的情况。“未检出”表示检测在其分析能力范围内未发现变异，并不能证明为“0%”。",
          "可能没有完全不含该变异的胚胎。因此医生会提前计划孕期及出生后的随访。",
          "医生也可协助制定儿童出生后健康与发育的个体化监测计划。"
        ]
      },
      {
        "title": "还有哪些选择？",
        "paragraphs": [
          "PGT-mt是多种生育选择之一："
        ],
        "items": [
          "产前诊断：孕期采用绒毛或羊水检测。对于同质性变异，仅测量其比例不能预测儿童是否发病。",
          "供卵：使用健康供者卵母细胞。儿童将从卵子供者而非拟育母亲继承核DNA及mtDNA。",
          "线粒体捐赠：将患者核物质转入不含该致病性变异mtDNA的供者卵母细胞或合子。可及性取决于各国法律。少量母源mtDNA可能随核物质携入，因此风险降低但未消除。"
        ],
        "closingTitle": "如何选择？",
        "closing": "没有适合所有人的单一方案。选择取决于mtDNA变异、家族史、可用技术及治疗可及性。应通过与生殖医学专家和临床遗传学专家的开放讨论，作出个体化决定。"
      }
    ],
    "questions": {
      "title": "应向临床遗传学专家询问什么？",
      "intro": "问题清单可帮助您在就诊时记住所需询问的内容：",
      "groups": [
        {
          "title": "个人情况",
          "items": [
            "“我携带哪种mtDNA致病性变异？现有证据说明了什么？”",
            "“我的血液或上皮细胞等组织异质性水平是多少？这对该变异传递至卵子的情况能说明什么？”"
          ]
        },
        {
          "title": "PGT与胚胎筛选",
          "items": [
            "“我的情况下，您建议采用什么异质性界值来筛选胚胎，为什么？”",
            "“PGT-mt是否与PGT-A（染色体异常检测）同时进行？”"
          ]
        },
        {
          "title": "计划与风险",
          "items": [
            "“若本周期未获得低异质性胚胎，下一步和替代方案是什么？”"
          ]
        },
        {
          "title": "妊娠与儿童健康",
          "items": [
            "“孕期需要哪些特殊随访或产前诊断？出生后如何监测儿童健康？”"
          ]
        }
      ],
      "closing": "您可保存或打印清单，就诊时携带，并在与医生讨论时添加笔记。"
    },
    "glossary": {
      "title": "术语解释",
      "items": [
        [
          "mtDNA",
          "线粒体内的小型基因组。"
        ],
        [
          "致病性变异",
          "可能引起疾病的DNA改变。"
        ],
        [
          "异质性",
          "同一细胞或样本内存在不同类型的mtDNA。"
        ],
        [
          "同质性",
          "全部mtDNA拷贝在相应位点具有同一变异。"
        ],
        [
          "异质性水平",
          "携带所测变异的mtDNA拷贝比例，以百分比表示。"
        ],
        [
          "活检样本",
          "为检测取出的少量细胞样本。"
        ],
        [
          "卵裂球",
          "早期胚胎细胞。"
        ],
        [
          "滋养外胚层",
          "囊胚外层细胞，参与形成胎盘。"
        ],
        [
          "卵母细胞与合子",
          "卵母细胞为卵细胞；合子为受精后形成的细胞。"
        ],
        [
          "核物质",
          "细胞核内DNA，与mtDNA不同。"
        ]
      ]
    }
  },
  "interfaceCopy": {
    "Methods": {
      "collectedTitle": "数据收集",
      "datasetSummary": "从已发表研究提取单个胚胎异质性数值。当前数据集包含{{v1}}种mtDNA变异的{{v0}}个数值；{{v2}}个囊胚的多个样本测量（TE活检、ICM、剩余TE或混合ICM+TE）；以及{{v3}}名胎儿与儿童的产前或出生后测量，均有对应移植胚胎的异质性结果。尽可能使用原始文献；因无法获得原始来源而从综述获取的数值均有明确标记。",
      "incompleteCycles": "研究未必报告周期内全部胚胎，因此数据集不代表纳入周期的所有胚胎。合并已发表病例不能得出PGT-mt临床成功率。",
      "sizeTitle": "数据集规模",
      "measure": "指标",
      "count": "数量",
      "representationTitle": "数值如何表示",
      "undetectedMeaning": "若“0”代表未检出，并不能证明在分子层面完全不存在该变异。仅在来源报告时显示检出限。",
      "intervalMeaning": "若仅发表区间，保留上下界，不以中点填补。",
      "derivationMeaning": "每个数值附获取方式。仅当补充工作簿记载相应规则时才标记推导方式：",
      "landscapeValues": "“不同胚胎之间”栏目的数值",
      "pointProvenance": "每个点可追溯至补充工作簿行及文献（DOI）。",
      "guidesTitle": "图表参考线",
      "checked": "已核查",
      "guideCaveat": "这些数值均不界定单个胚胎的安全阈值。三个已发表参考值（18、15–30和30%）针对不同问题，来自不同组织、方法及结局。",
      "limitationsTitle": "局限",
      "heterogeneousStudies": "数据集为描述性数据集，不支持荟萃分析：研究的活检阶段、分析方法与检出限不同。",
      "publicationBias": "成功周期比未成功周期更常发表；无数据可校正此偏倚。",
      "dependentEmbryos": "胚胎并非独立观测。许多来自同一患者和周期，不同变异的记录数分布不均。合并比例不估计个体风险。",
      "dependentChildSamples": "胚胎–儿童比较中，同一儿童可贡献多个测量（不同组织、年龄、方法、实验室）。",
      "scenarioModel": "PGT-mt × PGT-A模型计算情景，而非个体预测。胚胎间依赖性是假定情景参数，不是由家庭数据估计的相关性。",
      "classificationTitle": "变异分类",
      "classificationMeaning": "变异分类取自补充工作簿。图谱不独立分类变异，也不依据异质性水平分类。每种分类附原始文献的支持性说明及核查日期。本次审核未与MITOMAP或ClinVar交叉核查。",
      "variant": "变异",
      "variantClass": "类别",
      "basis": "依据",
      "reportingTitle": "PGT-mt周期应报告什么",
      "reportPatient": "患者及周期：年龄、家族史、携带者组织异质性、卵母细胞数、受精及胚胎发育。",
      "reportEmbryo": "胚胎：活检日、形态、PGT-A结果及各样本异质性；包括未移植者在内的每个胚胎。",
      "reportMethod": "分析方法：全基因组扩增、靶区域、线性、检出限、对照。",
      "reportOutcome": "结局：产前诊断及出生后随访，注明组织、年龄、方法。"
    },
    "Cases": {
      "primaryAttribution": "每个病例的原始来源见“来源”列：作者、文献及DOI。"
    },
    "Concordance": {
      "pathogenicShort": "致病性",
      "medianBar": "红色横线",
      "rangeSummary": "极差中位数：{{v0}}个百分点（{{v1}}个致病性变异囊胚）、{{v2}}个百分点（HV2）、{{v3}}个百分点（全部{{v4}}个）；卵裂期——{{v5}}个百分点（n = {{v6}}）。",
      "range": "极差",
      "blastomeres": "卵裂球",
      "rangePp": "极差（最大值 − 最小值），百分点",
      "cells": "细胞",
      "coverage": "测序深度，×"
    },
    "Offspring": {
      "panelA": "A",
      "panelB": "B",
      "comparisonSummary": "{{v0}}组低胚胎异质性比较中，{{v1}}组组织异质性较低或未检出。归为不一致的全部比较（{{v2}}）涉及同一儿童，其出生后样本采用另一方法分析。",
      "referenceView": "参考视图中",
      "yes": "是",
      "no": "否"
    },
    "ScienceIndex": {
      "landscapeSummary": "mtDNA：涵盖{{variants}}{{variantWord}}，共{{v0}}{{values}}",
      "concordanceSummary": "{{v0}}{{blastocysts}} + {{v1}}{{embryos}}（卵裂期）",
      "offspringSummary": "{{v0}}{{comparisons}}，{{v1}}名胎儿与儿童",
      "scenarioSummary": "情景计算",
      "lead": "图谱有四个科学栏目。图表默认打开参考视图；附加筛选标为“扩展视图”。每个点链接至原始文献及源工作簿对应行。"
    }
  },
  "methodLabels": {
    "countLabels": {
      "landscape_values": "胚胎异质性数值",
      "landscape_variants": "胚胎间异质性栏目中的mtDNA变异",
      "concordance_blastocysts": "有多个样本测量的囊胚",
      "concordance_records": "囊胚样本记录",
      "cleavage_embryos": "卵裂期胚胎（两个卵裂球）",
      "offspring_records": "胚胎 → 后代记录",
      "offspring_children": "全部胚胎–后代记录中的胎儿与儿童（含排除记录）",
      "offspring_children_exact_pair": "绘图数据集中具有匹配胚胎–组织配对的胎儿与儿童",
      "publications": "文献"
    },
    "thresholdRoles": {
      "study_estimate": "特定研究的风险估计",
      "programme_criterion": "临床项目工作标准",
      "literature_range": "文献所引范围",
      "chart_convention": "图表约定"
    }
  }
}

export default zh
