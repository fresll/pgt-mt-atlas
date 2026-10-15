import { PubRef } from '../../components/ui'
import { atlas, label, pubById } from '../../data/atlas'
import { useCountWord, useLang, useT } from '../../i18n'
import { fmt } from '../../lib/format'
import { PageTitle } from '../../components/Layout'

export default function Methods() {
  const t = useT()
  const word = useCountWord()
  const lang = useLang()
  const c = atlas.meta.current_counts


  return (
    <article className="prose">
      <PageTitle title={t('methods.title')} />
      <h1>{t('methods.title')}</h1>

      <h2>{t('interfaceCopy.Methods.collectedTitle')}</h2>
      <p>
        {t('interfaceCopy.Methods.datasetSummary', { v0: c.landscape_values, v1: c.landscape_variants, v2: c.concordance_blastocysts, v3: c.offspring_children_exact_pair, values: word(c.landscape_values, 'value'), variants: word(c.landscape_variants, 'variant'), blastocysts: word(c.concordance_blastocysts, 'blastocyst') })}
      </p>
      <p>
        {t('interfaceCopy.Methods.incompleteCycles')}
      </p>

      <h2>{t('interfaceCopy.Methods.sizeTitle')}</h2>
      <div className="table-wrap">
        <table className="data" data-testid="release-counts">
          <thead><tr><th>{t('interfaceCopy.Methods.measure')}</th><th>{t('interfaceCopy.Methods.count')}</th></tr></thead>
          <tbody>
            {["landscape_values", "landscape_variants", "concordance_blastocysts", "concordance_records", "cleavage_embryos", "offspring_records", "offspring_children", "offspring_children_exact_pair", "publications"].map((k) => (
              <tr key={k}><td>{t(`methodLabels.countLabels.${k}`)}</td><td className="num">{c[k]}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>{t('interfaceCopy.Methods.representationTitle')}</h2>
      <ul>
        <li>{t('interfaceCopy.Methods.undetectedMeaning')}</li>
        <li>{t('interfaceCopy.Methods.intervalMeaning')}</li>
        <li>{t('interfaceCopy.Methods.derivationMeaning')}</li>
      </ul>
      <ul>
        {Object.keys(atlas.labels.derivation).map((d) => (
          <li key={d}>
            <strong>{label('derivation', d, lang)}</strong> — {atlas.landscape.filter((o) => o.derivation === d).length} {t('interfaceCopy.Methods.landscapeValues')}
          </li>
        ))}
      </ul>
      <p>{t('interfaceCopy.Methods.pointProvenance')}</p>

      <h2>{t('interfaceCopy.Methods.guidesTitle')}</h2>
      <ul>
        {atlas.thresholds.map((th) => (
          <li key={th.id}>
            <strong>{th.value !== undefined ? `${fmt(th.value, lang)}%` : `${th.range?.[0]}–${th.range?.[1]}%`}</strong> · <em>{t(`methodLabels.thresholdRoles.${th.role}`)}</em> — {th[lang]}
            {th.publication && <> (<PubRef id={th.publication} />)</>}
            <br />
            <span className="small muted" lang="ru">{th.locator ? `${th.locator}. ` : ''}{t('interfaceCopy.Methods.checked')}: {th.checked}</span>
          </li>
        ))}
      </ul>
      <p className="callout">{t('interfaceCopy.Methods.guideCaveat')}</p>

      <h2>{t('interfaceCopy.Methods.limitationsTitle')}</h2>
      <ul>
        <li>{t('interfaceCopy.Methods.heterogeneousStudies')}</li>
        <li>{t('interfaceCopy.Methods.publicationBias')}</li>
        <li>{t('interfaceCopy.Methods.dependentEmbryos')}</li>
        <li>{t('interfaceCopy.Methods.dependentChildSamples')}</li>
        <li>{t('interfaceCopy.Methods.scenarioModel')}</li>
      </ul>

      <h2>{t('interfaceCopy.Methods.classificationTitle')}</h2>
      <p>
        {t('interfaceCopy.Methods.classificationMeaning')}
      </p>
      <div className="table-wrap">
        <table className="data" data-testid="variant-classes">
          <thead><tr><th>{t('interfaceCopy.Methods.variant')}</th><th>{t('interfaceCopy.Methods.variantClass')}</th><th>{t('interfaceCopy.Methods.basis')}</th></tr></thead>
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

      <h2>{t('interfaceCopy.Methods.reportingTitle')}</h2>
      <ol>
        <li>{t('interfaceCopy.Methods.reportPatient')}</li>
        <li>{t('interfaceCopy.Methods.reportEmbryo')}</li>
        <li>{t('interfaceCopy.Methods.reportMethod')}</li>
        <li>{t('interfaceCopy.Methods.reportOutcome')}</li>
      </ol>

    </article>
  )
}
