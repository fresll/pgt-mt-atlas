import { doiUrl, pubById } from '../data/atlas'
import { useLang, useT } from '../i18n'

// Персональная страница создателя и куратора. Источник — CV (profile/), без личных контактов.
interface Pub {
  authors: string
  title: string
  journal: string
  doi?: string
}

const SELECTED: Pub[] = [
  { authors: 'Tofilo M., Volodyaev I., Tretiakov E., …, Kirillova A., Mazunin I.', title: 'Concordant mtDNA heteroplasmy between trophectoderm and inner cell mass supports blastocyst-stage PGT-mt for m.14487T>C', journal: 'Journal of Assisted Reproduction and Genetics, 2026', doi: pubById.tofilo2026?.doi ?? undefined },
  { authors: 'Volodyaev I., Ivanova A., Korchivaya E., …, Semenova M., Mazunin I.', title: 'The chromosomal challenge of human embryos: prevalence of aneuploidy and mosaicism', journal: 'F&S Reviews, 2025', doi: '10.1016/j.xfnr.2024.100082' },
  { authors: 'Rimskaya B., Shebanov N., Entelis N., Mazunin I.', title: 'Enzymatic tools for mitochondrial genome manipulation', journal: 'Biochimie, 2025', doi: '10.1016/j.biochi.2024.10.013' },
  { authors: 'Rimskaya B., Kropocheva E., Shchukina E., …, Kulbachinskiy A., Mazunin I.', title: 'Targeting of human mitochondrial DNA with programmable pAgo nuclease', journal: 'Cells, 2026', doi: '10.3390/cells15020127' },
  { authors: 'Korchivaya E., Silaeva Y., Mazunin I., Volodyaev I.', title: 'The mitochondrial challenge: disorders and prevention strategies', journal: 'BioSystems, 2023', doi: '10.1016/j.biosystems.2022.104819' },
  { authors: 'Mikhaylova A.G., Mikhailova A.A., Ushakova K., …, Gunbin K., Popadin K.', title: 'A mitochondria-specific mutational signature of aging: increased rate of A>G substitutions on a heavy strand', journal: 'Nucleic Acids Research, 2022', doi: '10.1093/nar/gkac779' },
  { authors: 'Kirillova A., Mazunin I.', title: 'Operation “mitochondrial wipeout” — clearing recipient mitochondria DNA during nuclear transfer', journal: 'Journal of Assisted Reproduction and Genetics, 2022', doi: '10.1007/s10815-022-02561-6' },
  { authors: 'Kirillova A., Smitz J.E.J., Sukhikh G., Mazunin I.', title: 'The role of mitochondria in oocyte maturation', journal: 'Cells, 2021', doi: '10.3390/cells10092484' },
]

const TEXT = {
  ru: {
    lead: 'Генетик, доктор биологических наук. Около двадцати лет изучает митохондриальную ДНК человека: её разнообразие, мутации, гетероплазмию и подходы к предотвращению передачи митохондриальных заболеваний.',
    bio: [
      'Илья Мазунин создал PGT-mt Atlas как самостоятельный международный ресурс, который собирает опубликованные индивидуальные значения гетероплазмии мтДНК при преимплантационном генетическом тестировании и показывает происхождение каждого значения. Он единолично отвечает за концепцию, курирование данных и развитие платформы.',
      'Генетика митохондриальной ДНК, гетероплазмия и её наследование, редактирование митохондриального генома (CRISPR-Cas12a, программируемые Argonaute-нуклеазы), преимплантационное генетическое тестирование (ПГТ-мт, ПГТ-А) и хромосомная изменчивость эмбрионов человека.',
    ],
    positions: [
      'Заведующий кафедрой биологии и генетики, Медицинский университет Петровского, Москва (с 2024)',
      'Ведущий научный сотрудник лаборатории экспериментальной генетической терапии наследственных болезней обмена веществ, Медико-генетический научный центр им. акад. Н. П. Бочкова (с 2024)',
      'Старший научный сотрудник Центра био- и медицинских технологий, Сколковский институт науки и технологий (с 2019)',
      'Член правления Междисциплинарной клинической ассоциации репродуктивной медицины (с 2021)',
    ],
    past: [
      'Заведующий генетической лабораторией «Медикал Геномикс», Москва и Тверь (2020–2023)',
      'Заведующий лабораторией молекулярно-генетических технологий, Балтийский федеральный университет им. И. Канта, Калининград (2012–2019)',
      'Институт химической биологии и фундаментальной медицины СО РАН; Институт цитологии и генетики СО РАН, Новосибирск (2006–2011)',
    ],
    education: [
      'Доктор биологических наук, 1.5.7 — генетика; Медико-генетический научный центр, Москва (2025)',
      'Кандидат биологических наук, 03.01.07 — молекулярная генетика; ИХБФМ СО РАН, Новосибирск (2010)',
      'Биолог-генетик; Челябинский государственный университет (2006)',
    ],
    coi: 'Генеральный директор и основатель ООО «МОДИКУМ»; сооснователь ООО «Флоренс Лабс» и CellKinetica SARL (Швейцария). Компании разрабатывают решения для анализа геномных данных эмбрионов в программах ВРТ. Atlas — некоммерческий научный ресурс; данные в нём представлены только по опубликованным источникам.',
    h: { role: 'Роль в проекте', interests: 'Научные интересы', positions: 'Текущие позиции', past: 'Предыдущие позиции', education: 'Образование', pubs: 'Избранные публикации', coi: 'Раскрытие интересов', profiles: 'Профили' },
    photo: 'Фотография: Илья Мазунин',
  },
  en: {
    lead: 'Geneticist, Doctor of Biological Sciences (DSc). For about two decades he has studied human mitochondrial DNA: its diversity, mutations, heteroplasmy and approaches to preventing the transmission of mitochondrial disease.',
    bio: [
      'Ilya Mazunin created PGT-mt Atlas as an independent international resource that brings together published individual mtDNA heteroplasmy values from preimplantation genetic testing and shows the provenance of every value. He is solely responsible for the concept, data curation and development of the platform.',
      'Mitochondrial DNA genetics, heteroplasmy and its inheritance, mitochondrial genome editing (CRISPR-Cas12a, programmable Argonaute nucleases), preimplantation genetic testing (PGT-mt, PGT-A) and chromosomal variation in human embryos.',
    ],
    positions: [
      'Head of the Department of Biology and Genetics, Petrovsky Medical University, Moscow (since 2024)',
      'Leading Research Scientist, Laboratory of Experimental Gene Therapy for Inherited Metabolic Diseases, Research Centre for Medical Genetics named after N. P. Bochkov (since 2024)',
      'Senior Research Scientist, Center for Bio- and Medical Technologies, Skolkovo Institute of Science and Technology (since 2019)',
      'Board Member, Interdisciplinary Clinical Association for Reproductive Medicine (since 2021)',
    ],
    past: [
      'Head of Genetic Laboratory, Medical Genomics, Moscow and Tver (2020–2023)',
      'Head of the Molecular Genetics Laboratory, Immanuel Kant Baltic Federal University, Kaliningrad (2012–2019)',
      'Institute of Chemical Biology and Fundamental Medicine SB RAS; Institute of Cytology and Genetics SB RAS, Novosibirsk (2006–2011)',
    ],
    education: [
      'Doctor of Biological Sciences (DSc), Genetics; Research Centre for Medical Genetics, Moscow (2025)',
      'Candidate of Biological Sciences (PhD), Molecular Genetics; ICBFM SB RAS, Novosibirsk (2010)',
      'Degree in Biology, Genetics; Chelyabinsk State University (2006)',
    ],
    coi: 'CEO and founder of MODICUM LLC; co-founder of Florence Labs LLC and CellKinetica SARL (Switzerland). These companies develop genomic data analysis for embryos in assisted reproduction. The Atlas is a non-commercial scientific resource; it presents data from published sources only.',
    h: { role: 'Role in the project', interests: 'Research interests', positions: 'Current positions', past: 'Previous positions', education: 'Education', pubs: 'Selected publications', coi: 'Disclosure of interests', profiles: 'Profiles' },
    photo: 'Photo: Ilya Mazunin',
  },
}

export default function Curator() {
  const t = useT()
  const lang = useLang()
  const x = TEXT[lang]
  const base = import.meta.env.BASE_URL
  return (
    <article className="curator">
      <header className="curator-hero">
        <img className="portrait" src={`${base}img/ilya-mazunin.jpg`} alt={x.photo} width={720} height={960} loading="eager" />
        <div>
          <p className="eyebrow">{t('curator.role')}</p>
          <h1>{t('curator.title')}</h1>
          <p className="lead">{x.lead}</p>
          <p className="small">
            {x.h.profiles}:{' '}
            <a href="https://www.researchgate.net/lab/Ilia-Mazunin-Lab" target="_blank" rel="noreferrer">ResearchGate</a> ·{' '}
            <a href="https://www.linkedin.com/in/ilya-mazunin-ph-d-910875258/" target="_blank" rel="noreferrer">LinkedIn</a>
          </p>
        </div>
      </header>
      <div className="prose">
        <h2>{x.h.role}</h2>
        <p>{x.bio[0]}</p>
        <h2>{x.h.interests}</h2>
        <p>{x.bio[1]}</p>
        <h2>{x.h.positions}</h2>
        <ul>{x.positions.map((s) => <li key={s}>{s}</li>)}</ul>
        <h2>{x.h.past}</h2>
        <ul>{x.past.map((s) => <li key={s}>{s}</li>)}</ul>
        <h2>{x.h.education}</h2>
        <ul>{x.education.map((s) => <li key={s}>{s}</li>)}</ul>
        <h2>{x.h.pubs}</h2>
        <ol className="pub-list">
          {SELECTED.map((p) => (
            <li key={p.title}>
              {p.authors} <strong>{p.title}</strong>. <em>{p.journal}</em>.{' '}
              {p.doi && <a href={doiUrl(p.doi)} target="_blank" rel="noreferrer">doi:{p.doi}</a>}
            </li>
          ))}
        </ol>
        <h2>{x.h.coi}</h2>
        <p className="small">{x.coi}</p>
      </div>
    </article>
  )
}
