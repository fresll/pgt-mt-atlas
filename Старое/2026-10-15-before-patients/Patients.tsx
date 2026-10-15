import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui'
import { useLang, useT } from '../../i18n'

// ЧЕРНОВИК пациентского раздела. Публикация — только после проверки медицинским генетиком (вопрос В8).
// Тексты опираются на данные атласа и первичные публикации и не содержат утверждений сверх них.
const TEXT = {
  ru: {
    intro: 'Эта страница объясняет простыми словами, что такое преимплантационное генетическое тестирование митохондриальной ДНК (ПГТ-мт), что оно может и чего не может. Она не заменяет консультацию врача-генетика.',
    sections: [
      ['Что такое митохондриальная ДНК', [
        'Митохондрии — «энергетические станции» клеток. У них есть собственная небольшая ДНК (мтДНК), которая передаётся ребёнку только от матери.',
        'В каждой клетке сотни и тысячи копий мтДНК. Иногда часть копий несёт изменение (вариант), способное вызвать болезнь, а часть — нет. Долю изменённых копий называют уровнем гетероплазмии и выражают в процентах.',
        'Проявится ли болезнь, зависит от того, сколько изменённых копий в разных тканях организма. У одной и той же женщины этот процент может отличаться в крови, моче, мышцах — и в разных яйцеклетках.',
      ]],
      ['Что делает ПГТ-мт', [
        'При ЭКО у эмбриона на 3-й или 5–6-й день берут несколько клеток и измеряют в них процент изменённой мтДНК.',
        'Эмбрионы одной женщины могут сильно различаться по этому проценту. ПГТ-мт позволяет выбрать для переноса эмбрион с наименьшей долей изменённой мтДНК.',
        'Заранее нельзя предсказать, сколько эмбрионов в цикле окажется с низким процентом; в части циклов таких эмбрионов не бывает вовсе.',
      ]],
      ['Почему процент — не диагноз', [
        'Результат ПГТ-мт — это способ сравнить эмбрионы между собой, а не заключение о здоровье будущего ребёнка.',
        'Измерение сделано в нескольких клетках одного эмбриона в один момент времени, а для здоровья важно, сколько изменённой мтДНК будет во всех тканях на протяжении жизни.',
        'Универсального «безопасного» процента не существует. Числа, которые встречаются в литературе (например, 18% или 30%), получены для разных задач и не являются нормой для отдельного эмбриона.',
      ]],
      ['ПГТ-мт и проверка хромосом (ПГТ-А)', [
        'Для переноса важно не только низкое содержание изменённой мтДНК, но и правильный набор хромосом. Поэтому ПГТ-мт обычно выполняют вместе с ПГТ-А — проверкой на хромосомные нарушения.',
        'С возрастом доля эмбрионов с правильным набором хромосом снижается, и это может стать главным ограничением цикла.',
      ]],
      ['Риск снижается, но не исчезает', [
        'По опубликованным данным, ПГТ-мт снижает риск передачи болезни, но не устраняет его полностью.',
        'Если перенесён эмбрион с выявляемым уровнем изменённой мтДНК, стоит обсудить с врачом пренатальную диагностику и наблюдение ребёнка после рождения.',
      ]],
      ['Какие бывают варианты', [
        'ПГТ-мт — один из путей. В обзорах также обсуждаются пренатальная диагностика, донорские яйцеклетки и митохондриальная донация. Выбор зависит от варианта мтДНК, семейной истории, возможностей и доступности технологий — его делают вместе с врачом.',
      ]],
      ['Что можно спросить у врача-генетика', [
        'Какой у меня вариант мтДНК и что о нём известно?',
        'Какой процент изменённой мтДНК в моих тканях и что это значит для яйцеклеток?',
        'Какую границу для выбора эмбриона вы предлагаете в моём случае и почему?',
        'Будет ли вместе с ПГТ-мт проводиться ПГТ-А?',
        'Что делать, если в цикле не окажется подходящего эмбриона?',
        'Какое наблюдение понадобится во время беременности и после рождения?',
      ]],
    ] as [string, string[]][],
  },
  en: {
    intro: 'This page explains in plain words what preimplantation genetic testing for mitochondrial DNA (PGT-mt) is, what it can and cannot do. It does not replace a consultation with a clinical geneticist.',
    sections: [
      ['What mitochondrial DNA is', [
        'Mitochondria are the “power stations” of cells. They have their own small DNA (mtDNA), which a child inherits only from the mother.',
        'Each cell holds hundreds to thousands of copies of mtDNA. Sometimes some copies carry a change (variant) that can cause disease and others do not. The share of changed copies is called the heteroplasmy level and is given as a percentage.',
        'Whether disease appears depends on how many changed copies there are in different body tissues. In the same woman this percentage can differ between blood, urine, muscle — and between egg cells.',
      ]],
      ['What PGT-mt does', [
        'During IVF, a few cells are taken from the embryo on day 3 or day 5–6, and the percentage of changed mtDNA is measured in them.',
        'Embryos of the same woman can differ a lot in this percentage. PGT-mt makes it possible to choose for transfer the embryo with the lowest share of changed mtDNA.',
        'It cannot be predicted in advance how many embryos in a cycle will have a low percentage; in some cycles there are none.',
      ]],
      ['Why the percentage is not a diagnosis', [
        'The PGT-mt result is a way to compare embryos with each other, not a statement about the future child’s health.',
        'The measurement is made in a few cells of one embryo at one moment, whereas health depends on how much changed mtDNA there will be in all tissues over a lifetime.',
        'There is no universal “safe” percentage. Numbers seen in the literature (for example 18% or 30%) were derived for different purposes and are not a norm for an individual embryo.',
      ]],
      ['PGT-mt and chromosome testing (PGT-A)', [
        'For transfer, not only low changed mtDNA matters but also a normal set of chromosomes. That is why PGT-mt is usually done together with PGT-A — testing for chromosome abnormalities.',
        'With age, the share of embryos with a normal chromosome set falls, and this can become the main limit of a cycle.',
      ]],
      ['The risk is reduced, not removed', [
        'According to published data, PGT-mt reduces the risk of passing on the disease but does not remove it completely.',
        'If an embryo with a detectable level of changed mtDNA was transferred, it is worth discussing prenatal diagnosis and follow-up of the child after birth with the doctor.',
      ]],
      ['What options exist', [
        'PGT-mt is one route. Reviews also discuss prenatal diagnosis, donor eggs and mitochondrial donation. The choice depends on the mtDNA variant, family history, personal circumstances and availability — it is made together with the doctor.',
      ]],
      ['What to ask your clinical geneticist', [
        'Which mtDNA variant do I have and what is known about it?',
        'What percentage of changed mtDNA is in my tissues and what does it mean for my eggs?',
        'Which cut-off for choosing an embryo do you suggest in my case, and why?',
        'Will PGT-A be done together with PGT-mt?',
        'What happens if no suitable embryo is found in a cycle?',
        'What follow-up will be needed during pregnancy and after birth?',
      ]],
    ] as [string, string[]][],
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
      {c.sections.map(([h, ps], i) => (
        <section key={h}>
          <h2>{h}</h2>
          {i === c.sections.length - 1 ? <ul>{ps.map((p) => <li key={p}>{p}</li>)}</ul> : ps.map((p) => <p key={p}>{p}</p>)}
        </section>
      ))}
      <div className="callout">
        {lang === 'ru' ? 'Информация не заменяет консультацию врача-генетика. ' : 'This information does not replace a consultation with a clinical geneticist. '}
        <Link to={`/${lang}/science/`}>{lang === 'ru' ? 'Подробнее для специалистов →' : 'More for specialists →'}</Link>
      </div>
    </article>
  )
}
