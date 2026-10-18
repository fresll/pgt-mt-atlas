// Сведения о создателе и кураторе атласа. Источник — CV 2026 (profile/, в сборку не входит).
// Биографический текст и замена публикации Iliushchenko 2025 утверждены куратором
// в документе PTG-mt Atlas.docx от 15.10.2026.
// Исходные CV:
// IlyaMazunin.DetailedCV.2026.pdf (EN) и ИльяМазунин.CV.2026.pdf (RU). Остальные сведения сохранены по CV.
// Содержание восстановлено из ветки atlas-preview (163fc61) и сверено с обоими CV 2026:
// должности, предпринимательская деятельность, пособия (ISBN), 15 DOI и счётчики публикаций совпадают.
// Расхождение между CV: для Tofilo et al., 2026 в EN CV указано «doi: in press», в RU CV и в наборе
// данных атласа — 10.1007/s10815-026-04012-y (PMID 42649365); показывается DOI из набора данных.
// Публичные ссылки и контакты включаются только после утверждения (null — «по согласованию»).
import { CURATOR_CONTACT } from '../lib/contribute'
import type { Bilingual } from './atlas'

export type Item = { years: string; text: Bilingual }
export type Pub = { authors: string; title: string; journal: string; year: number; doi: string | null; topic: 'pgt' | 'editing' | 'mito' | 'repro' }

export const creator = {
  name: { en: 'Ilya Mazunin', ru: 'Илья Мазунин' } as Bilingual,
  degree: { en: 'Doctor of Biological Sciences (DSc), Genetics', ru: 'Доктор биологических наук, генетика' } as Bilingual,
  photo: { src: 'img/ilya-mazunin.jpg', w: 720, h: 960 },

  /** Краткое представление (шапка страницы). */
  lead: {
    en: 'Geneticist and molecular biologist specialising in the human mitochondrial genome in health and disease.',
    ru: 'Генетик и молекулярный биолог, специализирующийся на изучении роли генома митохондрий в норме и при патологиях.',
  } as Bilingual,

  /** Роль в проекте. */
  role: {
    en: 'Ilya Mazunin created PGT-mt Atlas as an independent international resource for published individual mtDNA heteroplasmy values from preimplantation genetic testing, with traceable provenance for every value.',
    ru: 'Илья Мазунин создал Атлас ПГТ-мт как самостоятельный международный ресурс, который собирает опубликованные индивидуальные значения гетероплазмии мтДНК при преимплантационном генетическом тестировании и показывает происхождение каждого значения.',
  } as Bilingual,

  /** Основные академические должности (для шапки и карточки на главной). */
  headline: [
    { en: 'Senior Research Scientist, Skolkovo Institute of Science and Technology (Skoltech), Moscow', ru: 'Старший научный сотрудник, Сколковский институт науки и технологий, Москва' },
    { en: 'Head of the Department of Biology and Genetics, Petrovsky Medical University, Moscow', ru: 'Заведующий кафедрой биологии и генетики, Медицинский университет Петровского, Москва' },
  ] as Bilingual[],

  bio: {
    en: [
      'Ilya Mazunin’s research focuses on the human mitochondrial genome. Since his postgraduate studies, he has investigated pathogenic mtDNA variants associated with inherited disease. His work on the distribution of mtDNA mutations has expanded to include how they arise, approaches to preventing their transmission, and gene therapy strategies.',
      'His work includes the development of mtDNA editing tools based on CRISPR-Cas9, CRISPR-Cas12a and prokaryotic Argonaute proteins, alongside approaches to preventing the transmission of pathogenic mtDNA variants, including PGT-mt and mitochondrial donation.',
    ],
    ru: [
      'Илья Мазунин всю научную жизнь специализируется на изучении генома митохондрий человека. Еще с аспирантуры изучал патогенные варианты мтДНК, связанные с различными наследственными болезнями. Спустя годы, изучение распространения мутаций в мтДНК дополнилось изучением природы их возникновения и разработкой как технологий предотвращения их наследования, так и методов их генной терапии.',
      'Работы Ильи Мазунина включают (но не ограничены) разработку инструментов для редактирования мтДНК на основе CRISPR-Cas9, CRISPR-Cas12a и прокариотических белков-аргонавтов, а также подходов к предотвращению наследования патогенных вариантов мтДНК, таких как ПГТ-мт и митохондриальная донация.',
    ],
  } as Record<'en' | 'ru', string[]>,

  research: [
    { en: 'Preimplantation genetic testing for mitochondrial DNA variants (PGT-mt) and mtDNA heteroplasmy in human embryos', ru: 'Преимплантационное генетическое тестирование вариантов мтДНК (ПГТ-мт) и гетероплазмия мтДНК в эмбрионах человека' },
    { en: 'Targeted editing and elimination of mitochondrial DNA: CRISPR-Cas9, Cas12a and prokaryotic Argonautes', ru: 'Направленное редактирование и элиминация митохондриальной ДНК: CRISPR-Cas9, Cas12a и прокариотические аргонавты' },
    { en: 'Genetics and diagnosis of mitochondrial diseases', ru: 'Генетика и диагностика митохондриальных заболеваний' },
    { en: 'Mitochondrial mutagenesis: mutational spectra and deletion formation', ru: 'Мутагенез митохондриального генома: мутационные спектры и образование делеций' },
    { en: 'Reproductive genetics: chromosomal abnormalities and mosaicism in human embryos, embryo selection', ru: 'Репродуктивная генетика: хромосомные нарушения и мозаицизм эмбрионов человека, выбор эмбрионов для переноса' },
  ] as Bilingual[],

  education: [
    { years: '2025', text: { en: 'Doctor of Biological Sciences (DSc), Genetics (1.5.7) — Research Centre for Medical Genetics, Moscow', ru: 'Доктор биологических наук, 1.5.7 — генетика. Медико-генетический научный центр, Москва' } },
    { years: '2010', text: { en: 'Candidate of Biological Sciences (PhD), Molecular Genetics (03.01.07) — Institute of Chemical Biology and Fundamental Medicine SB RAS, Novosibirsk', ru: 'Кандидат биологических наук, 03.01.07 — молекулярная генетика. Институт химической биологии и фундаментальной медицины СО РАН, Новосибирск' } },
    { years: '2006', text: { en: 'Degree in Biology, specialisation in Genetics — Chelyabinsk State University', ru: 'Высшее биологическое образование, генетика. Челябинский государственный университет' } },
  ] as Item[],

  current: [
    { years: '2024 –', text: { en: 'Head of Department of Biology and Genetics, Petrovsky Medical University, Moscow', ru: 'Заведующий кафедрой биологии и генетики, Медицинский университет Петровского, Москва' } },
    { years: '2024 –', text: { en: 'Leading Research Scientist, Laboratory of Experimental Gene Therapy for Inherited Metabolic Diseases, Research Centre for Medical Genetics named after Academician N.P. Bochkov, Moscow', ru: 'Ведущий научный сотрудник лаборатории экспериментальной генетической терапии наследственных болезней обмена веществ, Медико-генетический научный центр имени академика Н.П. Бочкова, Москва' } },
    { years: '2019 –', text: { en: 'Senior Research Scientist, Center for Bio- and Medical Technologies, Skolkovo Institute of Science and Technology (Skoltech), Moscow', ru: 'Старший научный сотрудник Центра био- и медицинских технологий, Сколковский институт науки и технологий, Москва' } },
    { years: '2025 –', text: { en: 'Chief Executive Officer, MODICUM LLC, Moscow', ru: 'Генеральный директор ООО «МОДИКУМ», Москва' } },
  ] as Item[],

  past: [
    { years: '2024 – 2026', text: { en: 'Deputy Head, Reference Center for Assessment of Genetic Purity of Laboratory Animals, Avtsyn Research Institute of Human Morphology, Moscow', ru: 'Заместитель руководителя Референс-центра по оценке генетической чистоты лабораторных животных, НИИ морфологии человека имени академика А.П. Авцына, Москва' } },
    { years: '2020 – 2023', text: { en: 'Head of Genetic Laboratory, Medical Genomics LLC, Moscow and Tver', ru: 'Заведующий генетической лабораторией «Медикал Геномикс», Москва и Тверь' } },
    { years: '2020 – 2022', text: { en: 'Scientific Director, Network of Medical Centers “Fomin Clinics”', ru: 'Директор по науке, Федеральная сеть медицинских центров «Клиника Фомина»' } },
    { years: '2019 – 2020', text: { en: 'Leading Research Scientist, Genome Research Centre, Immanuel Kant Baltic Federal University, Kaliningrad', ru: 'Ведущий научный сотрудник, Центр геномных исследований, Балтийский федеральный университет имени Иммануила Канта, Калининград' } },
    { years: '2012 – 2019', text: { en: 'Head of Molecular Genetics Laboratory, Immanuel Kant Baltic Federal University, Kaliningrad', ru: 'Заведующий лабораторией молекулярно-генетических технологий, Балтийский федеральный университет имени Иммануила Канта, Калининград' } },
    { years: '2016 – 2019', text: { en: 'Associate Professor, Institute of Living Systems, Immanuel Kant Baltic Federal University', ru: 'Доцент, Институт живых систем, Балтийский федеральный университет имени Иммануила Канта' } },
    { years: '2012 – 2015', text: { en: 'Associate Professor, Department of Obstetrics and Gynecology, Medical Institute, Immanuel Kant Baltic Federal University', ru: 'Доцент, кафедра акушерства и гинекологии, Медицинский институт, Балтийский федеральный университет имени Иммануила Канта' } },
    { years: '2011 – 2012', text: { en: 'Research Scientist, Ural Research Center for Radiation Medicine, Chelyabinsk', ru: 'Научный сотрудник, Уральский научно-практический центр радиационной медицины, Челябинск' } },
    { years: '2009 – 2011', text: { en: 'Junior Research Scientist, Institute of Chemical Biology and Fundamental Medicine SB RAS, Novosibirsk', ru: 'Младший научный сотрудник, Институт химической биологии и фундаментальной медицины СО РАН, Новосибирск' } },
    { years: '2006 – 2009', text: { en: 'Senior Laboratory Assistant, Institute of Cytology and Genetics SB RAS, Novosibirsk', ru: 'Старший лаборант, Институт цитологии и генетики СО РАН, Новосибирск' } },
  ] as Item[],

  /** Профессиональная деятельность (в CV — раздел «Additional activities» / «Доп. активности»). */
  professional: [
    { years: '2021 –', text: { en: 'Board Member, Interdisciplinary Clinical Association for Reproductive Medicine (ICARM)', ru: 'Член правления, Междисциплинарная клиническая ассоциация репродуктивной медицины' } },
  ] as Item[],

  /** Предпринимательская деятельность — раскрывается и как конфликт интересов (страница «О проекте»). */
  ventures: [
    { years: '2026 –', text: { en: 'Co-founder, CellKinetica SARL (Switzerland): genomic data analysis providing additional information for ranking human embryos for transfer in ART cycles', ru: 'Сооснователь, CellKinetica SARL (Швейцария): анализ геномных данных для дополнительной информации при ранжировании эмбрионов человека на перенос в циклах ВРТ' } },
    { years: '2025 –', text: { en: 'Co-founder, Florence Labs LLC: reagents and software for whole-genome screening of embryos in ART cycles', ru: 'Сооснователь, ООО «Флоренс Лабс»: реагенты и программное обеспечение для полногеномного скрининга эмбрионов в циклах ВРТ' } },
    { years: '2025 –', text: { en: 'Founder, MODICUM LLC (Skolkovo resident): genomic data analysis providing additional information for ranking human embryos for transfer in ART cycles', ru: 'Основатель, ООО «МОДИКУМ» (резидент Сколково): анализ геномных данных для дополнительной информации при ранжировании эмбрионов человека на перенос в циклах ВРТ' } },
  ] as Item[],

  /** Раскрытие интересов. */
  coi: {
    en: 'CEO and founder of MODICUM LLC; co-founder of Florence Labs LLC and CellKinetica SARL (Switzerland). These companies develop genomic data analysis for embryos in assisted reproduction. The Atlas is a non-commercial scientific resource; it presents data from published sources only.',
    ru: 'Генеральный директор и основатель ООО «МОДИКУМ»; сооснователь ООО «Флоренс Лабс» и CellKinetica SARL (Швейцария). Компании разрабатывают решения для анализа геномных данных эмбрионов в программах ВРТ. Атлас — некоммерческий научный ресурс; данные в нём представлены только по опубликованным источникам.',
  } as Bilingual,

  teaching: [
    { years: '2026', text: { en: 'Cell Biology: textbook for medical students / I.O. Mazunin, Yu.V. Markina, T.V. Kirichenko, B.A. Rimskaya, A.M. Markin. Petrovsky Medical University. Moscow: MDV Group, 2026. ISBN 978-5-906748-37-9', ru: 'Биология клетки: учебное пособие для студентов медицинских вузов / И.О. Мазунин, Ю.В. Маркина, Т.В. Кириченко, Б.А. Римская, А.М. Маркин. Мед. ун-т им. акад. Б.В. Петровского. М.: Группа МДВ, 2026. ISBN 978-5-906748-37-9' } },
    { years: '2026', text: { en: 'Template Processes in the Cell: textbook for medical students / I.O. Mazunin, T.V. Kirichenko, Yu.V. Markina, I.A. Marinina, B.A. Rimskaya, U.S. Khovantseva. Petrovsky Medical University. Moscow: MDV Group, 2026. ISBN 978-5-906748-38-6', ru: 'Матричные процессы в клетке: учебное пособие для студентов медицинских вузов / И.О. Мазунин, Т.В. Кириченко, Ю.В. Маркина, И.А. Маринина, Б.А. Римская, У.С. Хованцева. Мед. ун-т им. акад. Б.В. Петровского. М.: Группа МДВ, 2026. ISBN 978-5-906748-38-6' } },
  ] as Item[],

  /** Избранные публикации — авторы, названия и DOI точно по CV. */
  publications: [
    { topic: 'pgt', year: 2026, authors: 'Tofilo M., Volodyaev I., Tretiakov E., Kokorina O., Avdeichik S., Smirnova A., Grechenko E., Filimonova A., Sudarikova N., Kirillova A., Mazunin I.', title: 'Concordant mtDNA heteroplasmy between trophectoderm and inner cell mass supports blastocyst-stage PGT-mt for m.14487T>C', journal: 'Journal of Assisted Reproduction and Genetics', doi: '10.1007/s10815-026-04012-y' },
    { topic: 'pgt', year: 2023, authors: 'Tofilo M., Voronova N., Nigmatullina L., Kuznetsova E., Timonina V., Efimenko B., Turgunkhujaev O., Avdeichik S., Ansar M., Popadin K., Kirillova A., Mazunin I.', title: 'Live birth of a healthy child in a couple with identical mtDNA carrying a pathogenic c.471_477delTTTAAAAinsG variant in the MOCS2 gene', journal: 'Genes', doi: '10.3390/genes14030720' },
    { topic: 'pgt', year: 2023, authors: 'Korchivaya E., Silaeva Y., Mazunin I., Volodyaev I.', title: 'The mitochondrial challenge: disorders and prevention strategies', journal: 'BioSystems', doi: '10.1016/j.biosystems.2022.104819' },
    { topic: 'pgt', year: 2022, authors: 'Kirillova A., Mazunin I.', title: 'Operation “mitochondrial wipeout” — clearing recipient mitochondria DNA during nuclear transfer', journal: 'Journal of Assisted Reproduction and Genetics', doi: '10.1007/s10815-022-02561-6' },
    { topic: 'repro', year: 2025, authors: 'Volodyaev I., Ivanova A., Korchivaya E., Surnov A., Pomerantseva E., Lebedev I., Semenova M., Mazunin I.', title: 'The chromosomal challenge of human embryos: prevalence of aneuploidy and mosaicism', journal: 'F&S Reviews', doi: '10.1016/j.xfnr.2024.100082' },
    { topic: 'repro', year: 2025, authors: 'Ivanova A., Korchivaya E., Semenova M., Lebedev I., Mazunin I., Volodyaev I.', title: 'The chromosomal challenge of human embryos: mechanisms and fundamentals', journal: 'Human Genetics and Genomics Advances', doi: '10.1016/j.xhgg.2025.100437' },
    { topic: 'repro', year: 2021, authors: 'Kirillova A., Smitz J.E.J., Sukhikh G., Mazunin I.', title: 'The role of mitochondria in oocyte maturation', journal: 'Cells', doi: '10.3390/cells10092484' },
    { topic: 'editing', year: 2026, authors: 'Rimskaya B., Kropocheva E., Shchukina E., Ulashchik E., Gelfenbein D., Lisitskaya L., Shmanai V., Smirnikhina S., Kulbachinskiy A., Mazunin I.', title: 'Targeting of human mitochondrial DNA with programmable pAgo nuclease', journal: 'Cells', doi: '10.3390/cells15020127' },
    { topic: 'editing', year: 2026, authors: 'Zakirova E., Sergeeva S., Morozova K., Kiseleva E., Tanaka M., Mazunin I., Orishchenko K.', title: 'Specific elimination of m.8993T>G mitochondrial haplotype in NARP cybrid cells by CRISPR-Cas9 system', journal: 'Scientific Reports', doi: '10.1038/s41598-026-49007-y' },
    { topic: 'editing', year: 2025, authors: 'Nikitchina N., Hecke A-M., Shebanov N., Mazunin I., Tarassov I., Entelis N.', title: 'Targeted deletions in human mitochondrial DNA engineered by Type V CRISPR-Cas12a system', journal: 'NAR Molecular Medicine', doi: '10.1093/narmme/ugaf021' },
    { topic: 'editing', year: 2025, authors: 'Rimskaya B., Shebanov N., Entelis N., Mazunin I.', title: 'Enzymatic tools for mitochondrial genome manipulation', journal: 'Biochimie', doi: '10.1016/j.biochi.2024.10.013' },
    { topic: 'editing', year: 2022, authors: 'Shebanova R., Nikitchina N., Shebanov N., Mekler V., Kuznedelov K., Ulashchik E., Vasilev R., Sharko O., Shmanai V., Tarassov I., Severinov K., Entelis N., Mazunin I.', title: 'Efficient target cleavage by Type V Cas12a effector programmed with split CRISPR RNA', journal: 'Nucleic Acids Research', doi: '10.1093/nar/gkab1227' },
    { topic: 'mito', year: 2023, authors: 'Shamanskiy V., Mikhailova A.A., Tretiakov E.O., Ushakova K., Mikhailova A.G., Oreshkov S., Knorre D., Ri N., Overdevest J.B., Lukowski C-W., Gostimskaya I., Yurov V., Liuo S.W., Lin T-K., Kunz W., Reymond A., Mazunin I., Bazykin G.A., Fellay J., Tanaka M., Khrapko K., Gunbin K., Popadin K.', title: 'Secondary structure of the human mitochondrial genome affects formation of deletions', journal: 'BMC Biology', doi: '10.1186/s12915-023-01606-1' },
    { topic: 'mito', year: 2022, authors: 'Mikhaylova A.G., Mikhailova A.A., Ushakova K., Tretiakov E.O., Iliushchenko D., Shamansky V., Lobanova V., Kozenkov I., Efimenko B., Yurchenko A.A., Kozenkova E., Zdobnov E., Makeev V., Yurov V., Tanaka M., Gostimskaya I., Fleischmann Z., Annis S., Franco M., Wasko K., Denisov S., Kunz W., Knorre D., Mazunin I., Nikolaev S., Fellay J., Reymond A., Khrapko K., Gunbin K., Popadin K.', title: 'A mitochondria-specific mutational signature of aging: increased rate of A>G substitutions on a heavy strand', journal: 'Nucleic Acids Research', doi: '10.1093/nar/gkac779' },
    { topic: 'mito', year: 2025, authors: 'Iliushchenko D., Efimenko B., Mikhailova A.G., Shamanskiy V., Saparbaev M.K., Matkarimov B.T., Mazunin I., Knorre D., Kunz W.S., Denisov S., Khrapko K., Fellay J., Gunbin K., Popadin K.', title: 'Deciphering the Foundations of Mitochondrial Mutational Spectra: Replication-Driven and Damage-Induced Signatures Across Chordate Classes', journal: 'Molecular Biology and Evolution', doi: '10.1093/molbev/msae261' },
  ] as Pub[],

  /** Публикаций в CV: оригинальных исследований и обзоров (подсчитано по EN CV 2026). */
  cvCounts: { original: 37, reviews: 20, patents: 6 },

  /** Профили. ResearchGate и LinkedIn — из CV 2026 и уже опубликованы на странице; остальные — после утверждения (null). */
  profiles: [
    { key: 'orcid', label: 'ORCID', url: null as string | null },
    { key: 'scholar', label: 'Google Scholar', url: null as string | null },
    { key: 'pubmed', label: 'PubMed', url: null as string | null },
    { key: 'researchgate', label: 'ResearchGate', url: 'https://www.researchgate.net/lab/Ilia-Mazunin-Lab' as string | null },
    { key: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/ilya-mazunin-ph-d-910875258/' as string | null },
  ],

  /** Контакты, утверждённые куратором (адрес — тот же, что в lib/contribute.ts). Остальные контакты из CV не публикуются. */
  contacts: {
    collaboration: CURATOR_CONTACT.email,
    patients: null as string | null,
  },
}

/** Метки тематик избранных публикаций. */
export const topicLabel: Record<Pub['topic'], Bilingual> = {
  pgt: { en: 'PGT-mt and mitochondrial disease prevention', ru: 'ПГТ-мт и профилактика митохондриальных заболеваний' },
  repro: { en: 'Reproductive genetics', ru: 'Репродуктивная генетика' },
  editing: { en: 'Mitochondrial genome editing', ru: 'Редактирование митохондриального генома' },
  mito: { en: 'Mitochondrial genome variation and mutagenesis', ru: 'Изменчивость и мутагенез митохондриального генома' },
}
