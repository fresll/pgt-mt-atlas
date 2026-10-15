import type { ReactNode } from 'react'
import { Photo } from '../components/Photo'
import { doiUrl } from '../data/atlas'
import { creator, topicLabel, type Pub } from '../data/creator'
import { useLang, useT } from '../i18n'
import { PageTitle } from '../components/Layout'

function Section({ id, title, note, children }: { id: string; title: string; note: string; children: ReactNode }) {
  return (
    <section id={id} className="sk-section cv-section">
      <div className="sk-margin">
        <h2>{title}</h2>
        <p className="sk-note">{note}</p>
      </div>
      <div className="cv-body">{children}</div>
    </section>
  )
}

const TOPICS = Object.keys(topicLabel) as Pub['topic'][]
const DEPARTMENT_URL = 'https://petrovsky.med.ru/education/distsipliny-kafedry6715/'

export default function Curator() {
  const t = useT()
  const lang = useLang()
  const c = creator
  return (
    <article className="sk-curator-page">
      <header className="curator-hero">
        <Photo className="portrait" path={c.photo.src} alt={t('curator.photoAlt')} width={c.photo.w} height={c.photo.h} loading="eager" />
        <div>
          <p className="sk-kicker">{t('curator.role')}</p>
          <PageTitle title={t('curator.title')} />
          <h1>{t('curator.title')}</h1>
          <p className="cv-degree">{c.degree[lang]}</p>
          <ul className="cv-headline">
            {c.headline.map((h) => <li key={h.en}>{h[lang]}</li>)}
          </ul>
          <p className="sk-lead">{c.lead[lang]}</p>
          <nav className="cv-toc" aria-label={t('curator.contents')}>
            <a className="sk-link" href="#bio">{t('curator.bio')}</a>
            <a className="sk-link" href="#publications">{t('curator.pubs')}</a>
          </nav>
        </div>
      </header>

      <Section id="bio" title={t('curator.bio')} note={t('curator.bioNote')}>
        <div className="cv-prose">
          {c.bio[lang].map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
          <p>
            {lang === 'ru' ? <>
              Илья Олегович преподаёт в Медицинском университете Петровского, где заведует{' '}
              <a href={DEPARTMENT_URL} target="_blank" rel="noreferrer">кафедрой биологии и генетики</a>.
            </> : <>
              Ilya Mazunin teaches at Petrovsky Medical University, where he heads the{' '}
              <a href={DEPARTMENT_URL} target="_blank" rel="noreferrer">Department of Biology and Genetics</a>.
            </>}
          </p>
          <h3>{t('curator.projectRole')}</h3>
          <p>{c.role[lang]}</p>
        </div>
      </Section>

      <Section id="publications" title={t('curator.pubs')} note={t('curator.pubsNote')}>
        {TOPICS.map((tp) => (
          <div key={tp} className="cv-topic">
            <h3>{topicLabel[tp][lang]}</h3>
            <ol className="pub-list">
              {c.publications
                .filter((p) => p.topic === tp)
                .sort((a, b) => b.year - a.year)
                .map((p) => (
                  <li key={p.title} lang="en">
                    <span className="pub-authors">{p.authors}</span> <strong className="pub-title">{p.title}.</strong>{' '}
                    <em>{p.journal}</em>, {p.year}.{' '}
                    {p.doi && <a href={doiUrl(p.doi)} target="_blank" rel="noreferrer">doi:{p.doi}</a>}
                  </li>
                ))}
            </ol>
          </div>
        ))}
      </Section>
    </article>
  )
}
