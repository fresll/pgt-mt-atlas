import { Link } from 'react-router-dom'
import { atlas } from '../data/atlas'
import { useLang, useT } from '../i18n'

export default function Home() {
  const t = useT()
  const lang = useLang()
  const s = atlas.stats
  return (
    <article>
      <h1>{t('site.title')}</h1>
      <p className="lead">{t('site.tagline')}</p>
      <p className="prose">{t('home.lead')}</p>
      <div className="stats">
        <div className="stat"><div className="num">{s.fig3.n}</div><div className="lbl">{t('home.k1')}</div></div>
        <div className="stat"><div className="num">{s.fig4.n_embryos}</div><div className="lbl">{t('home.k2')}</div></div>
        <div className="stat"><div className="num">{s.fig5.n_pairs}</div><div className="lbl">{t('home.k3', { children: s.fig5.n_children })}</div></div>
      </div>
      <div className="cards">
        <div className="card">
          <Link className="stretch" to={`/${lang}/science/`}>
            <h3>{t('home.sciTitle')} →</h3>
            <p>{t('home.sciText')}</p>
          </Link>
        </div>
        <div className="card">
          <Link className="stretch" to={`/${lang}/patients/`}>
            <h3>{t('home.patTitle')} →</h3>
            <p>{t('home.patText')}</p>
          </Link>
        </div>
      </div>
      <div className="callout">{t('home.caveat')}</div>
    </article>
  )
}
