import type { Dict } from './ru'

const en: Dict = {
  "countWords": {
    "value": [
      "value",
      "values",
      "values"
    ],
    "variant": [
      "variant",
      "variants",
      "variants"
    ],
    "blastocyst": [
      "blastocyst",
      "blastocysts",
      "blastocysts"
    ],
    "embryo": [
      "embryo",
      "embryos",
      "embryos"
    ],
    "comparison": [
      "comparison",
      "comparisons",
      "comparisons"
    ],
    "pathogenic": [
      "blastocyst with a pathogenic variant",
      "blastocysts with a pathogenic variant",
      "blastocysts with a pathogenic variant"
    ]
  },
  "site": {
    "title": "PGT-mt Atlas",
    "tagline": "An open database of published embryo heteroplasmy values from preimplantation genetic testing for mitochondrial DNA variants (PGT-mt). Each value is linked to its source.",
    "curated": "Created and curated by Ilya Mazunin",
    "preview": "Preview. The site is not yet published; the data and text await review by the curator.",
    "skip": "Skip to content"
  },
  "nav": {
    "fundamentals": "Fundamentals",
    "home": "Home",
    "science": "Data for specialists",
    "scienceIndex": "Overview of the sections",
    "patients": "For patients",
    "about": "About",
    "curator": "Ilya Mazunin",
    "data": "Table of values",
    "landscape": "Between different embryos",
    "concordance": "Within individual embryos",
    "offspring": "Embryo, foetus and child",
    "model": "PGT-mt × PGT-A model",
    "cases": "Published cases",
    "sources": "Sources",
    "methods": "Methods and limitations",
    "contribute": "Contribute data",
    "language": "Language",
    "switchTo": "Русский",
    "primaryLabel": "Main menu",
    "scienceLabel": "Sections for specialists",
    "sectionSelect": "Section",
    "chapterSelect": "Chapter",
    "menu": "Menu",
    "menuClose": "Close",
    "theme": "Colour theme: {{mode}}",
    "themeMode": {
      "system": "system",
      "light": "light",
      "dark": "dark"
    }
  },
  "footer": {
    "visits": "Visits:",
    "visitsHelp": "Total visits to the Atlas",
    "visitsUnavailable": "Visit count is temporarily unavailable",
    "updated": "Data updated {{date}} · dataset version {{version}}",
    "disclaimer": "PGT-mt Atlas does not replace a consultation with a clinical geneticist. The creator and curator of PGT-mt Atlas does not provide medical advice.",
    "contribute": "For researchers: contribute data",
    "linksLabel": "Site links"
  },
  "badge": {
    "observed": "Observed data",
    "model": "Model calculation",
    "outsideArticle": "extended view",
    "draft": "Draft"
  },
  "contact": {
    "address": "Address:",
    "copy": "Copy address",
    "copied": "Address copied",
    "copyFailed": "Could not copy — select the address and copy it manually",
    "noClient": "If no email app opens, copy the address and send your message using your usual email service."
  },
  "common": {
    "value": "Value",
    "variant": "mtDNA variant",
    "source": "Source",
    "stage": "Stage",
    "material": "Sample material",
    "sample": "Sample type",
    "derivation": "How the value was obtained",
    "note": "Note in the workbook",
    "provenance": "Provenance",
    "sheetRow": "sheet “{{sheet}}”, row {{row}}",
    "legacyId": "Former ID",
    "variantClass": "Variant classification",
    "classBasis": {
      "stated_in_source": "basis: {{source}}, {{locator}}; checked {{date}}",
      "implied_in_source": "inferred from {{source}}, {{locator}}; checked {{date}}",
      "not_verified": "as in the supplementary workbook; no explicit statement found in the primary publication (checked {{date}})"
    },
    "doi": "DOI",
    "pmid": "PMID",
    "noDoi": "no DOI",
    "status": "Status",
    "all": "All",
    "showTable": "Data table",
    "downloadCsv": "Download CSV",
    "downloadVisibleCsv": "Download visible rows (CSV)",
    "close": "Close",
    "selected": "Selected record",
    "clickHint": "Select a point to view its source and provenance.",
    "n": "n",
    "notDetected": "not detected",
    "lod": "limit of detection: {{lod}}%",
    "interval": "published interval only: {{low}}–{{high}}%",
    "lessThan": "below {{v}}%",
    "upperBoundUnknown": "Upper bound not reported; see source note",
    "loadingChart": "Loading chart…",
    "main": "Key finding",
    "scrollHint": "The chart is wider than the screen: scroll sideways to see all variants →",
    "noJs": "The interactive chart needs JavaScript. The same data are shown in the table below.",
    "chartError": "The interactive chart module could not be loaded. Check your connection and reload the page; the same data are shown in the table below.",
    "imageError": "The image did not load. Please reload the page.",
    "figureInArticle": "Reference view",
    "explore": "Explore",
    "mode": "Mode",
    "threshold": "Cut-off",
    "reset": "Reset",
    "resetChartView": "Return to the original view",
    "embryo": "Embryo",
    "child": "Child",
    "tissue": "Tissue",
    "phase": "Phase",
    "age": "Age",
    "method": "Method",
    "delta": "Δ (tissue − embryo), pp",
    "pp": "pp",
    "published": "published",
    "in_press": "in press",
    "conference_abstract": "conference abstract",
    "preprint": "preprint"
  },
  "pubStatus": {
    "published": "published",
    "in_press": "in press",
    "conference_abstract": "conference abstract",
    "preprint": "preprint"
  },
  "verification": {
    "title": "Check against the published supplementary material",
    "match": "matches ESM",
    "value_mismatch": "differs from ESM",
    "fraction_label_mismatch": "sample category differs from ESM",
    "not_in_dataset": "not in the dataset",
    "missing_in_dataset": "missing from the dataset",
    "mismatch": "mismatch",
    "datasetKept": "The dataset value is unchanged pending the curator’s review.",
    "corrected": "corrected to ESM 2",
    "correctedNote": "A documented correction layer resolves these discrepancies. The site displays the values in the published ESM 2 and retains the original workbook values for comparison.",
    "correctedTitle": "Corrected to the published source",
    "sourceValue": "in the supplementary workbook"
  },
  "home": {
    "lead": "The Atlas presents published heteroplasmy levels and explains how to interpret these values.",
    "k1": "embryo heteroplasmy values",
    "k2": "{{word}} in which a biopsy sample was compared with other parts of the same embryo (including the inner cell mass in {{icm}})",
    "k3": "{{word}} between embryo and tissue samples from {{children}} foetuses and children; the variant was not detected in either sample for {{ndChildren}} foetuses and children",
    "sciTitle": "For specialists",
    "sciText": "Interactive charts, a source-linked data table, and an explanation of the methods and limitations.",
    "patTitle": "For patients",
    "fundTitle": "PGT-mt fundamentals",
    "fundText": "A six-chapter course on mtDNA inheritance and the interpretation of PGT-mt results, for clinicians, embryologists and students.",
    "ctaPatients": "Patients and families",
    "ctaSpecialists": "Data for specialists",
    "ctaFundamentals": "PGT-mt fundamentals — a six-chapter course",
    "patText": "What heteroplasmy means, what PGT-mt can offer, and why a percentage in a test report is not a diagnosis.",
    "caveat": "The dataset is descriptive: it is not a meta-analysis, does not define a safe threshold and does not replace a consultation with a clinical geneticist.",
    "kicker": "An independent scientific database",
    "explore": "Explore the data",
    "allSections": "Scientific sections",
    "figCaption": "A blastocyst. The first enlarged view shows a trophectoderm cell with its nucleus and small mitochondria. The second shows a mitochondrion containing wild-type mtDNA and mtDNA carrying a pathogenic variant.",
    "labels": {
      "te": "trophectoderm",
      "icm": "inner\ncell mass",
      "cell": "trophectoderm\ncell",
      "wt": "wild-type\nmtDNA",
      "variant": "pathogenic\nmtDNA variant"
    },
    "aboutTitle": "The scientific database",
    "aboutNote": "what is inside",
    "k4": "{{word}} ({{doi}} with a DOI)",
    "landscapeTitle": "Between different embryos",
    "concordanceTitle": "Within individual embryos",
    "concordanceSubtitle": "Agreement in heteroplasmy levels between different parts of the same embryo",
    "offspringSubtitle": "Heteroplasmy in embryo biopsies and prenatal or postnatal samples",
    "sectionsTitle": "Sections of the Atlas",
    "sectionsNote": "from biopsy to data",
    "biopsyCaption": "Trophectoderm (TE) biopsy: a sample of a few TE cells in which PGT-mt measures the proportion of mtDNA carrying a pathogenic variant.",
    "dataLink": "Full dataset",
    "sourcesLink": "Sources",
    "methodsLink": "Methods and limitations",
    "dataTitle": "Published values only",
    "dataText": "Every value in the Atlas is linked to its primary source. These sources also underpin the mathematical model.",
    "mitoCaption": "A mitochondrion with cristae and circular mtDNA molecules.",
    "curatorBio": "Doctor of Biological Sciences, geneticist",
    "biography": "Scientific biography"
  },
  "landscape": {
    "title": "Between different embryos",
    "subtitle": "Heteroplasmy levels in embryos, by mtDNA variant and source",
    "lead": "Each point represents a published or derived heteroplasmy value for one embryo. Hollow markers indicate derived values. Diamonds indicate 1PN/3PN embryos, which are not candidates for transfer. Within each variant, separate columns show the sources.",
    "yAxis": "Heteroplasmy in the embryo sample, %",
    "share": "Proportion ≤{{t}}%",
    "derivedLegend": "hollow marker — value calculated by averaging or digitised from a published figure",
    "aggregate": "Group ≥6 identical values (×n)",
    "highlightDerived": "Highlight derived values",
    "stageFilter": "Stage",
    "customThreshold": "Custom cut-off, %",
    "bands": "Background bands: up to 18%, pale green; 18–30%, pale blue; 30–100%, pale red. The 18% reference point was estimated from muscle measurements (Hellebrekers et al., 2012); it is not a threshold for an embryo biopsy sample. The Newcastle programme predominantly used <30% (Hyslop et al., 2025). Proportions include values ≤ the selected boundary. These are not universal clinical thresholds.",
    "groupTitle": "Identical values: {{n}} observations",
    "groupHint": "The ×{{n}} marker groups identical values from the same source. Select an observation:",
    "groupInTable": "The table below shows only observations in this group.",
    "showAll": "Show all observations",
    "groupClick": "select to view all observations in the group",
    "main": "The proportion of embryos with heteroplasmy at or below 18% varies widely between variants: {{list}}. These proportions describe published series; they do not estimate the probability for an individual family.",
    "intervalNote": "Only intervals were published for two m.10197G>A embryos. They are shown as bars; no midpoint is imputed. An interval is included in the proportion ≤ the cut-off only when its upper bound is at or below that cut-off.",
    "guide18": "18% estimate (muscle; Hellebrekers 2012)",
    "guide30": "30% criterion (Newcastle)"
  },
  "concordance": {
    "fractionCounts": "Ranges calculated from three samples (11 embryos) and two samples (29) are not directly comparable",
    "title": "Within individual embryos",
    "subtitle": "Agreement in heteroplasmy levels between different parts of the same embryo",
    "lead": "Panels A and B show the same blastocysts (n = {{n}}). Panel C also includes {{c}} cleavage-stage embryos from one woman carrying m.3243A>G (Monnot et al., 2011; two blastomeres per embryo).",
    "main": "Heteroplasmy levels are usually similar between samples from the same blastocyst. The median within-embryo range is {{all}} percentage points, or {{pat}} percentage points for pathogenic variants (maximum {{max}} percentage points). In {{share}}% of blastocysts with pathogenic variants, the range is 5 percentage points or less.",
    "a": "A. Samples from the same embryo",
    "b": "B. Difference: analysed sample − clinical biopsy sample",
    "c": "C. Within-embryo range",
    "yA": "Heteroplasmy level, %",
    "yB": "Δ heteroplasmy, pp",
    "yC": "Range, pp",
    "pathogenic": "pathogenic variants",
    "hv2": "HV2 — control embryos",
    "showHv2": "Show HV2",
    "band5": "grey band — ±5 percentage points; an illustrative guide without a published source",
    "median": "median",
    "cleavage": "Cleavage stage, 2 blastomeres",
    "blastPat": "Blastocyst, pathogenic variant",
    "blastHv2": "Blastocyst, HV2",
    "remMinusBx": "remaining TE − biopsy",
    "icmMinusBx": "ICM − biopsy",
    "combMinusBx": "ICM+TE − biopsy",
    "combShort": "ICM+TE<br>(combined sample)",
    "hu": "Additional data: 16 samples from one blastocyst (Hu et al., 2026)",
    "huText": "A blastocyst with 17.8% m.3250T>C in the biopsy sample was divided into 16 samples of 3–5 cells; the ICM was not isolated. These data are not plotted because variability among small cell samples is not directly comparable with variability among larger embryo fractions.",
    "verifyNote": "For Tofilo et al., 2026, the values for embryo 6 (ICM and remaining TE) and the sample categories for embryos 3 and 4 (combined ICM+TE) follow the published ESM 2. The embryo details retain the original workbook values. In this study, the sample labelled “ICM” also contains adherent TE cells (“ICM+”)."
  },
  "offspring": {
    "bothNDPair": "ND → ND",
    "bothNDChildren": "In {{pairs}} paired comparisons from {{children}} foetuses and children, the variant was not detected (ND) in either sample. These results are not exact measurements of zero.",
    "bothND": "ND → ND: {{n}} pairs",
    "recordSummary": "{{records}} records, including {{pairs}} matched embryo–tissue pairs from {{children}} foetuses and children",
    "childSummary": "The embryo heteroplasmy level was low for {{low}} of {{all}} foetuses and children. In {{concordant}} of these, every tissue result was low or not detected. Results from different laboratories disagree for one child (C5).",
    "deltaBound": "Δ is expressed in percentage points. When only the tissue result is ND, Δ has a lower bound, shown by an open marker and an upward arrow. When only the embryo result is ND, Δ has an upper bound. ND → ND pairs are counted below the group and are not plotted at Δ = 0.",
    "ndBand": "ND (no numeric axis)",
    "title": "Embryo, foetus and child",
    "subtitle": "Heteroplasmy in embryo biopsies and prenatal or postnatal samples",
    "lead": "Comparisons between the transferred embryo and foetal or child tissue. The observations are not independent: several measurements may come from different tissues or time points in the same child.",
    "main": "{{pairs}} from {{children}} foetuses and children. {{disc}}",
    "discOne": "All comparisons classified here as discordant ({{ids}}) concern one child whose postnatal samples were analysed using a different method. Here, discordant means an embryo result at or below 18% paired with a tissue result above 18%; this is a descriptive grouping, not a clinical threshold.",
    "discMany": "Embryo–tissue discrepancies: {{ids}}.",
    "pairForms": [
      "comparison",
      "comparisons",
      "comparisons"
    ],
    "xA": "Heteroplasmy in the transferred embryo, %",
    "yA": "Heteroplasmy in foetal / child tissue, %",
    "yB": "Δ (tissue − embryo), pp",
    "prenatal": "prenatal samples",
    "blood": "blood / cord blood",
    "otherPost": "other postnatal tissues",
    "identity": "y = x (identical values)",
    "showExcluded": "Show excluded and censored records",
    "lowSpread": "Embryo results reported as not detected appear in a separate ND band without a numerical axis. Exact numerical results are available in the table.",
    "dependency": "Comparisons: {{pairs}}; foetuses and children: {{children}}. C5 contributes {{k}} repeat measurements out of {{pairs}}.",
    "excludedTitle": "Not plotted",
    "colorByVariant": "Colour indicates the mtDNA variant; shape indicates the sample material; labels identify cases."
  },
  "model": {
    "without3pn": "Additional denominator for m.14487T>C excluding the 3PN embryo: {{sign}}18% — {{k}}/{{n}}. The main dataset retains all published embryo values; a 3PN embryo is not a transfer candidate.",
    "versionLabel": "Model version: {{v}}",
    "title": "PGT-mt × PGT-A model",
    "subtitle": "Scenarios for joint selection using PGT-mt and preimplantation genetic testing for aneuploidy (PGT-A), and sensitivity to model assumptions",
    "banner": "The model estimates the probability that at least one blastocyst in a given group meets both laboratory criteria. The input proportions come from heterogeneous published series. These estimates are not personalised predictions.",
    "yAxis": "P(≥1 suitable)",
    "xAxis": "Number of blastocysts, N",
    "panelTabs": "Scenario proportion of euploid blastocysts",
    "panel": "Scenario E = {{p}}",
    "pHet": "H is the proportion of published heteroplasmy values at or below the selected threshold. It describes the included series, not an individual patient.",
    "pEupl": "E is the assumed proportion of euploid blastocysts in the scenario",
    "pEuplSource": "Reference",
    "meaningTitle": "What the result means",
    "meaning": "P(≥1) is the model probability that at least one of N blastocysts meets both model criteria: euploid by PGT-A and with heteroplasmy at or below the chosen threshold. It is not the probability of pregnancy, of a live birth or of a healthy child, and not a prediction for an individual patient.",
    "improvement": "Estimating family and variant effects requires complete, linked cycle data from several independent families. The scenario proportions of euploid blastocysts are not calibrated to age.",
    "formula": "Formulae",
    "assumptions": "Model assumptions (unproven)",
    "a1": "q = H × E: heteroplasmy and chromosome status are assumed independent;",
    "a2": "at ρ = 0, blastocysts are independent trials with the same probability; N is a given number of blastocysts, not an oocyte count or mean cycle yield;",
    "a3": "at ρ > 0, embryos share a random probability of meeting both criteria. The selected ρ is a scenario parameter; it has not been estimated from Atlas data;",
    "a4": "H describes pooled published records from different developmental stages and analytical methods; E is an assumed proportion of euploid blastocysts.",
    "tableTitle": "P(≥1) for all variants in the dataset",
    "smallN": "small n — the estimated proportion is unstable",
    "dashed": "thin, long-dashed lines — 30% cut-off, where it differs from 18%; the main line patterns distinguish variants",
    "nMax": "N up to",
    "boundary": "Threshold rule",
    "rhoLabel": "Embryo dependence, ρ",
    "independent": "upper bound: independent embryos",
    "rhoNote": "ρ describes dependence in the binary outcome of meeting both criteria. It is a specified beta-binomial correlation, not an observed correlation between heteroplasmy percentages. The same scenario value is used for every variant.",
    "showRange": "Show sensitivity to a conditional interval for H",
    "intervalNote": "The bands transform a conditional 95% Wilson interval for H while holding E and ρ fixed. The binomial interval assumes independent observations and does not account for family clustering, publication bias or measurement error. At ρ > 0, the band still shows sensitivity to the input; it is not an estimated interval for dependent embryos or clinical success.",
    "iid95": "95% Wilson CI (ignoring clustering)",
    "inputSummary": "The input comprises {{n}} records from {{sources}} publications: {{blastocysts}} are explicitly identified as blastocysts, and the developmental stage is unspecified for {{unspecified}}. For {{nd}} results reported as not detected, no limit of detection is available. These are heterogeneous published observations, not complete, independent treatment cycles.",
    "inputIntervalNote": "H = k/n is calculated from the included records for each variant. The full dataset includes cleavage-stage embryos, 3PN embryos and values reported only for transferred embryos (Hyslop 2025, Thorburn 2009). Selection for low heteroplasmy biases H upwards. The filter retains only explicitly identified blastocyst TE biopsy samples. Intervals are represented by their upper bounds; results reported as not detected are assumed to fall below the threshold. Wilson intervals ignore clustering.",
    "crossing": "Threshold-crossing intervals: {{n}}",
    "sampleComposition": "Input sample composition",
    "sourceCount": "Publications: {{n}}",
    "stageCount": "Blastocysts: {{b}}; stage unspecified: {{u}}",
    "ndCount": "Not detected, LoD not reported: {{n}}",
    "tableN": "Blastocyst count for the table, N",
    "tableAge": "Age {{age}}",
    "vus": "Variant of uncertain significance (VUS)",
    "dependentFormula": "For 0 < ρ < 1, the shared probability Q follows a beta distribution with mean q. Embryos are conditionally independent given Q; integrating Q induces positive dependence. At ρ = 0, the binomial limit is used.",
    "boundsTitle": "When heteroplasmy status and ploidy may be associated",
    "boundsNote": "The marginal proportions H and E determine only bounds on the joint probability q for one embryo. The table shows these bounds, not confidence intervals. They are conditional on the input proportions and do not describe dependence between embryos.",
    "evidenceTitle": "Joint results from primary studies",
    "evidenceNote": "The endpoint is fixed here: H≤18% and strict euploidy. Each denominator comprises blastocysts assessed by TE biopsy in one published series. These small series describe specific women carrying mtDNA variants; their proportions do not calibrate the scenario curves for other families.",
    "confirmedEuploid": "Confirmed euploid",
    "jointPass": "Passed both criteria",
    "evidence": {
      "tofilo": "One woman carrying the variant; one of six biopsy samples meets both criteria.",
      "hu": "One woman carrying a variant of uncertain significance (VUS). These results do not characterise pathogenic variants.",
      "ji": "One patient, two cycles; PGT-A was informative for 14/15. The remaining blastocyst has H=99.4%, so it fails the joint criterion regardless of its unknown ploidy.",
      "spathB": "Patient B. The variant was not detected in any biopsy sample; the LoD was not reported. The proportions assume that ND results fall below 18%. With no variation in H status, independence of the two criteria cannot be assessed.",
      "spathD": "Patient D. Proportions involving ND results assume a limit of detection below 18%. The joint proportion, 3/9, differs from the product of the marginal proportions, 8/27. This small series cannot establish an association."
    },
    "salleveltNote": "Sallevelt 2017: 3/22 numerical records below 18% include a low value in a 3PN embryo. Confirmed diagnostic yield for 2PN is 2/23. Four analyses are inconclusive due to a positive blank control; accepting the other 19 classifications bounds the below-18% fraction at 2/23–6/23. These are incomplete-data bounds, not a confidence interval.",
    "publicationCarriers": "Carriers reported per publication (do not sum)",
    "correlationExample": "Teaching example using current data: H = {{h}}, E = {{e}}, N = 6 gives {{p0}} at ρ = 0 and {{p2}} at ρ = 0.2. This is a scenario calculation, not an individual prediction.",
    "scenarioNote": "The scenario values are not assigned to specific ages.",
    "symbols": "H — proportion at or below the selected threshold; E — assumed proportion of euploid blastocysts; ◆ model calculation.",
    "teOnly": "Blastocyst TE biopsies only",
    "carrierCaveat": "With 1–2 women carrying a variant, the proportion describes those women, not the variant as a whole. Records are linked across publications only when the available information supports the match. Counts are reported separately for each publication; the same woman may appear in several papers, so the counts must not be summed.",
    "unknown": "not established",
    "carriers": "carriers: {{n}}; records: {{records}}"
  },
  "data": {
    "maternalCluster": "Maternal cluster",
    "embryoSample": "Embryo sample",
    "day3Blastomere": "One day-3 blastomere",
    "atlasRow": "Atlas source worksheet, row {{row}}",
    "countSummary": "{{records}} records, including {{pairs}} matched embryo–tissue pairs from {{children}} foetuses and children. {{pubs}} publications, of which {{embryoPubs}} report embryo values.",
    "locator": "Source location",
    "title": "Table of values",
    "lead": "All observations, with the provenance of every value. CSV downloads use English labels and notes; identifiers and numerical data are unchanged.",
    "embryos": "Embryos (Between different embryos)",
    "offspring": "Embryo, foetus and child",
    "filterVariant": "Variant",
    "filterSource": "Source",
    "search": "Search (ID, former ID, variant, source)",
    "release": "Current dataset version: {{n}} embryo heteroplasmy values. Initial frozen version {{base}}: {{nBase}} values. Changes since the initial version: {{changes}} (see Methods).",
    "csvTitle": "Database tables (CSV)",
    "version": "Dataset version {{v}}; source file {{file}} (SHA-256 {{sha}}…)"
  },
  "cases": {
    "phenotype": "Phenotype",
    "title": "Cases",
    "lead": "Published cases and case series, including heteroplasmy levels, sampled tissues and reported outcomes. Personal medical details are omitted; each numerical value retains its source attribution.",
    "range": "Range across embryos",
    "transferred": "Transferred embryo",
    "offspring": "Foetal / child tissues",
    "dataType": "Data type",
    "origin": "Where the value comes from"
  },
  "sources": {
    "verificationSummary": "DOIs checked against PubMed on 11 October 2026; PMIDs are shown in the table. Exceptions identify publications without a PubMed record.",
    "title": "Sources",
    "lead": "Publications supporting the dataset values, chart reference lines and model parameters. Each entry identifies the primary study, its authors and DOI.",
    "rolesTitle": "Use in the Atlas",
    "filter": "Show",
    "filterData": "with values in the dataset",
    "filterOther": "reference points, model, cases",
    "colPublication": "Publication",
    "colType": "Type",
    "colRecords": "Records",
    "colRoles": "Where used",
    "roleShort": {
      "observations": "observations",
      "case_summary": "published cases",
      "threshold": "reference point on charts",
      "model_parameter": "PGT-mt × PGT-A model",
      "excluded_data": "considered, not included",
      "classification_basis": "variant classification"
    },
    "roles": {
      "observations": "observations: individual heteroplasmy values ({{section}})",
      "case_summary": "summary of a published case or series (Cases)",
      "threshold": "reference line on the charts ({{section}})",
      "model_parameter": "scenario model parameter: proportion of euploid blastocysts by age",
      "excluded_data": "data reviewed and not included (reason in Methods)",
      "classification_basis": "basis for the classification of {{section}}"
    },
    "sections": {
      "heteroplasmy-landscape": "Between different embryos",
      "embryo-concordance": "Within individual embryos",
      "embryo-to-offspring": "Embryo, foetus and child"
    },
    "doiException": "DOI exception",
    "records": "records in the dataset",
    "verified": "Verified",
    "supplementary": "Supplementary material"
  },
  "contribute": {
    "title": "Contribute data",
    "kicker": "International contributions to the evidence base",
    "motto": "Every outcome matters. Unsuccessful outcomes are data too.",
    "lead": "PGT-mt Atlas welcomes contributions from research groups and clinics worldwide. If you have performed PGT-mt or studied embryos carrying mtDNA variants, your results can help describe the method more fully — including unsuccessful cycles and embryos that were not transferred.",
    "downloadTemplate": "Download the template (.xlsx)",
    "contactLink": "Contact the curator",
    "templateMeta": "PGT-mt Research Data Submission · version {{v}} · {{date}} · Excel",
    "why": {
      "title": "Why every outcome matters",
      "note": "publication bias",
      "p1": "Successful PGT-mt outcomes are published more often than unsuccessful ones. A cycle resulting in the birth of a healthy child is more likely to be published than a cycle with no suitable embryo, implantation failure or pregnancy loss.",
      "p2": "The literature may therefore present a biased picture, suggesting that a suitable embryo is almost always available and outcomes are predictable. Unsuccessful outcomes remain under-represented, although families need this information during genetic counselling.",
      "p3": "The Atlas records all outcomes with the same care. Reporting an unsuccessful outcome helps make the evidence base more complete and accurate."
    },
    "cycles": {
      "title": "Why complete cycles matter",
      "note": "from oocyte to child",
      "lead": "Estimating how often PGT-mt leads to embryo transfer and live birth requires a complete denominator: every oocyte and embryo in the cycle, including those not transferred. A cycle may end at any of the stages below; each outcome contributes information.",
      "steps": [
        "oocytes retrieved",
        "mature (MII)",
        "fertilised (2PN)",
        "blastocysts",
        "biopsy and PGT-mt",
        "suitable embryo",
        "transfer",
        "pregnancy",
        "live birth and follow-up"
      ],
      "losses": [
        "immature and degenerated oocytes",
        "unfertilised oocytes",
        "developmental arrest",
        "no test result",
        "no suitable embryo",
        "no implantation",
        "pregnancy loss"
      ],
      "lossesTitle": "Stages at which a cycle may end — every outcome counts:",
      "p": "Heteroplasmy measurements from all embryos in a cycle — including aneuploid embryos, embryos with developmental arrest and those not transferred — help describe transmission of an mtDNA variant through oogenesis and early development. Without these observations, estimates of risk for a family are incomplete."
    },
    "interest": {
      "title": "Data we welcome",
      "note": "studies and observations",
      "items": [
        "Complete PGT-mt cycles — every started cycle, including those that ended without a transfer.",
        "Heteroplasmy values for every embryo, not only for the transferred ones; PGT-A and morphology results.",
        "Studies of embryos donated for research: trophectoderm biopsy versus inner cell mass and remaining trophectoderm, repeated biopsies, single blastomeres.",
        "Oocytes and polar bodies; heteroplasmy in the carrier’s tissues.",
        "Prenatal diagnosis and postnatal follow-up of children, with the tissue, age and method stated.",
        "Unsuccessful and unexpected outcomes: no suitable embryo, implantation failure, pregnancy loss, or discordant results between embryo and foetal tissue.",
        "Methodological data: validation, limit of detection, linearity, effects of whole-genome amplification, repeated measurements.",
        "Published studies not yet included in the Atlas — a reference and the location of the values in the paper are sufficient."
      ]
    },
    "how": {
      "title": "How to contribute",
      "note": "step by step",
      "steps": [
        [
          "Write to the curator",
          "Briefly describe the study, the size of the dataset and its publication status."
        ],
        [
          "Fill in the template",
          "Download PGT-mt Research Data Submission and complete the sheets that apply to your data. To suggest a published study, send its citation or DOI."
        ],
        [
          "Agree how to share the data",
          "The curator will propose a secure channel for the file. Patient data are never sent by unencrypted e-mail and are never uploaded to the website or to GitHub."
        ],
        [
          "Scientific review",
          "The curator reviews completeness, consistency, overlap with published data, authorisation, permissions, de-identification and ethical requirements, and contacts the authors where clarification is needed."
        ],
        [
          "Decision and credit",
          "You receive a decision with its reasons. Included values appear in the Atlas with their source and authors."
        ]
      ]
    },
    "template": {
      "detailsTitle": "Template details: worksheets, completion guidance and de-identification",
      "title": "A structured template for research data",
      "note": "Excel template",
      "lead": "The PGT-mt Research Data Submission template captures the minimum dataset for a PGT-mt cycle — patient and cycle, embryo, method and outcome — with additional fields for complete cycles and unsuccessful outcomes. Linked worksheets describe each oocyte, embryo, sample and outcome without direct identifiers.",
      "sheetsTitle": "Sheets of the template",
      "fields": "{{n}} fields, {{r}} required",
      "extra": "Also included: instructions (EN/RU), a Data Dictionary with the definition, unit and allowed values of every field, and drop-down lists.",
      "rulesTitle": "Zero, missing data and results below the detection limit are different",
      "rules": [
        "A blank cell means “not reported / unknown”.",
        "0 in a count means “counted, none”.",
        "Below the detection limit is its own value type (below_lod) with the limit stated — not 0.",
        "A published interval or bound is kept as published; no midpoint is imputed.",
        "An analysis that failed or was not performed remains in the table because it is part of the cycle record."
      ],
      "privacyTitle": "No direct identifiers",
      "privacy": "The template has no fields for names, initials, exact dates of birth or procedures, addresses, patient contacts or medical record numbers. Age is recorded in groups, time points are relative (embryo day, gestational week, child age in months) and all codes are de-identified."
    },
    "review": {
      "title": "Scientific review",
      "note": "from submission to inclusion",
      "lead": "Each submission follows the same review process. Submitted data never appear automatically in public charts. Inclusion requires a separate decision by the curator and a reviewed change to the dataset.",
      "figCaption": "The path of data: a research group’s table (red dots — negative outcomes, which are needed too), submission, scientific review and inclusion in the Atlas; some submissions are rejected with reasons.",
      "labels": {
        "researcher": "research\ngroup",
        "submitted": "submitted",
        "review": "under review",
        "validated": "validated",
        "atlas": "PGT-mt Atlas",
        "rejected": "rejected"
      },
      "statusTitle": "Statuses",
      "status": {
        "submitted": [
          "Submitted",
          "The enquiry or file has been registered; no data are displayed."
        ],
        "under_review": [
          "Under review",
          "Completeness, consistency, overlap, authorisation and de-identification are reviewed; questions are referred to the authors."
        ],
        "validated": [
          "Validated",
          "The data have passed review and are prepared for inclusion with their evidence level."
        ],
        "included": [
          "Included",
          "Values are added to the dataset by a separate reviewed change and shown with attribution."
        ],
        "rejected": [
          "Rejected",
          "The data are not included; the authors receive the reasons and may submit a corrected version."
        ]
      },
      "tiersTitle": "Levels of evidence",
      "tiersLead": "The source and evidence status remain visible beside each value. Categories are never combined without explicit labelling.",
      "tiers": {
        "peer_reviewed_published": [
          "Peer-reviewed publications",
          "Results that have passed independent peer review in a scientific journal."
        ],
        "published_not_peer_reviewed": [
          "Published without independent peer review",
          "Preprints, conference abstracts, theses, reports."
        ],
        "unpublished_research_data": [
          "Unpublished research data",
          "Data from research groups and clinics, shared with the Atlas after review."
        ],
        "unverified_report": [
          "Unverified reports",
          "Information that could not be verified. Never shown in charts."
        ]
      },
      "unpublishedTitle": "Unpublished data additionally require",
      "unpublished": {
        "authority": "confirmation that the researcher is authorised to share the data on behalf of the institution or data owner;",
        "permission": "permission to use the data and to display de-identified values publicly (an embargo is possible);",
        "deidentification": "a de-identification check: no direct or indirect identifiers;",
        "ethics": "confirmation of ethical requirements: ethics committee approval and patient consent for research use of the data."
      }
    },
    "credit": {
      "title": "Recognition of contributions",
      "note": "authorship is preserved",
      "items": [
        "Each included value is attributed to its primary publication, authors and DOI, or to the research group and institution that supplied unpublished data.",
        "Contributing groups are acknowledged in the Atlas in the form they choose.",
        "The Atlas welcomes scientific collaboration. Groups that make a substantial contribution may be invited to collaborate on joint scientific publications."
      ],
      "authorship": "Co-authorship is not automatic: it is discussed for each publication separately and determined by the accepted authorship criteria (ICMJE)."
    },
    "contact": {
      "title": "Contact the curator",
      "note": "scientific enquiries",
      "lead": "For scientific enquiries, data contributions or research collaboration, contact Ilya Mazunin, creator and curator of PGT-mt Atlas.",
      "inactiveTitle": "The contact channel is not active yet",
      "inactive": "The curator has not yet chosen an address for scientific enquiries, so there is no form or send button here. Once a channel is chosen, a link to write a message will appear here.",
      "interim": "Until then, the curator can be reached through the professional profiles listed on the curator’s page.",
      "curatorPage": "Curator’s page",
      "write": "Write to the curator",
      "includeTitle": "What to include in your first message",
      "include": [
        "your name, position, institution and country;",
        "the type of data: published (DOI) or unpublished;",
        "the mtDNA variant(s) and the number of cycles, embryos and outcomes;",
        "whether unsuccessful outcomes and complete cycles are included;",
        "your preferred secure method for sharing a data file."
      ],
      "subjectLabel": "Subject",
      "subject": "PGT-mt data contribution",
      "body": "Dear Dr Mazunin,\n\nName, position, institution, country:\nType of data (published — DOI / unpublished):\nmtDNA variant(s):\nNumber of cycles / embryos / outcomes:\nUnsuccessful outcomes and complete cycles included:\n\nI am not attaching any medical information about patients to this message.",
      "warning": "Do not attach medical information about patients to your enquiry. Data files are sent only after a secure channel has been agreed."
    }
  },
  "about": {
    "title": "About"
  },
  "patients": {
    "title": "For patients and families",
    "tocLabel": "On this page",
    "print": "Print this page with the questions",
    "more": "For more detail, see the chapters in PGT-mt fundamentals:"
  },
  "curator": {
    "title": "Ilya Mazunin",
    "role": "Creator and curator of PGT-mt Atlas",
    "contents": "Contents",
    "photoAlt": "Ilya Mazunin",
    "profilesLabel": "Profiles",
    "bio": "Scientific biography",
    "bioNote": "a path in science",
    "bioOther": "Биография на русском языке",
    "projectRole": "Role in the project",
    "research": "Research interests",
    "researchNote": "five areas",
    "career": "Scientific career",
    "careerNote": "timeline",
    "current": "Current appointments",
    "past": "Previous appointments",
    "education": "Education and degrees",
    "educationNote": "degrees",
    "teaching": "Textbooks",
    "projects": "Scientific projects and professional activities",
    "projectsNote": "beyond the lab",
    "professional": "Professional associations",
    "ventures": "Entrepreneurial activities",
    "pubs": "Selected publications",
    "pubsNote": "by research area",
    "pubsCount": "A selection from the {{original}} original research articles and {{reviews}} reviews listed in the CV; also {{patents}} patents and software registrations.",
    "profiles": "Research profiles and contact",
    "profilesNote": "get in touch",
    "researchProfiles": "Research profiles",
    "contact": "Contact",
    "collaboration": "Research collaboration",
    "patients": "Patient enquiries",
    "pending": "pending the curator’s approval",
    "noAdvice": "This site does not provide medical advice. Questions about your own circumstances should be discussed with your treating doctor and a clinical geneticist.",
    "coi": "Disclosure of interests",
    "coiNote": "transparency"
  },
  "methods": {
    "title": "Methods and limitations"
  },
  "fundamentals": {
    "title": "PGT-mt fundamentals",
    "kicker": "Scientific background and education",
    "lead": "A six-chapter course covering mitochondrial genetics, heteroplasmy, the genetic bottleneck, embryo development and biopsy, PGT-mt methods and interpretation of results. Scientific statements are linked to primary publications.",
    "howTo": "Each chapter offers two levels: “Essentials” explains the key concepts in accessible language; “Advanced” examines mechanisms, methodological limitations and primary sources. Both levels share the same diagrams and models.",
    "tocTitle": "Contents",
    "tocNote": "six chapters",
    "chapter": "Chapter {{n}}",
    "chapters": "Chapters",
    "modelsTitle": "Interactive models",
    "modelsNote": "illustrations of concepts",
    "modelsText": "The three educational models use no experimental data and do not predict individual outcomes. Published observations are presented in the scientific sections of the Atlas.",
    "bibliography": "Bibliography",
    "bibliographyNote": "sources cited throughout this section",
    "bibliographyLead": "Publications cited in the chapters of this section",
    "publicationsLink": "Publications",
    "bibliographyTail": " cited in the chapters of this section",
    "disclaimer": "Educational material, not a clinical protocol.",
    "level": "Reading level",
    "essentials": "Essentials",
    "advanced": "Advanced",
    "essentialsHint": "accessible explanation",
    "advancedHint": "mechanisms and sources",
    "figures": "Diagrams and models",
    "figuresNote": "for both levels",
    "toData": "From concepts to Atlas data",
    "toDataNote": "real data",
    "refs": "Chapter references",
    "refsNote": "with DOI",
    "refsChecked": "All DOIs were checked against PubMed records; exceptions are marked at the entry.",
    "prev": "Previous chapter",
    "next": "Next chapter",
    "allChapters": "All chapters",
    "usedIn": "Chapters",
    "refStatus": {
      "pubmed": "DOI checked against the PubMed record",
      "publisher": "DOI from the publisher PDF; not found in PubMed",
      "preprint": "preprint, not peer reviewed"
    },
    "het": {
      "title": "Heteroplasmy in a cell",
      "kind": "Interactive diagram",
      "slider": "Proportion of mtDNA carrying the pathogenic variant",
      "count": "{{m}} of {{n}} mtDNA molecules carry the pathogenic variant",
      "wt": "homoplasmy: wild-type mtDNA only",
      "het": "heteroplasmy: two types of mtDNA coexist in the cell",
      "mut": "homoplasmy: mtDNA with the pathogenic variant only",
      "legendWt": "wild-type mtDNA",
      "legendMut": "mtDNA with a pathogenic variant",
      "caption": "A cell with a nucleus and five mitochondria; rings are mtDNA molecules.",
      "note": "This diagram illustrates heteroplasmy; it does not model disease development. A real cell contains hundreds or thousands of mtDNA copies; 100 are shown here. A measurement from a sample averages across many cells, which may have different heteroplasmy levels. Functional consequences depend on the variant and tissue (Chapter 2)."
    },
    "thr": {
      "title": "The threshold effect",
      "kind": "Diagram",
      "x": "Heteroplasmy level, %",
      "y": "Respiratory chain function",
      "a": "variant / tissue A",
      "b": "variant / tissue B",
      "zone": "threshold",
      "caption": "The relationship between heteroplasmy and function is non-linear. At low proportions of mutant mtDNA, wild-type copies compensate for the defect; above the threshold, function declines steeply. The threshold differs between variants, tissues and respiratory complexes [@rossignol2003]. These schematic curves do not represent measured data."
    },
    "bn": {
      "title": "Genetic bottleneck simulator",
      "kind": "Interactive model",
      "h0": "Initial heteroplasmy level",
      "n": "Notional effective pool size N",
      "count": "Virtual oocytes",
      "redraw": "New random draw",
      "axis": "Heteroplasmy in a simulated oocyte, %",
      "start": "starting level",
      "summary": "Median {{med}}%; half of the values lie between {{q1}}% and {{q3}}%; range {{min}}–{{max}}%. Theoretical standard deviation: {{sd}} pp.",
      "banner": "A simplified stochastic model showing how the effective pool size affects variation in heteroplasmy among oocytes. It does not predict the distribution among an individual patient’s embryos.",
      "modelTitle": "Mathematical model",
      "model": "Each virtual oocyte receives N segregating units drawn at random and independently from a pool in which the proportion of mutant mtDNA is h₀. The number of mutant units K follows a binomial distribution, K ~ Bin(N, h₀); the oocyte’s heteroplasmy is h = K / N. The mean of h is h₀ and its variance is h₀(1 − h₀) / N. This is a single Wright–Fisher sampling step; the Kimura distribution used to describe segregation in carriers generalises it to repeated drift [@otten2018].",
      "limitsTitle": "Limitations of the model",
      "limits": [
        "N is a notional statistical quantity, not the physical number of mtDNA molecules in a cell; published estimates for carriers vary widely (for example, 10–145) [@otten2018].",
        "The model includes random drift only: it has no selection, preferential replication, cell death or oocyte maturation, which appear to matter for some variants (Chapter 3).",
        "Oocytes are modelled as independent and identically distributed; the model includes no within-family correlation, variation between cycles or age effect.",
        "There is no measurement error, no limit of detection and no distinction between oocyte, embryo and biopsy."
      ],
      "seed": "draw no. {{n}}"
    },
    "dev": {
      "title": "Preimplantation stages",
      "kind": "Diagram",
      "caption": "Human preimplantation development and the biopsy stages for PGT-mt: a blastomere on day 3 or several trophectoderm cells on days 5–6. Sizes are schematic.",
      "labels": {
        "d1": "day 1\nzygote",
        "d2": "day 2\n4 cells",
        "d3": "day 3\n8 cells",
        "d4": "day 4\nmorula",
        "d5": "day 5–6\nblastocyst",
        "bxBlastomere": "blastomere",
        "bxTe": "TE cells"
      }
    },
    "bx": {
      "title": "Explore the blastocyst and biopsy sample",
      "kind": "Interactive diagram",
      "choose": "Select a structure in the diagram or use the buttons",
      "caption": "A day-5–6 blastocyst: the inner cell mass on the left, the trophectoderm around the perimeter, the cavity (blastocoel) and a biopsy of several trophectoderm cells through an opening in the zona pellucida.",
      "origin": "Origin",
      "fate": "What it gives rise to",
      "diagnostic": "Diagnostic significance",
      "caveat": "Caveat",
      "labels": {
        "te": "trophectoderm",
        "icm": "inner\ncell mass",
        "cav": "blastocoel",
        "bx": "TE biopsy"
      },
      "parts": {
        "te": {
          "name": "Trophectoderm (TE)",
          "origin": "The outer cells of the embryo, which form an epithelial layer around the cavity as the blastocyst forms (days 5–6).",
          "fate": "The placenta and extra-embryonic membranes; TE cells do not contribute to foetal tissues.",
          "diagnostic": "TE cells are sampled for blastocyst-stage biopsy. In many studies, heteroplasmy levels in TE closely matched those in the ICM [@treff2012; @rubens2025; @tofilo2026].",
          "caveat": "Agreement does not mean identical levels. Individual TE cells may differ, so the number of cells in the biopsy sample matters [@rubens2025]."
        },
        "icm": {
          "name": "Inner cell mass (ICM)",
          "origin": "A cluster of cells at one pole of the blastocyst, set apart from the outer layer as the blastocyst forms.",
          "fate": "The embryo proper (and some extra-embryonic tissues); heteroplasmy in ICM derivatives is what matters clinically.",
          "diagnostic": "The ICM is not sampled during clinical biopsy, to preserve embryo viability. Its heteroplasmy level is studied by dissecting embryos that were unsuitable for transfer and donated for research [@tofilo2026; @rubens2025].",
          "caveat": "The blastocyst ICM is not yet foetal tissue; agreement between TE and ICM does not guarantee equal levels in every tissue of the child."
        },
        "bx": {
          "name": "Trophectoderm biopsy",
          "origin": "Several TE cells removed with a biopsy pipette through an opening in the zona pellucida, without touching the ICM.",
          "fate": "The placenta and extra-embryonic membranes; TE cells do not contribute to foetal tissues. In this case, however, the biopsy is used for genetic analysis.",
          "diagnostic": "The measured heteroplasmy level is an average across the sampled cells. Published data indicate that 5–10 cells are needed for a reliable estimate [@rubens2025].",
          "caveat": "This is a sample of cells from the lineage that will form the placenta, taken at one time point. The laboratory defines and validates the cell number, biopsy procedure and analytical methods."
        }
      }
    }
  },
  "patientContent": {
    "intro": "This section explains preimplantation genetic testing for mitochondrial DNA variants (PGT-mt), how it may help, and the limits of the information it provides. It can help you prepare for a discussion with a clinical geneticist; it does not replace that consultation.",
    "sections": [
      {
        "title": "What is mitochondrial DNA?",
        "paragraphs": [
          "Mitochondria help supply cells with energy. They contain a small genome of their own, called mitochondrial DNA (mtDNA), which children inherit from their mother.",
          "Cells typically contain hundreds or thousands of mtDNA copies. A pathogenic variant is a change that can cause disease. It is usually inherited from the mother, although it can arise for the first time. Often, only some mtDNA copies carry the variant. Their proportion is called the heteroplasmy level and is expressed as a percentage.",
          "In the same woman, heteroplasmy levels may differ between blood, urine, muscle and individual eggs (oocytes).",
          "PGT-mt is useful when a woman carries a pathogenic mtDNA variant in a heteroplasmic state: some copies carry the variant and others do not. If every copy carries it (homoplasmy), testing cannot identify an embryo with a lower proportion. If the disease is caused by a variant in a nuclear gene, a different test, PGT-M, is needed. Men do not pass mtDNA variants to their children."
        ]
      },
      {
        "title": "How PGT-mt works",
        "paragraphs": [
          "During in vitro fertilisation (IVF), cells are sampled on day 3 or days 5–6. Usually, this means one blastomere (an early embryo cell) on day 3, or several trophectoderm cells on days 5–6. Trophectoderm is the outer layer that contributes to the placenta. The laboratory measures the proportion of mtDNA carrying the variant in this sample.",
          "Embryos from the same woman may have different heteroplasmy levels. Testing helps identify the embryo with the lowest level, provided it falls below a cut-off agreed beforehand with the clinical geneticist for the specific variant. If all embryos exceed that cut-off, transfer is generally not recommended.",
          "The outcome cannot be predicted precisely before a cycle begins. The number of embryos with low heteroplasmy varies between patients and treatment cycles; some cycles yield none."
        ]
      },
      {
        "title": "Why is a percentage not a diagnosis?",
        "paragraphs": [
          "PGT-mt compares embryo heteroplasmy levels against an agreed cut-off. It cannot determine whether a future child will develop mitochondrial disease.",
          "The test measures the proportion of mtDNA carrying the variant in one or a few cells at a single time point. The child’s health depends on how that variant is distributed across tissues and organs later in development.",
          "There is no universal “safe” heteroplasmy percentage. Published reference values come from different types of evidence: 18% is an estimate based on muscle measurements in adult carriers, whereas 30% is an embryo-selection criterion used by one clinical programme. Thresholds differ between mtDNA variants, and no value guarantees a healthy child. Chapter 6 of the fundamentals course explains these distinctions."
        ]
      },
      {
        "title": "PGT-mt and chromosome testing (PGT-A)",
        "paragraphs": [
          "Chromosome number also affects the chances of pregnancy and the child’s health. PGT-mt can be combined on the same sample with preimplantation genetic testing for aneuploidy (PGT-A), which assesses chromosome number. The doctor and family decide whether to use it, taking maternal age into account.",
          "As maternal age increases, the proportion of embryos with the expected chromosome number falls. This often limits embryo selection more than mtDNA heteroplasmy does."
        ]
      },
      {
        "title": "The risk is reduced, not removed",
        "paragraphs": [
          "Published data indicate that PGT-mt reduces the risk of transmitting mitochondrial disease, but does not eliminate it.",
          "Discuss prenatal diagnosis with your doctor before any PGT-mt transfer, including when the variant was not detected in the biopsy sample. “Not detected” means that the test did not detect the variant within its analytical limits; it does not establish “0%”.",
          "There may be no embryo in which the variant is entirely absent. Doctors therefore plan follow-up during pregnancy and after birth in advance.",
          "Your doctor can also help prepare an individual plan for monitoring your child’s health and development after birth."
        ]
      },
      {
        "title": "What other options are there?",
        "paragraphs": [
          "PGT-mt is one of several reproductive options:"
        ],
        "items": [
          "Prenatal diagnosis — testing during pregnancy, using chorionic villi or amniotic fluid. For a homoplasmic variant, measuring its proportion alone cannot predict whether the child will be affected.",
          "Donor eggs — using oocytes from a healthy donor. The child will inherit nuclear DNA and mtDNA from the egg donor rather than the intended mother.",
          "Mitochondrial donation — transferring the patient’s nuclear material into a donor oocyte or zygote containing mtDNA without the pathogenic variant. Availability depends on national legislation. A small amount of maternal mtDNA may be carried over with the nuclear material, so the risk is reduced rather than eliminated."
        ],
        "closingTitle": "How do you choose?",
        "closing": "There is no single option that suits everyone. The choice depends on the mtDNA variant, family history, available techniques and access to treatment. Decisions are individual and should be made through an open discussion with your fertility specialist and clinical geneticist."
      }
    ],
    "questions": {
      "title": "What should you ask your clinical geneticist?",
      "intro": "A list of questions can help you remember what to ask at your appointment:",
      "groups": [
        {
          "title": "About your situation",
          "items": [
            "“Which pathogenic mtDNA variant do I carry, and what does current evidence tell us about it?”",
            "“What is the heteroplasmy level in my tissues, such as blood or epithelial cells, and what can this tell us about transmission to my eggs?”"
          ]
        },
        {
          "title": "About PGT and embryo selection",
          "items": [
            "“Which heteroplasmy cut-off do you recommend for embryo selection in my circumstances, and why?”",
            "“Will PGT-mt be performed at the same time as PGT-A (testing for chromosome abnormalities)?”"
          ]
        },
        {
          "title": "About planning and risks",
          "items": [
            "“What are our next steps and alternatives if this cycle produces no embryo with low heteroplasmy?”"
          ]
        },
        {
          "title": "About pregnancy and the child’s health",
          "items": [
            "“What special follow-up or prenatal diagnosis will be needed during pregnancy, and how will we monitor the child’s health after birth?”"
          ]
        }
      ],
      "closing": "You can save or print this list, bring it to your appointment and add notes during the discussion with your doctor."
    },
    "glossary": {
      "title": "Terms explained",
      "items": [
        [
          "mtDNA",
          "The small genome found in mitochondria."
        ],
        [
          "Pathogenic variant",
          "A DNA change that can cause disease."
        ],
        [
          "Heteroplasmy",
          "The presence of different versions of mtDNA in the same cell or sample."
        ],
        [
          "Homoplasmy",
          "The same variant in all mtDNA copies."
        ],
        [
          "Heteroplasmy level",
          "The proportion of mtDNA copies carrying the variant being tested, expressed as a percentage."
        ],
        [
          "Biopsy sample",
          "A small sample of cells removed for testing."
        ],
        [
          "Blastomere",
          "A cell of an early embryo."
        ],
        [
          "Trophectoderm",
          "The outer cell layer of a blastocyst, which contributes to the placenta."
        ],
        [
          "Oocyte and zygote",
          "An oocyte is an egg cell; a zygote is the cell formed after fertilisation."
        ],
        [
          "Nuclear material",
          "DNA in the cell nucleus, distinct from mtDNA."
        ]
      ]
    }
  },
  "interfaceCopy": {
    "Methods": {
      "collectedTitle": "Data collection",
      "datasetSummary": "Individual embryo heteroplasmy values were extracted from published studies. The current dataset contains {{v0}} values for {{v1}} mtDNA variants; {{v2}} blastocysts with measurements from several samples (TE biopsy, ICM, remaining TE or combined ICM+TE); and prenatal or postnatal measurements from {{v3}} foetuses and children with a matched heteroplasmy result from the transferred embryo. Primary publications were used where available. Values obtained from reviews because the primary source was unavailable are explicitly identified.",
      "incompleteCycles": "Studies do not always report every embryo in a cycle, so the dataset does not represent all embryos from the included cycles. Pooling published cases does not provide a clinical success rate for PGT-mt.",
      "sizeTitle": "Dataset size",
      "measure": "Measure",
      "count": "Count",
      "representationTitle": "How values are represented",
      "undetectedMeaning": "Where “0” represents a result reported as not detected, it does not establish complete molecular absence of the variant. The limit of detection is shown only when reported by the source.",
      "intervalMeaning": "If only an interval was published, its bounds are stored; no midpoint is imputed.",
      "derivationMeaning": "Each value is accompanied by information on how it was obtained. A derivation label is assigned only when the corresponding rule is documented in the supplementary workbook:",
      "landscapeValues": "Values in the “Between different embryos” section",
      "pointProvenance": "Every point leads back to its row in the supplementary workbook and to the publication (DOI).",
      "guidesTitle": "Reference lines on the charts",
      "checked": "Checked",
      "guideCaveat": "None of these values defines a safe threshold for an individual embryo. The three published reference values (18, 15–30 and 30%) address different questions and derive from different tissues, methods and outcomes.",
      "limitationsTitle": "Limitations",
      "heterogeneousStudies": "The dataset is descriptive and does not support a meta-analysis: studies differ in biopsy stage, analytical methods and limits of detection.",
      "publicationBias": "Successful cycles are published more often than unsuccessful ones; there are no data to correct for this bias.",
      "dependentEmbryos": "Embryos are not independent observations. Many come from the same patient and cycle, and variants are unevenly represented. A pooled proportion does not estimate individual risk.",
      "dependentChildSamples": "In embryo–child comparisons several measurements belong to the same child (different tissues, ages, methods, laboratories).",
      "scenarioModel": "The PGT-mt × PGT-A model calculates scenarios rather than individual predictions. Dependence between embryos is an assumed scenario parameter, not a correlation estimated from family data.",
      "classificationTitle": "Variant classification",
      "classificationMeaning": "Variant classifications are taken from the supplementary workbook. The Atlas does not independently classify variants, including on the basis of heteroplasmy level. Each classification is accompanied by its supporting statement in the primary publication and the date checked. This review did not cross-check the variants against MITOMAP or ClinVar.",
      "variant": "Variant",
      "variantClass": "Class",
      "basis": "Basis",
      "reportingTitle": "What to report about a PGT-mt cycle",
      "reportPatient": "Patient and cycle: age; family history; heteroplasmy levels in the carrier’s tissues; oocyte count; fertilisation and embryo development.",
      "reportEmbryo": "Embryo: biopsy day; morphology; PGT-A result; heteroplasmy in every sample — for every embryo, including those not transferred.",
      "reportMethod": "Analytical method: whole-genome amplification; target region; linearity; limit of detection; controls.",
      "reportOutcome": "Outcome: prenatal diagnosis and postnatal follow-up with tissue, age and method."
    },
    "Cases": {
      "primaryAttribution": "The primary source for each case is listed in the Source column: authors, publication and DOI."
    },
    "Concordance": {
      "pathogenicShort": "path.",
      "medianBar": "red bar",
      "rangeSummary": "Median range: {{v0}} pp ({{v1}} blastocysts with pathogenic variants), {{v2}} pp (HV2), {{v3}} pp (all {{v4}}); cleavage stage — {{v5}} pp (n = {{v6}}).",
      "range": "Range",
      "blastomeres": "Blastomeres",
      "rangePp": "Range (max − min), pp",
      "cells": "Cells",
      "coverage": "Depth, ×"
    },
    "Offspring": {
      "panelA": "A",
      "panelB": "B",
      "comparisonSummary": "Of {{v0}} comparisons with low embryo heteroplasmy, {{v1}} had low tissue heteroplasmy or a result reported as not detected. All comparisons classified here as discordant ({{v2}}) concern one child whose postnatal samples were analysed using a different method.",
      "referenceView": "In the reference view",
      "yes": "yes",
      "no": "no"
    },
    "ScienceIndex": {
      "landscapeSummary": "{{v0}} {{values}} across {{variants}} mtDNA {{variantWord}}",
      "concordanceSummary": "{{v0}} {{blastocysts}} + {{v1}} cleavage-stage {{embryos}}",
      "offspringSummary": "{{v0}} {{comparisons}}, {{v1}} foetuses and children",
      "scenarioSummary": "scenario calculation",
      "lead": "The Atlas has four scientific sections. Charts open in their reference view; additional filters are labelled “extended view”. Each point links to the primary publication and the relevant row in the source workbook."
    }
  },
  "methodLabels": {
    "countLabels": {
      "landscape_values": "embryo heteroplasmy values",
      "landscape_variants": "mtDNA variants in the heteroplasmy landscape",
      "concordance_blastocysts": "blastocysts with measurements from several samples",
      "concordance_records": "blastocyst sample records",
      "cleavage_embryos": "cleavage-stage embryos (two blastomeres)",
      "offspring_records": "embryo → offspring records",
      "offspring_children": "foetuses and children in all embryo–offspring records (including excluded records)",
      "offspring_children_exact_pair": "foetuses and children with matched embryo–tissue pairs in the plotted dataset",
      "publications": "publications"
    },
    "thresholdRoles": {
      "study_estimate": "risk estimate from a specific study",
      "programme_criterion": "working criterion of a clinical programme",
      "literature_range": "range cited in the literature",
      "chart_convention": "chart convention"
    }
  },
  "notFound": "Page not found",
  "pageContents": {
    "label": "On this page",
    "top": "Back to top"
  }
}

export default en
