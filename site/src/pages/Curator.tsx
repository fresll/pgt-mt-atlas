import type { ReactNode } from 'react'
import { doiUrl } from '../data/atlas'
import { creator, topicLabel, type Item, type Pub } from '../data/creator'
import { useLang, useT } from '../i18n'

// Персональная страница создателя и куратора (Scientific Sketchbook). Содержание — src/data/creator.ts (по CV 2026).

function Timeline({ items }: { items: Item[] }) {
  const lang = useLang()
  return (
    <ol className="cv-timeline">
      {items.map((it) => (
        <li key={it.text.en}>
          <span className="cv-years">{it.years}</span>
          <span>{it.text[lang]}</span>
        </li>
      ))}
    </ol>
  )
}

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

export default function Curator() {
  const t = useT()
  const lang = useLang()
  const other = lang === 'ru' ? 'en' : 'ru'
  const c = creator
  const base = import.meta.env.BASE_URL
  const pending = <span className="muted">{t('curator.pending')}</span>
  const toc: [string, string][] = [
    ['bio', t('curator.bio')],
    ['research', t('curator.research')],
    ['career', t('curator.career')],
    ['education', t('curator.education')],
    ['projects', t('curator.projects')],
    ['publications', t('curator.pubs')],
    ['profiles', t('curator.profiles')],
  ]
  return (
    <article className="sk-curator-page">
      <header className="curator-hero">
        <img className="portrait" src={`${base}${c.photo.src}`} alt={t('curator.photoAlt')} width={c.photo.w} height={c.photo.h} loading="eager" />
        <div>
          <p className="sk-kicker">{t('curator.role')}</p>
          <h1>{t('curator.title')}</h1>
          <p className="cv-degree">{c.degree[lang]}</p>
          <ul className="cv-headline">
            {c.headline.map((h) => (
              <li key={h.en}>{h[lang]}</li>
            ))}
          </ul>
          <p className="sk-lead">{c.lead[lang]}</p>
          <p className="small">
            {t('curator.profilesLabel')}:{' '}
            {c.profiles
              .filter((p) => p.url)
              .map((p, i) => (
                <span key={p.key}>
                  {i > 0 && ' · '}
                  <a className="sk-link" href={p.url!} target="_blank" rel="noreferrer">{p.label}</a>
                </span>
              ))}
          </p>
          <nav className="cv-toc" aria-label={t('curator.contents')}>
            {toc.map(([id, label]) => (
              <a key={id} className="sk-link" href={`#${id}`}>{label}</a>
            ))}
          </nav>
        </div>
      </header>

      <Section id="bio" title={t('curator.bio')} note={t('curator.bioNote')}>
        <div className="cv-prose">
          {c.bio[lang].map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
          <h3>{t('curator.projectRole')}</h3>
          <p>{c.role[lang]}</p>
          <details className="small">
            <summary>{t('curator.bioOther')}</summary>
            <div lang={other}>
              {c.bio[other].map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </details>
        </div>
      </Section>

      <Section id="research" title={t('curator.research')} note={t('curator.researchNote')}>
        <ol className="sk-index cv-research">
          {c.research.map((r, i) => (
            <li key={r.en}>
              <span className="sk-no">{String(i + 1).padStart(2, '0')}</span>
              <p>{r[lang]}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="career" title={t('curator.career')} note={t('curator.careerNote')}>
        <h3>{t('curator.current')}</h3>
        <Timeline items={c.current} />
        <h3>{t('curator.past')}</h3>
        <Timeline items={c.past} />
      </Section>

      <Section id="education" title={t('curator.education')} note={t('curator.educationNote')}>
        <Timeline items={c.education} />
        <h3>{t('curator.teaching')}</h3>
        <Timeline items={c.teaching} />
      </Section>

      <Section id="projects" title={t('curator.projects')} note={t('curator.projectsNote')}>
        <h3>{t('curator.professional')}</h3>
        <Timeline items={c.professional} />
        <h3>{t('curator.ventures')}</h3>
        <Timeline items={c.ventures} />
      </Section>

      <Section id="publications" title={t('curator.pubs')} note={t('curator.pubsNote')}>
        <p className="cv-muted small">{t('curator.pubsCount', c.cvCounts)}</p>
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
                    {p.doi && (
                      <a href={doiUrl(p.doi)} target="_blank" rel="noreferrer">doi:{p.doi}</a>
                    )}
                  </li>
                ))}
            </ol>
          </div>
        ))}
      </Section>

      <Section id="profiles" title={t('curator.profiles')} note={t('curator.profilesNote')}>
        <div className="cv-two">
          <div>
            <h3>{t('curator.researchProfiles')}</h3>
            <ul className="cv-kv">
              {c.profiles.map((p) => (
                <li key={p.key}>
                  <span className="cv-k">{p.label}</span>
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noreferrer">{p.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</a>
                  ) : (
                    pending
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{t('curator.contact')}</h3>
            <ul className="cv-kv">
              <li>
                <span className="cv-k">{t('curator.collaboration')}</span>
                {c.contacts.collaboration ? <a href={contactHref(c.contacts.collaboration)}>{c.contacts.collaboration}</a> : pending}
              </li>
              <li>
                <span className="cv-k">{t('curator.patients')}</span>
                {c.contacts.patients ? <a href={contactHref(c.contacts.patients)}>{c.contacts.patients}</a> : pending}
              </li>
            </ul>
            <p className="small cv-muted">{t('curator.noAdvice')}</p>
          </div>
        </div>
      </Section>

      <Section id="coi" title={t('curator.coi')} note={t('curator.coiNote')}>
        <p className="cv-prose">{c.coi[lang]}</p>
      </Section>
    </article>
  )
}

function contactHref(v: string): string {
  return v.includes('@') && !v.startsWith('http') ? `mailto:${v}` : v
}
