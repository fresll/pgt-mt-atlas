import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui'
import { useLang, useT } from '../../i18n'

// ЧЕРНОВИК пациентского раздела. Публикация — только после проверки медицинским генетиком (вопрос В8).
// Тексты опираются на данные атласа и первичные публикации и не содержат утверждений сверх них.
type PatientSection = {
  title: string
  paragraphs: string[]
  items?: string[]
  closingTitle?: string
  closing?: string
}
type PatientText = {
  intro: string
  sections: PatientSection[]
  questions: {
    title: string
    intro: string
    groups: { title: string; items: string[] }[]
    closing: string
  }
}

const TEXT: Record<'ru' | 'en', PatientText> = {
  ru: {
    intro: 'В настоящем разделе рассмотрим, что такое преимплантационное тестирование патогенных вариантов митохондриальной ДНК (ПГТ-мт), когда оно может помочь, а когда нет. И сразу отметим, что текст далее ни в коем случае не заменяет консультацию врача-генетика, но лишь призван сориентировать в терминах и протоколах.',
    sections: [
      {
        title: 'Что такое митохондриальная ДНК',
        paragraphs: [
          'Митохондрии — «энергетические станции» клеток. У них есть собственная небольшая ДНК (мтДНК), которая передаётся ребёнку только от матери.',
          'В каждой клетке сотни и тысячи копий мтДНК. Часть молекул мтДНК может мутировать по разным причинам. Наличие патогенной мутации может привести к заболеванию. Долю изменённых копий называют уровнем гетероплазмии и выражают в процентах.',
          'Проявится ли болезнь, зависит от того, сколько мутантных копий мтДНК попало в какие ткани организма. У одной и той же женщины этот процент может отличаться в крови, моче, мышцах — и в разных яйцеклетках.',
        ],
      },
      {
        title: 'Как работает ПГТ-мт',
        paragraphs: [
          'Во время программы ЭКО на 3-й или 5–6-й день развития у эмбриона аккуратно берут клетки на анализ: на 3-й день — обычно один бластомер, на 5–6-й — несколько клеток трофэктодермы. Специалисты исследуют в них уровень мутантной мтДНК.',
          'Эмбрионы одной женщины могут заметно отличаться друг от друга по этому показателю. Анализ ПГТ-мт помогает эмбриологам и репродуктологам выбрать для переноса эмбрион с наименьшей долей изменённой мтДНК.',
          'К сожалению, точно спрогнозировать результат до начала цикла невозможно. У каких-то пациенток эмбрионов с низким процентом мутантной мтДНК будет больше, у каких-то — меньше, а в некоторых циклах таких эмбрионов может не оказаться вовсе.',
        ],
      },
      {
        title: 'Почему процент — это не диагноз?',
        paragraphs: [
          'Результат ПГТ-мт нужен для того, чтобы сравнить эмбрионы между собой и выбрать эмбрион с наименьшей мутационной нагрузкой на перенос в полость матки, а не для постановки диагноза будущему ребёнку.',
          'Анализ показывает уровень мутантной мтДНК только в нескольких клетках и только в конкретный момент времени. Но развитие малыша — это сложный процесс, и для его здоровья важно, как этот показатель распределится по всем тканям и органам в будущем.',
          'В медицине не существует универсального «безопасного» процента. Пороги, о которых можно прочесть в научных статьях (например, 18% или 30%), исследователи использовали для решения отдельных научных задач — они не являются строгой нормой для конкретного эмбриона.',
        ],
      },
      {
        title: 'ПГТ-мт и проверка хромосом (ПГТ-А)',
        paragraphs: [
          'Для успешной беременности и рождения здорового малыша важен не только низкий процент мутантной мтДНК, но и правильное количество хромосом у эмбриона. Поэтому тестирование ПГТ-мт обычно проводят вместе с ПГТ-А (проверкой на нарушение числа хромосом).',
          'С возрастом доля эмбрионов с правильным (эуплоидным) набором хромосом снижается.',
          'Именно это часто становится основным ограничением в цикле ЭКО. Чтобы не упустить главное, врачи оценивают качество эмбриона комплексно.',
        ],
      },
      {
        title: 'Риск снижается, но не исчезает',
        paragraphs: [
          'По опубликованным данным, ПГТ-мт снижает риск передачи болезни, но не устраняет его полностью.',
          'Если для переноса выбран эмбрион, у которого всё же обнаружена мутантная мтДНК, это не повод для паники. Однако такая ситуация требует особого внимания со стороны специалистов.',
          'Совместно с лечащим врачом стоит заранее обсудить план наблюдения во время беременности и целесообразность дополнительных обследований (пренатальной диагностики).',
          'Также врач поможет составить индивидуальный план наблюдения за здоровьем и развитием малыша после его появления на свет.',
        ],
      },
      {
        title: 'Какие ещё есть варианты?',
        paragraphs: ['ПГТ-мт — это лишь один из возможных путей. В современной медицине также рассматриваются и другие решения:'],
        items: [
          'Пренатальная диагностика — обследование во время наступившей беременности.',
          'Донорские ооциты (яйцеклетки) — использование яйцеклеток здорового донора.',
          'Митохондриальная донация — технология переноса ядерного материала пациентки в донорский ооцит или зиготу с непатогенной мтДНК. Доступность технологии зависит от законодательства страны.',
        ],
        closingTitle: 'Как сделать выбор?',
        closing: 'Единого решения для всех не существует. Оптимальный шаг зависит от конкретного варианта мтДНК, семейной истории, технических возможностей и доступности методик. Окончательное решение всегда принимается индивидуально — в доверительном диалоге с вашим репродуктологом и генетиком.',
      },
    ],
    questions: {
      title: 'Что стоит спросить у врача-генетика?',
      intro: 'Идти на консультацию с готовым списком вопросов — это отличный способ чувствовать себя увереннее и не упустить важные детали. Вот примерные вопросы, которые вы можете задать специалисту:',
      groups: [
        {
          title: 'О вашей ситуации',
          items: [
            '«Какой именно патогенный вариант мтДНК у меня выявлен и что современной медицине известно об этом?»',
            '«Какой процент мутантной мтДНК в моих собственных тканях (например, в крови или эпителии) и как это влияет на вероятность передачи в яйцеклетки?»',
          ],
        },
        {
          title: 'О процессе ПГТ и выборе эмбриона',
          items: [
            '«Какую пороговую границу процента мтДНК вы рекомендуете использовать для выбора эмбриона в моём случае и почему?»',
            '«Будет ли исследование ПГТ-мт проводиться одновременно с ПГТ-А (проверкой на хромосомные нарушения)?»',
          ],
        },
        {
          title: 'О планировании и рисках',
          items: ['«Каковы наши действия и альтернативные варианты, если в данном цикле не окажется эмбриона с низким процентом мутантной мтДНК?»'],
        },
        {
          title: 'О ведении беременности и малыше',
          items: ['«Какое специальное наблюдение или пренатальная диагностика понадобятся во время беременности и как мы будем отслеживать здоровье ребёнка после его рождения?»'],
        },
      ],
      closing: 'Вы можете сохранить или распечатать этот список, чтобы взять его с собой на приём и делать пометки прямо во время беседы с доктором.',
    },
  },
  en: {
    intro: 'This section explains what preimplantation testing for pathogenic mitochondrial DNA variants (PGT-mt) is, when it can help and when it cannot. The text does not replace a consultation with a clinical geneticist; its purpose is to help you understand the terminology and procedures.',
    sections: [
      {
        title: 'What mitochondrial DNA is',
        paragraphs: [
          'Mitochondria are the “power stations” of cells. They have their own small DNA (mtDNA), which a child inherits only from the mother.',
          'Each cell holds hundreds to thousands of copies of mtDNA. Some mtDNA molecules can mutate for different reasons. A pathogenic mutation may lead to disease. The share of changed copies is called the heteroplasmy level and is given as a percentage.',
          'Whether disease appears depends on how many mutant mtDNA copies reach which body tissues. In the same woman this percentage can differ between blood, urine, muscle — and between egg cells.',
        ],
      },
      {
        title: 'How PGT-mt works',
        paragraphs: [
          'During IVF, cells are carefully taken from an embryo for testing on day 3 or day 5–6 of development: usually one blastomere on day 3, or several trophectoderm cells on day 5–6. Specialists measure the level of mutant mtDNA.',
          'Embryos of the same woman can differ noticeably in this measure. PGT-mt helps embryologists and fertility specialists choose an embryo with the lowest proportion of changed mtDNA for transfer.',
          'Unfortunately, the exact outcome cannot be predicted before a cycle begins. Some patients will have more embryos with a low mutant mtDNA percentage, others fewer, and in some cycles there may be none.',
        ],
      },
      {
        title: 'Why is the percentage not a diagnosis?',
        paragraphs: [
          'The PGT-mt result is used to compare embryos and choose one with the lowest mutant load for transfer into the uterus, rather than to diagnose the future child.',
          'The test shows the mutant mtDNA level in only a few cells at one particular moment. A baby’s development is a complex process, and future health depends on how this measure is distributed across tissues and organs.',
          'There is no universal “safe” percentage in medicine. Thresholds mentioned in scientific papers (for example, 18% or 30%) were used to address specific research questions; they are not a strict norm for an individual embryo.',
        ],
      },
      {
        title: 'PGT-mt and chromosome testing (PGT-A)',
        paragraphs: [
          'A successful pregnancy and the birth of a healthy baby depend on more than a low mutant mtDNA percentage: the embryo’s chromosome number matters too. PGT-mt is therefore usually performed together with PGT-A (testing for abnormal chromosome numbers).',
          'With age, the share of embryos with a normal (euploid) chromosome complement decreases.',
          'This often becomes the main constraint in an IVF cycle. Doctors assess embryo quality as a whole so that important factors are taken into account.',
        ],
      },
      {
        title: 'The risk is reduced, not removed',
        paragraphs: [
          'According to published data, PGT-mt reduces the risk of passing on the disease but does not remove it completely.',
          'If an embryo chosen for transfer still has detectable mutant mtDNA, this is not a reason to panic. It does, however, call for particular attention from specialists.',
          'Discuss a pregnancy follow-up plan and whether additional investigations (prenatal diagnosis) are appropriate with your doctor in advance.',
          'Your doctor can also help prepare an individual plan for monitoring your baby’s health and development after birth.',
        ],
      },
      {
        title: 'What other options are there?',
        paragraphs: ['PGT-mt is only one possible route. Modern medicine also considers other options:'],
        items: [
          'Prenatal diagnosis — testing during an established pregnancy.',
          'Donor oocytes (egg cells) — using eggs from a healthy donor.',
          'Mitochondrial donation — transfer of the patient’s nuclear material into a donor oocyte or zygote with non-pathogenic mtDNA. Availability depends on the country’s legislation.',
        ],
        closingTitle: 'How do you choose?',
        closing: 'There is no single solution for everyone. The best next step depends on the specific mtDNA variant, family history, technical possibilities and availability of methods. The final decision is always individual, made in an open discussion with your fertility specialist and geneticist.',
      },
    ],
    questions: {
      title: 'What should you ask your clinical geneticist?',
      intro: 'Bringing a list of questions can help you feel more confident and remember important details. Here are some questions you could ask:',
      groups: [
        {
          title: 'About your situation',
          items: [
            '“Which pathogenic mtDNA variant has been identified in me, and what does modern medicine know about it?”',
            '“What percentage of mutant mtDNA is in my own tissues (for example, blood or epithelial cells), and how does this affect the chance of transmission to egg cells?”',
          ],
        },
        {
          title: 'About PGT and embryo selection',
          items: [
            '“Which mtDNA percentage threshold do you recommend for embryo selection in my case, and why?”',
            '“Will PGT-mt be performed at the same time as PGT-A (testing for chromosome abnormalities)?”',
          ],
        },
        {
          title: 'About planning and risks',
          items: ['“What are our next steps and alternatives if this cycle produces no embryo with a low mutant mtDNA percentage?”'],
        },
        {
          title: 'About pregnancy and your baby',
          items: ['“What special follow-up or prenatal diagnosis will be needed during pregnancy, and how will we monitor the child’s health after birth?”'],
        },
      ],
      closing: 'You can save or print this list, bring it to your appointment and add notes during the discussion with your doctor.',
    },
  },
}

export default function Patients() {
  const t = useT()
  const lang = useLang()
  const c = TEXT[lang]
  return (
    <article className="prose">
      <p><Badge kind="warn">{t('badge.draft')}</Badge></p>
      <h1>{t('patients.title')}</h1>
      <p className="lead">{c.intro}</p>
      {c.sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          {section.paragraphs.map((p) => <p key={p}>{p}</p>)}
          {section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
          {section.closingTitle && <h3>{section.closingTitle}</h3>}
          {section.closing && <p>{section.closing}</p>}
        </section>
      ))}
      <section>
        <h2>{c.questions.title}</h2>
        <p>{c.questions.intro}</p>
        {c.questions.groups.map((group) => (
          <div key={group.title}>
            <h3>{group.title}</h3>
            <ul>{group.items.map((question) => <li key={question}>{question}</li>)}</ul>
          </div>
        ))}
        <p>{c.questions.closing}</p>
      </section>
      <div className="callout">
        {lang === 'ru' ? 'Информация не заменяет консультацию врача-генетика. ' : 'This information does not replace a consultation with a clinical geneticist. '}
        <Link to={`/${lang}/science/`}>{lang === 'ru' ? 'Подробнее для специалистов →' : 'More for specialists →'}</Link>
      </div>
    </article>
  )
}
