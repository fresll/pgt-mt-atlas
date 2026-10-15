import { PubRef } from '../../components/ui'
import { atlas, label, pubById } from '../../data/atlas'
import { useLang, useT } from '../../i18n'
import { fmt } from '../../lib/format'
import { PageTitle } from '../../components/Layout'

export default function Methods() {
  const t = useT()
  const lang = useLang()
  const c = atlas.meta.current_counts


  return (
    <article className="prose">
      <PageTitle title={t('methods.title')} />
      <h1>{t('methods.title')}</h1>

      <h2>{t('interfaceCopy.Methods.copy1')}</h2>
      <p>
        {t('interfaceCopy.Methods.copy2', { v0: c.landscape_values, v1: c.landscape_variants, v2: c.concordance_blastocysts, v3: c.offspring_children_exact_pair })}
      </p>
      <p>
        {t('interfaceCopy.Methods.copy3')}
      </p>

      <h2>{t('interfaceCopy.Methods.copy4')}</h2>
      <div className="table-wrap">
        <table className="data" data-testid="release-counts">
          <thead><tr><th>{t('interfaceCopy.Methods.copy5')}</th><th>{t('interfaceCopy.Methods.copy6')}</th></tr></thead>
          <tbody>
            {["landscape_values", "landscape_variants", "concordance_blastocysts", "concordance_records", "cleavage_embryos", "offspring_records", "offspring_children", "offspring_children_exact_pair", "publications"].map((k) => (
              <tr key={k}><td>{t(`methodLabels.countLabels.${k}`)}</td><td className="num">{c[k]}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>{t('interfaceCopy.Methods.copy7')}</h2>
      <ul>
        <li>{t('interfaceCopy.Methods.copy8')}</li>
        <li>{t('interfaceCopy.Methods.copy9')}</li>
        <li>{t('interfaceCopy.Methods.copy10')}</li>
      </ul>
      <ul>
        {Object.keys(atlas.labels.derivation).map((d) => (
          <li key={d}>
            <strong>{label('derivation', d, lang)}</strong> — {atlas.fig3.filter((o) => o.derivation === d).length} {t('interfaceCopy.Methods.copy11')}
          </li>
        ))}
      </ul>
      <p>{t('interfaceCopy.Methods.copy12')}</p>

      <h2>{t('interfaceCopy.Methods.copy13')}</h2>
      <ul>
        {atlas.thresholds.map((th) => (
          <li key={th.id}>
            <strong>{th.value !== undefined ? `${fmt(th.value, lang)}%` : `${th.range?.[0]}–${th.range?.[1]}%`}</strong> · <em>{t(`methodLabels.thresholdRoles.${th.role}`)}</em> — {th[lang]}
            {th.publication && <> (<PubRef id={th.publication} />)</>}
            <br />
            <span className="small muted" lang="ru">{th.locator ? `${th.locator}. ` : ''}{t('interfaceCopy.Methods.copy14')}: {th.checked}</span>
          </li>
        ))}
      </ul>
      <p className="callout">{t('interfaceCopy.Methods.copy15')}</p>

      <h2>{t('interfaceCopy.Methods.copy16')}</h2>
      <ul>
        <li>{t('interfaceCopy.Methods.copy17')}</li>
        <li>{t('interfaceCopy.Methods.copy18')}</li>
        <li>{t('interfaceCopy.Methods.copy19')}</li>
        <li>{t('interfaceCopy.Methods.copy20')}</li>
        <li>{t('interfaceCopy.Methods.copy21')}</li>
      </ul>

      <h2>{t('interfaceCopy.Methods.copy22')}</h2>
      <p>
        {t('interfaceCopy.Methods.copy23')}
      </p>
      <div className="table-wrap">
        <table className="data" data-testid="variant-classes">
          <thead><tr><th>{t('interfaceCopy.Methods.copy24')}</th><th>{t('interfaceCopy.Methods.copy25')}</th><th>{t('interfaceCopy.Methods.copy26')}</th></tr></thead>
          <tbody>
            {Object.entries(atlas.variant_classes).map(([v, x]) => (
              <tr key={v}>
                <td>{v}</td>
                <td>{label('variant_class', x.class, lang)}</td>
                <td className="small">{t(`common.classBasis.${x.status}`, { source: pubById[x.publication]?.short ?? x.publication, locator: x.locator ?? '', date: x.checked })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>{t('interfaceCopy.Methods.copy27')}</h2>
      <ol>
        <li>{t('interfaceCopy.Methods.copy28')}</li>
        <li>{t('interfaceCopy.Methods.copy29')}</li>
        <li>{t('interfaceCopy.Methods.copy30')}</li>
        <li>{t('interfaceCopy.Methods.copy31')}</li>
      </ol>

    </article>
  )
}
