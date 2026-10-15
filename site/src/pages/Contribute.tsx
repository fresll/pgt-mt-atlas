import { BackToTop, PageContents } from '../components/PageContents'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { EmailCopy } from '../components/EmailContact'
import { HandRule, Illustration } from '../components/Sketch'
import template from '../data/submissionTemplate.json'
import { useLang, useT } from '../i18n'
import labels from '../illustrations/labels.json'
import { CURATOR_CONTACT, EVIDENCE_TIERS, SUBJECT_PREFIX, SUBMISSION_STATUSES, UNPUBLISHED_CHECKS, mailtoHref } from '../lib/contribute'
import { asset } from '../lib/base'
import { PageTitle } from '../components/Layout'

// Раздел Contribute Data / Поделиться данными. Сайт ничего не принимает и не хранит:
// страница объясняет принципы, даёт шаблон и канал связи с куратором (когда он выбран).
export default function Contribute() {
  const t = useT()
  const lang = useLang()
  const list = (key: string) => t(key, { returnObjects: true }) as unknown as string[]
  const pairs = (key: string) => t(key, { returnObjects: true }) as unknown as [string, string][]
  const href = asset(template.file)
  const fileName = template.file.split('/').pop()
  const meta = t('contribute.templateMeta', { v: template.version, date: template.released })
  const subject = (lang === 'ru' ? '[Атлас ПГТ-мт] ' : SUBJECT_PREFIX) + t('contribute.contact.subject')
  const email = CURATOR_CONTACT.email

  const Download = ({ primary = false }: { primary?: boolean }) => (
    <a className={primary ? 'sk-btn' : 'sk-link'} href={href} download={fileName}>
      {t('contribute.downloadTemplate')} {primary && <span aria-hidden="true">↓</span>}
    </a>
  )

  return (
    <article className="sk-home sk-contribute">
      <section className="sk-hero sk-c-hero">
        <div>
          <p className="sk-kicker">{t('contribute.kicker')}</p>
          <PageTitle title={t('contribute.title')} />
          <h1>{t('contribute.title')}</h1>
          <HandRule className="sk-title-rule" />
          <p className="sk-subtitle">{t('contribute.lead')}</p>
          <PageContents items={[{ id: 'c-why', text: t('contribute.why.title') }, { id: 'c-interest', text: t('contribute.interest.title') }, { id: 'c-how', text: t('contribute.how.title') }, { id: 'c-template', text: t('contribute.template.title') }, { id: 'c-review', text: t('contribute.review.title') }, { id: 'c-credit', text: t('contribute.credit.title') }, { id: 'c-contact', text: t('contribute.contact.title') }]} />
          <div className="sk-actions">
            <Download primary />
            <a className="sk-link" href="#contact">{t('contribute.contactLink')}</a>
          </div>
          <p className="sk-c-meta">{meta}</p>
        </div>
        <blockquote className="sk-motto" lang={lang}>
          <p>{t('contribute.motto')}</p>
          <HandRule className="sk-motto-rule" tone="red" />
        </blockquote>
      </section>

      <section className="sk-section" aria-labelledby="c-why">
        <header className="sk-margin">
          <h2 id="c-why">{t('contribute.why.title')}</h2>
          <p className="sk-note">{t('contribute.why.note')}</p>
        </header>
        <div className="sk-c-text">
          <p className="sk-lead">{t('contribute.why.p1')}</p>
          <p>{t('contribute.why.p2')}</p>
          <p className="sk-c-emph">{t('contribute.why.p3')}</p>
          <h3 id="c-cycles">{t('contribute.cycles.title')}</h3>
          <p>{t('contribute.cycles.lead')}</p>
          <ol className="sk-chain">
            {list('contribute.cycles.steps').map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p className="sk-c-losses-title">{t('contribute.cycles.lossesTitle')}</p>
          <ul className="sk-c-losses">
            {list('contribute.cycles.losses').map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p>{t('contribute.cycles.p')}</p>
        </div>
      </section>

      <section className="sk-section" aria-labelledby="c-interest">
        <header className="sk-margin">
          <h2 id="c-interest">{t('contribute.interest.title')}</h2>
          <p className="sk-note">{t('contribute.interest.note')}</p>
        </header>
        <ul className="sk-c-list">
          {list('contribute.interest.items').map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="sk-section" aria-labelledby="c-how">
        <header className="sk-margin">
          <h2 id="c-how">{t('contribute.how.title')}</h2>
          <p className="sk-note">{t('contribute.how.note')}</p>
        </header>
        <ol className="sk-index sk-c-steps">
          {pairs('contribute.how.steps').map(([title, text], i) => (
            <li key={title}>
              <span className="sk-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="sk-section" aria-labelledby="c-template" id="template">
        <header className="sk-margin">
          <h2 id="c-template">{t('contribute.template.title')}</h2>
          <p className="sk-note">{t('contribute.template.note')}</p>
        </header>
        <div className="sk-c-text">
          <p className="sk-lead">{t('contribute.template.lead')}</p>
          <div className="sk-actions">
            <Download />
            <span className="sk-c-meta">{meta}</span>
          </div>
          <details className="sk-c-details">
          <summary>{t('contribute.template.detailsTitle')}</summary>
          <h3>{t('contribute.template.sheetsTitle')}</h3>
          <table className="sk-c-table">
            <tbody>
              {template.sheets.map((s) => (
                <tr key={s.name}>
                  <th scope="row">
                    <span className="sk-c-sheet">{s.name}</span>
                    {lang === 'ru' && <span className="sk-c-sheet-ru">{s.title_ru}</span>}
                  </th>
                  <td>
                    {lang === 'ru' ? s.purpose_ru : s.purpose_en}
                    <span className="sk-c-count">{t('contribute.template.fields', { n: s.n_fields, r: s.n_required })}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="sk-c-small">{t('contribute.template.extra')}</p>
          <div className="sk-c-two">
            <div>
              <h3>{t('contribute.template.rulesTitle')}</h3>
              <ul className="sk-c-list compact">
                {list('contribute.template.rules').map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>{t('contribute.template.privacyTitle')}</h3>
              <p>{t('contribute.template.privacy')}</p>
            </div>
          </div>
          </details>
        </div>
      </section>

      <section className="sk-section sk-c-review" aria-labelledby="c-review">
        <header className="sk-margin">
          <h2 id="c-review">{t('contribute.review.title')}</h2>
          <p className="sk-note">{t('contribute.review.note')}</p>
        </header>
        <div className="sk-c-text">
          <p className="sk-lead">{t('contribute.review.lead')}</p>
          <figure className="sk-c-figure">
            <div className="sk-plate">
              <Illustration name="dataPathway" />
              {labels.pathway.map((l) => (
                <span
                  key={l.key}
                  className={`sk-label ${l.align} ${l.tone === 'r' ? 'red' : ''}`}
                  style={{ '--x': `${l.x}%`, '--y': `${l.y}%` } as CSSProperties}
                  aria-hidden="true"
                >
                  {t(`contribute.review.labels.${l.key}`)}
                </span>
              ))}
            </div>
            <figcaption>{t('contribute.review.figCaption')}</figcaption>
          </figure>

          <h3>{t('contribute.review.statusTitle')}</h3>
          <ol className="sk-c-status">
            {SUBMISSION_STATUSES.map((s) => {
              const [name, text] = t(`contribute.review.status.${s}`, { returnObjects: true }) as unknown as [string, string]
              return (
                <li key={s} className={`st-${s}`}>
                  <strong>{name}</strong>
                  <span>{text}</span>
                </li>
              )
            })}
          </ol>

          <h3>{t('contribute.review.tiersTitle')}</h3>
          <p>{t('contribute.review.tiersLead')}</p>
          <dl className="sk-c-tiers">
            {EVIDENCE_TIERS.map((k, i) => {
              const [name, text] = t(`contribute.review.tiers.${k}`, { returnObjects: true }) as unknown as [string, string]
              return (
                <div key={k} className={k === 'unverified_report' ? 'unverified' : ''}>
                  <dt>
                    <span className="sk-c-tier-no" aria-hidden="true">{['I', 'II', 'III', '—'][i]}</span> {name}
                  </dt>
                  <dd>{text}</dd>
                </div>
              )
            })}
          </dl>

          <h3>{t('contribute.review.unpublishedTitle')}</h3>
          <ul className="sk-c-list compact">
            {UNPUBLISHED_CHECKS.map((k) => (
              <li key={k}>{t(`contribute.review.unpublished.${k}`)}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sk-section" aria-labelledby="c-credit">
        <header className="sk-margin">
          <h2 id="c-credit">{t('contribute.credit.title')}</h2>
          <p className="sk-note">{t('contribute.credit.note')}</p>
        </header>
        <div className="sk-c-text">
          <ul className="sk-c-list">
            {list('contribute.credit.items').map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="sk-c-emph">{t('contribute.credit.authorship')}</p>
        </div>
      </section>

      <section className="sk-section sk-c-contact" aria-labelledby="c-contact" id="contact">
        <header className="sk-margin">
          <h2 id="c-contact">{t('contribute.contact.title')}</h2>
          <p className="sk-note">{t('contribute.contact.note')}</p>
        </header>
        <div className="sk-c-text">
          <p className="sk-lead">{t('contribute.contact.lead')}</p>
          {email ? (
            <div data-channel="email">
              <div className="sk-actions">
                <a className="sk-btn" href={mailtoHref(email, subject, t('contribute.contact.body'))}>
                  {t('contribute.contact.write')} <span aria-hidden="true">→</span>
                </a>
              </div>
              <p>
                {t('contact.address')} <EmailCopy email={email} />
              </p>
              <p className="sk-c-meta">{t('contact.noClient')}</p>
            </div>
          ) : (
            <div className="sk-c-inactive" role="note" data-channel="inactive">
              <p className="sk-c-inactive-title">{t('contribute.contact.inactiveTitle')}</p>
              <p>{t('contribute.contact.inactive')}</p>
              <p>
                {t('contribute.contact.interim')} <Link to={`/${lang}/ilya-mazunin/`}>{t('contribute.contact.curatorPage')} →</Link>
              </p>
            </div>
          )}
          <div className="sk-c-two">
            <div>
              <h3>{t('contribute.contact.includeTitle')}</h3>
              <ul className="sk-c-list compact">
                {list('contribute.contact.include').map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>{t('contribute.contact.subjectLabel')}</h3>
              <p className="sk-c-subject">{subject}</p>
              <p className="sk-c-warning">{t('contribute.contact.warning')}</p>
            </div>
          </div>
        </div>
      </section>
    <BackToTop />
    </article>
  )
}
