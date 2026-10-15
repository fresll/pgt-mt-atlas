import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui'
import { HandRule } from '../../components/Sketch'
import { FUNDAMENTALS } from '../../content/fundamentals'
import { useLang, useT } from '../../i18n'
import { Inline } from '../../content/fundamentals/markup'
import { Widget } from '../../components/fundamentals/Widgets'
import { PageTitle } from '../../components/Layout'

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
  glossary: { title: string; items: [string, string][] }
  intro: string
  sections: PatientSection[]
  questions: {
    title: string
    intro: string
    groups: { title: string; items: string[] }[]
    closing: string
  }
}

export default function Patients() {
  const t = useT()
  const lang = useLang()
  const c = t('patientContent', { returnObjects: true }) as unknown as PatientText
  const fd = `/${lang}/fundamentals/`
  const chapters = FUNDAMENTALS[lang].chapters
  const ids = c.sections.map((_, i) => `p-${i + 1}`)
  return (
    <article className="pt-page">
      <PageTitle title={t('patients.title')} />
      <header className="fd-head">
        <p className="sk-kicker"><Badge kind="warn">{t('badge.draft')}</Badge></p>
        <h1>{t('patients.title')}</h1>
        <HandRule className="sk-title-rule" />
        <p className="fd-lead">{c.intro}</p>
      </header>
      <nav className="pt-toc" aria-label={t('patients.tocLabel')}>
        <ol>
          {c.sections.map((section, i) => (
            <li key={section.title}><a href={`#${ids[i]}`}>{section.title}</a></li>
          ))}
          <li><a href="#p-glossary">{c.glossary.title}</a></li>
          <li><a href="#p-questions">{c.questions.title}</a></li>
        </ol>
      </nav>
      <div className="fd-text">
        {c.sections.map((section, i) => (
          <section key={section.title} id={ids[i]}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((p) => <p key={p}><Inline s={p} lang={lang} /></p>)}
            {section.items && <ul>{section.items.map((item) => <li key={item}><Inline s={item} lang={lang} /></li>)}</ul>}
            {section.closingTitle && <h3>{section.closingTitle}</h3>}
            {section.closing && <p>{section.closing}</p>}
          </section>
        ))}
        <Widget id="heteroplasmy" />
        <Widget id="blastocyst" showReferences={false} />
        <section id="p-glossary">
          <h2>{c.glossary.title}</h2>
          <dl>{c.glossary.items.map(([term, definition]) => <div key={term}><dt><strong>{term}</strong></dt><dd>{definition}</dd></div>)}</dl>
        </section>
        <section id="p-questions" className="pt-questions">
          <h2>{c.questions.title}</h2>
          <p>{c.questions.intro}</p>
          {c.questions.groups.map((group) => (
            <div key={group.title}>
              <h3>{group.title}</h3>
              <ul>{group.items.map((question) => <li key={question}>{question}</li>)}</ul>
            </div>
          ))}
          <p>{c.questions.closing}</p>
          <p className="no-print">
            <button className="sk-btn" type="button" onClick={() => window.print()}>{t('patients.print')}</button>
          </p>
        </section>
        <aside className="fd-key no-print">
          {t('patients.more')}{' '}
          {[0, 2, 5].map((i, k) => (
            <span key={chapters[i].slug}>
              {k > 0 ? ' · ' : ''}
              <Link to={`${fd}${chapters[i].slug}/`}>{t('fundamentals.chapter', { n: i + 1 })}. {chapters[i].title}</Link>
            </span>
          ))}
        </aside>
      </div>
    </article>
  )
}
