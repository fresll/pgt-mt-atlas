import { observationText, scientificText } from '../../i18n/scientificText'
import { sourceText } from '../../i18n/source-text-en'
import { BackToTop, PageContents } from '../../components/PageContents'
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
      <PageContents items={[{ id: 'methods-1', text: t('interfaceCopy.Methods.collectedTitle') }, { id: 'methods-2', text: t('interfaceCopy.Methods.sizeTitle') }, { id: 'methods-3', text: t('interfaceCopy.Methods.representationTitle') }, { id: 'methods-4', text: t('interfaceCopy.Methods.guidesTitle') }, { id: 'methods-5', text: t('interfaceCopy.Methods.limitationsTitle') }, { id: 'methods-6', text: t('interfaceCopy.Methods.classificationTitle') }, { id: 'methods-7', text: t('interfaceCopy.Methods.reportingTitle') }]} />

      <h2 id="methods-1">{t('interfaceCopy.Methods.collectedTitle')}</h2>
      <p>
        {t('interfaceCopy.Methods.datasetSummary', { v0: c.landscape_values, v1: c.landscape_variants, v2: c.concordance_blastocysts, v3: c.offspring_children_exact_pair, values: word(c.landscape_values, 'value'), variants: word(c.landscape_variants, 'variant'), blastocysts: word(c.concordance_blastocysts, 'blastocyst') })}
      </p>
      <p>
        {t('interfaceCopy.Methods.incompleteCycles')}
      </p>

      <p>{t('data.countSummary', { records: atlas.offspring.length, pairs: atlas.stats.fig5.n_pairs, children: atlas.stats.fig5.n_children, pubs: atlas.publications.length, embryoPubs: new Set(atlas.landscape.map(o => o.pub)).size })}</p>
      <h2 id="methods-2">{t('interfaceCopy.Methods.sizeTitle')}</h2>
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

      <h2 id="methods-3">{t('interfaceCopy.Methods.representationTitle')}</h2>
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

      <h2 id="methods-4">{t('interfaceCopy.Methods.guidesTitle')}</h2>
      <ul>
        {atlas.thresholds.filter(t => t.role !== 'chart_convention').map((th) => (
          <li key={th.id}>
            <strong>{th.value !== undefined ? `${fmt(th.value, lang)}%` : `${th.range?.[0]}–${th.range?.[1]}%`}</strong> · <em>{t(`methodLabels.thresholdRoles.${th.role}`)}</em> — {scientificText(th, lang)}
            {th.publication && <> (<PubRef id={th.publication} />)</>}
            <br />
            <span className="small muted" lang={lang}>{th.locator ? `${sourceText(th.locator, lang)}. ` : ''}{t('interfaceCopy.Methods.checked')}: {sourceText(th.checked, lang)}</span>
          </li>
        ))}
      </ul>
      <p className="callout">{t('interfaceCopy.Methods.guideCaveat')}</p>

      <h2 id="methods-5">{t('interfaceCopy.Methods.limitationsTitle')}</h2>
      <ul>
        <li>{t('interfaceCopy.Methods.heterogeneousStudies')}</li>
        <li>{t('interfaceCopy.Methods.publicationBias')}</li>
        <li>{t('interfaceCopy.Methods.dependentEmbryos')}</li>
        <li>{t('interfaceCopy.Methods.dependentChildSamples')}</li>
        <li>{t('interfaceCopy.Methods.scenarioModel')}</li>
      </ul>

      <h2 id="methods-6">{t('interfaceCopy.Methods.classificationTitle')}</h2>
      <p>
        {t('interfaceCopy.Methods.classificationMeaning')}
      </p>
      <div className="table-wrap">
        <table className="data" data-testid="variant-classes">
          <thead><tr><th>{t('interfaceCopy.Methods.variant')}</th><th>{t('interfaceCopy.Methods.variantClass')}</th><th>{t('interfaceCopy.Methods.basis')}</th></tr></thead>
          <tbody>
            {Object.entries(atlas.variant_classes).map(([v, x]) => (
              <tr key={v}>
                <td>{observationText(v, lang)}</td>
                <td>{label('variant_class', x.class, lang)}</td>
                <td className="small">{t(`common.classBasis.${x.status}`, { source: pubById[x.publication]?.short ?? x.publication, locator: sourceText(x.locator ?? '', lang), date: x.checked })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="methods-7">{t('interfaceCopy.Methods.reportingTitle')}</h2>
      <ol>
        <li>{t('interfaceCopy.Methods.reportPatient')}</li>
        <li>{t('interfaceCopy.Methods.reportEmbryo')}</li>
        <li>{t('interfaceCopy.Methods.reportMethod')}</li>
        <li>{t('interfaceCopy.Methods.reportOutcome')}</li>
      </ol>

    <BackToTop />
    </article>
  )
}
