import { Doi, Photo } from '../components/ui'
import { creator, topicLabel, type Item, type Pub } from '../data/creator'
import { useLang } from '../i18n'

function Timeline({ items }: { items: Item[] }) {
  const lang = useLang()
  return (
    <ol className="timeline">
      {items.map((it) => (
        <li key={it.text.en}>
          <span className="tl-years">{it.years}</span>
          <span>{it.text[lang]}</span>
        </li>
      ))}
    </ol>
  )
}

export default function Creator() {
  const lang = useLang()
  const ru = lang === 'ru'
  const c = creator
  const topics = Object.keys(topicLabel) as Pub['topic'][]
  const pending = ru ? 'будет добавлено' : 'to be added'
  return (
    <article className="creator">
      <header className="creator-head">
        <Photo className="creator-photo-lg" {...c.photo} alt={c.name[lang]} eager />
        <div>
          <p className="eyebrow">{ru ? 'Создатель и научный куратор PGT-mt Atlas' : 'Creator and curator of PGT-mt Atlas'}</p>
          <h1>{c.name[lang]}</h1>
          <p className="hero-sub">{c.degree[lang]}</p>
          <ul className="plain">
            {c.headline.map((h) => (
              <li key={h.en}>{h[lang]}</li>
            ))}
          </ul>
          <nav className="toc small" aria-label={ru ? 'Содержание' : 'Contents'}>
            <a href="#bio">{ru ? 'Биография' : 'Biography'}</a>
            <a href="#research">{ru ? 'Исследования' : 'Research'}</a>
            <a href="#career">{ru ? 'Карьера' : 'Career'}</a>
            <a href="#publications">{ru ? 'Публикации' : 'Publications'}</a>
            <a href="#profiles">{ru ? 'Профили и контакты' : 'Profiles & contact'}</a>
          </nav>
        </div>
      </header>

      <section id="bio" className="prose">
        <h2>{ru ? 'Научная биография' : 'Scientific biography'}</h2>
        {c.bio[lang].map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
        <details className="small">
          <summary>{ru ? 'Biography in English' : 'Биография на русском языке'}</summary>
          <div lang={ru ? 'en' : 'ru'}>
            {c.bio[ru ? 'en' : 'ru'].map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </details>
      </section>

      <section id="research">
        <h2>{ru ? 'Основные направления исследований' : 'Research interests'}</h2>
        <ul className="research-list">
          {c.research.map((r) => (
            <li key={r.en}>{r[lang]}</li>
          ))}
        </ul>
      </section>

      <section id="career" className="career-grid">
        <div>
          <h2>{ru ? 'Текущие позиции' : 'Current appointments'}</h2>
          <Timeline items={c.current} />
          <h2>{ru ? 'Образование и учёные степени' : 'Education and degrees'}</h2>
          <Timeline items={c.education} />
          <h2>{ru ? 'Учебные пособия' : 'Textbooks'}</h2>
          <Timeline items={c.teaching} />
        </div>
        <div>
          <h2>{ru ? 'Предыдущие позиции' : 'Previous appointments'}</h2>
          <Timeline items={c.past} />
          <h2>{ru ? 'Предпринимательская деятельность' : 'Entrepreneurial activities'}</h2>
          <Timeline items={c.ventures} />
        </div>
      </section>

      <section id="publications">
        <h2>{ru ? 'Избранные публикации' : 'Selected publications'}</h2>
        <p className="muted small">
          {ru
            ? `Избранное из ${c.cvCounts.original} оригинальных исследований и ${c.cvCounts.reviews} обзоров, перечисленных в CV; также ${c.cvCounts.patents} патентов и свидетельств.`
            : `A selection from the ${c.cvCounts.original} original research articles and ${c.cvCounts.reviews} reviews listed in the CV; also ${c.cvCounts.patents} patents and software registrations.`}
        </p>
        {topics.map((tp) => (
          <div key={tp}>
            <h3>{topicLabel[tp][lang]}</h3>
            <ol className="pub-list">
              {c.publications
                .filter((p) => p.topic === tp)
                .sort((a, b) => b.year - a.year)
                .map((p) => (
                  <li key={p.title} lang="en">
                    <span className="pub-authors">{p.authors}</span> <span className="pub-title">{p.title}.</span>{' '}
                    <em>{p.journal}</em>, {p.year}. {p.doi && <Doi doi={p.doi} />}
                  </li>
                ))}
            </ol>
          </div>
        ))}
      </section>

      <section id="profiles" className="career-grid">
        <div>
          <h2>{ru ? 'Научные профили' : 'Research profiles'}</h2>
          <ul className="profile-list">
            {c.profiles.map((p) => (
              <li key={p.key}>
                <span className="profile-k">{p.label}</span>
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noreferrer">
                    {p.url.replace(/^https?:\/\//, '')}
                  </a>
                ) : (
                  <span className="muted">{pending}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>{ru ? 'Контакты' : 'Contact'}</h2>
          <ul className="profile-list">
            <li>
              <span className="profile-k">{ru ? 'Научное сотрудничество' : 'Research collaboration'}</span>
              {c.contacts.collaboration ? <a href={contactHref(c.contacts.collaboration)}>{c.contacts.collaboration}</a> : <span className="muted">{pending}</span>}
            </li>
            <li>
              <span className="profile-k">{ru ? 'Обращения пациентов' : 'Patient enquiries'}</span>
              {c.contacts.patients ? <a href={contactHref(c.contacts.patients)}>{c.contacts.patients}</a> : <span className="muted">{pending}</span>}
            </li>
          </ul>
          <p className="small muted">
            {ru
              ? 'Сайт не оказывает медицинских консультаций; вопросы о конкретной ситуации следует обсуждать с лечащим врачом и врачом-генетиком.'
              : 'This site does not provide medical advice; questions about an individual situation should be discussed with a treating physician and a clinical geneticist.'}
          </p>
        </div>
      </section>
    </article>
  )
}

function contactHref(v: string): string {
  return v.includes('@') && !v.startsWith('http') ? `mailto:${v}` : v
}
