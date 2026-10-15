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
    "tagline": "An open database of published mtDNA heteroplasmy values in embryos undergoing preimplantation genetic testing (PGT-mt), with a source for each value",
    "curated": "Created and curated by Ilya Mazunin",
    "preview": "Preview build. The site is not published; data and texts await the curator’s review.",
    "skip": "Skip to content"
  },
  "nav": {
    "fundamentals": "Fundamentals",
    "home": "Home",
    "science": "Data for specialists",
    "scienceIndex": "Sections overview",
    "patients": "For patients",
    "about": "About",
    "curator": "Ilya Mazunin",
    "data": "Table of values",
    "landscape": "Heteroplasmy Landscape",
    "concordance": "Embryo Concordance",
    "offspring": "Embryo, fetus and child",
    "model": "PGT-mt + PGT-A model",
    "cases": "Published cases",
    "sources": "Sources",
    "methods": "Methods & limitations",
    "contribute": "Contribute Data",
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
    "noClient": "If no mail app opens, copy the address and write from your own email."
  },
  "common": {
    "value": "Value",
    "variant": "mtDNA variant",
    "source": "Source",
    "stage": "Stage",
    "material": "Material",
    "sample": "Sample type",
    "derivation": "How the value was obtained",
    "note": "Note in the workbook",
    "provenance": "Provenance",
    "sheetRow": "sheet “{{sheet}}”, row {{row}}",
    "legacyId": "Former ID",
    "variantClass": "Variant classification",
    "classBasis": {
      "stated_in_source": "basis: {{source}}, {{locator}}; checked {{date}}",
      "implied_in_source": "implied: {{source}}, {{locator}}; checked {{date}}",
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
    "clickHint": "Click a point to see where the value comes from.",
    "n": "n",
    "notDetected": "not detected",
    "lod": "detection limit {{lod}}%",
    "interval": "only an interval was published: {{low}}–{{high}}%",
    "lessThan": "below {{v}}%",
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
    "fraction_label_mismatch": "different fraction type in ESM",
    "not_in_dataset": "not in the dataset",
    "missing_in_dataset": "missing from the dataset",
    "mismatch": "mismatch",
    "datasetKept": "The dataset value is unchanged pending the curator’s review.",
    "corrected": "corrected to ESM 2",
    "correctedNote": "The differences are corrected by a transparent correction layer: the site shows the value of the published ESM 2, and the original value of the supplementary workbook is kept.",
    "correctedTitle": "Corrected to the published source",
    "sourceValue": "in the supplementary workbook"
  },
  "home": {
    "trust": "Data updated {{date}} · {{n}} {{values}} from {{publications}} {{pubWord}} · Created and curated by Ilya Mazunin, DSc",
    "lead": "The Atlas presents published heteroplasmy levels and provides an interpretation of these values.",
    "k1": "embryo heteroplasmy values",
    "k2": "{{word}} with a biopsy compared against other embryo parts ({{icm}} with the inner cell mass)",
    "k3": "{{word}} in {{children}} fetuses and children; both results ND in {{ndChildren}} children",
    "sciTitle": "For specialists",
    "sciText": "Interactive data sections, a table of values with the provenance of every number, sources, methods and limitations.",
    "patTitle": "For patients",
    "fundTitle": "PGT-mt Fundamentals",
    "fundText": "A six-chapter course from mtDNA inheritance to interpreting a result — for clinicians, embryologists and students.",
    "ctaPatients": "Patients and families",
    "ctaSpecialists": "Specialists: the data",
    "ctaFundamentals": "PGT-mt Fundamentals — a six-chapter course",
    "patText": "What heteroplasmy is, what PGT-mt can do, and why the percentage in a report is not a diagnosis.",
    "caveat": "The dataset is descriptive: it is not a meta-analysis, does not define a safe threshold and does not replace a consultation with a clinical geneticist.",
    "kicker": "An independent scientific database",
    "explore": "Explore the data",
    "allSections": "Scientific sections",
    "figCaption": "A blastocyst; the first magnification shows a trophectoderm cell with its nucleus and small mitochondria; the second shows one mitochondrion with wild-type mtDNA and a pathogenic mtDNA variant.",
    "labels": {
      "te": "trophectoderm",
      "icm": "inner\ncell mass",
      "cell": "trophectoderm\ncell",
      "wt": "wild-type\nmtDNA",
      "variant": "pathogenic\nmtDNA variant"
    },
    "aboutTitle": "The database",
    "aboutNote": "what is inside",
    "k4": "{{word}} ({{doi}} with DOI)",
    "landscapeTitle": "Between different embryos",
    "concordanceTitle": "Within individual embryos",
    "concordanceSubtitle": "How closely heteroplasmy agrees between different parts of one embryo",
    "offspringSubtitle": "Changes in heteroplasmy over time — from embryo to child",
    "sectionsTitle": "Sections of the Atlas",
    "sectionsNote": "from biopsy to data",
    "biopsyCaption": "Trophectoderm biopsy: a few TE cells in which PGT-mt measures the proportion of mtDNA carrying a pathogenic variant.",
    "dataLink": "Full dataset",
    "sourcesLink": "Sources",
    "methodsLink": "Methods and limitations",
    "dataTitle": "Published values only",
    "dataText": "Primary sources are provided for all data used in the Atlas. The mathematical model is also built on these sources.",
    "mitoCaption": "A mitochondrion with cristae and circular mtDNA molecules.",
    "curatorBio": "Doctor of Biological Sciences, geneticist",
    "biography": "Scientific biography"
  },
  "landscape": {
    "title": "Heteroplasmy Landscape",
    "subtitle": "mtDNA heteroplasmy in embryos by variant and source",
    "lead": "Each point is a published or derived value for one embryo; derived values use hollow markers. Diamonds identify 1PN/3PN embryos, not transfer candidates. Columns within each variant separate sources.",
    "yAxis": "Heteroplasmy in embryo sample, %",
    "share": "Share ≤{{t}}%",
    "derivedLegend": "hollow marker — value obtained by averaging or read from a figure",
    "aggregate": "Merge ≥6 identical values (×n)",
    "highlightDerived": "Highlight derived values",
    "stageFilter": "Stage",
    "customThreshold": "Custom cut-off, %",
    "bands": "Neutral bands: 18% is a muscle-based estimate (Hellebrekers et al., 2012), not a threshold for an embryo biopsy; Newcastle: predominantly <30% (Hyslop et al., 2025). Shares use ≤ the boundary. These are not universal clinical boundaries.",
    "groupTitle": "Coinciding values: {{n}} observations",
    "groupHint": "The ×{{n}} point combines identical values from one source. Choose an observation:",
    "groupInTable": "The table below shows only the observations of this group.",
    "showAll": "Show all observations",
    "groupClick": "click to open all observations of the group",
    "main": "The share of embryos with heteroplasmy at or below 18% differs widely between variants: {{list}}. The shares describe published series, not the probability for a particular family.",
    "intervalNote": "For two m.10197G>A embryos only intervals were published: they are drawn as bars, no midpoint is imputed; an interval counts as ≤ cut-off only if its upper bound is at or below it.",
    "guide18": "18% estimate (muscle; Hellebrekers 2012)",
    "guide30": "30% criterion (Newcastle)"
  },
  "concordance": {
    "fractionCounts": "Ranges over three fractions (11 embryos) and two (29) are not directly comparable",
    "title": "Embryo Concordance",
    "subtitle": "How closely heteroplasmy agrees between fractions of one embryo",
    "lead": "The same blastocysts are shown in panels A and B (n = {{n}}); panel C adds {{c}} cleavage embryos from one m.3243A>G carrier (Monnot et al., 2011; two blastomeres each).",
    "main": "Fractions of one blastocyst usually have similar heteroplasmy: the median range is {{all}} pp, {{pat}} pp for pathogenic variants (maximum {{max}} pp); in {{share}}% of blastocysts with pathogenic variants the range is 5 pp or less.",
    "a": "A. Fractions of one embryo",
    "b": "B. Difference “fraction − TE biopsy”",
    "c": "C. Within-embryo range",
    "yA": "Heteroplasmy, %",
    "yB": "Δ heteroplasmy, pp",
    "yC": "Range, pp",
    "pathogenic": "pathogenic variants",
    "hv2": "HV2 — control embryos",
    "showHv2": "Show HV2",
    "band5": "grey band — ±5 percentage points, a conventional guide without a published source",
    "median": "median",
    "cleavage": "Cleavage, 2 blastomeres",
    "blastPat": "Blastocyst, pathogenic",
    "blastHv2": "Blastocyst, HV2",
    "remMinusBx": "remaining TE − biopsy",
    "icmMinusBx": "ICM − biopsy",
    "combMinusBx": "ICM+TE − biopsy",
    "combShort": "ICM+TE<br>(combined)",
    "hu": "Additional data: 16 samples of one blastocyst (Hu et al., 2026)",
    "huText": "A blastocyst with 17.8% m.3250T>C in the biopsy was split into 16 samples of 3–5 cells (the ICM was not isolated). Not plotted: the spread of small samples is not comparable with that of large fractions.",
    "verifyNote": "Tofilo et al., 2026: the embryo 6 values (ICM, remaining TE) and the fraction category of embryos 3 and 4 (combined ICM+TE fraction) follow the published ESM 2; the original values of the supplementary workbook are shown in the embryo card. In this study the “ICM” fraction is the ICM together with adherent TE cells (“ICM+”)."
  },
  "offspring": {
    "bothNDPair": "ND → ND",
    "bothNDChildren": "Both results are ND in {{children}} fetuses and children ({{pairs}} pairs); these are not exact zero measurements.",
    "bothND": "ND → ND: {{n}} pairs",
    "recordSummary": "{{records}} records, {{pairs}} exact pairs in {{children}} fetuses and children",
    "childSummary": "Embryo heteroplasmy is low for {{low}} of {{all}} fetuses and children; {{concordant}} of these have low or undetected values in every tissue. Laboratories disagree for one child (C5).",
    "deltaBound": "Tissue-only ND gives a lower Δ bound (open marker and upward arrow); embryo-only ND gives an upper bound. ND → ND pairs are counted below the group and are not plotted at Δ = 0.",
    "ndBand": "ND (no numeric axis)",
    "title": "Embryo, fetus and child",
    "subtitle": "Heteroplasmy in the transferred embryo and in fetal or child tissues",
    "lead": "Comparisons “transferred embryo — fetal or child tissue”. They are not independent: several tissues and time points of one child.",
    "main": "{{pairs}} in {{children}} fetuses and children. {{disc}}",
    "discOne": "All embryo–tissue discrepancies ({{ids}}) concern one child and come from re-analysis with a different method.",
    "discMany": "Embryo–tissue discrepancies: {{ids}}.",
    "pairForms": [
      "comparison",
      "comparisons",
      "comparisons"
    ],
    "xA": "Transferred embryo, %",
    "yA": "Fetal / child tissue, %",
    "yB": "Δ (tissue − embryo), pp",
    "prenatal": "prenatal material",
    "blood": "blood / cord blood",
    "otherPost": "other postnatal tissues",
    "identity": "y = x (identical values)",
    "showExcluded": "Show excluded and censored records",
    "lowSpread": "Undetected embryo values occupy a separate ND band without a numeric axis; exact values are available in the table.",
    "dependency": "Comparisons: {{pairs}}; fetuses and children: {{children}}. C5 contributes {{k}} repeat measurements out of {{pairs}}.",
    "excludedTitle": "Not plotted",
    "colorByVariant": "Colour — mtDNA variant, shape — material, labels — case codes."
  },
  "model": {
    "without3pn": "Additional denominator for m.14487T>C excluding the 3PN embryo: {{sign}}18% — {{k}}/{{n}}. The main dataset retains all published embryo values; a 3PN embryo is not a transfer candidate.",
    "versionLabel": "Model version: {{v}}",
    "title": "PGT-mt × PGT-A Model",
    "subtitle": "Joint selection scenarios and sensitivity to assumptions",
    "banner": "The calculation shows the probability of passing two laboratory criteria for a given number of blastocysts. Input fractions come from heterogeneous published series; an individual clinical probability has not been estimated.",
    "yAxis": "P(≥1 suitable)",
    "xAxis": "Number of blastocysts, N",
    "panelTabs": "Scenario for the euploid blastocyst share",
    "panel": "Scenario E = {{p}}",
    "pHet": "H is the share of published heteroplasmy values at or below the selected boundary; it describes the included series, not an individual patient.",
    "pEupl": "E is the scenario share of euploid blastocysts",
    "pEuplSource": "Reference",
    "meaningTitle": "What the result means",
    "meaning": "P(≥1) is the model probability that at least one of N blastocysts meets both model criteria: euploid by PGT-A and with heteroplasmy at or below the chosen threshold. It is not the probability of pregnancy, of a live birth or of a healthy child, and not a prediction for an individual patient.",
    "improvement": "Family and variant effects require complete linked cycles from several independent families. Scenario euploid shares are not calibrated by age.",
    "formula": "Formulas",
    "assumptions": "Assumptions (not proven)",
    "a1": "q = H × E: heteroplasmy and chromosome status are assumed independent;",
    "a2": "at ρ = 0, blastocysts are independent trials with the same probability; N is a given number of blastocysts, not an oocyte count or mean cycle yield;",
    "a3": "at ρ > 0, embryos share a random joint pass probability. The selected ρ is a scenario value and has not been estimated from Atlas;",
    "a4": "H describes pooled published records with different stages and methods; E is a scenario share of euploid blastocysts.",
    "tableTitle": "P(≥1) for all variants in the dataset",
    "smallN": "small n — the share is unstable",
    "dashed": "thin long dashes — 30% cut-off (where different from 18%); main-line patterns distinguish variants",
    "nMax": "N up to",
    "boundary": "Boundary rule",
    "rhoLabel": "Embryo dependence, ρ",
    "independent": "upper bound: independent embryos",
    "rhoNote": "ρ concerns the binary event of passing both tests. It is a specified beta-binomial correlation, not an observed correlation of heteroplasmy percentages. All variants use the same selected scenario value.",
    "showRange": "Show sensitivity to a conditional interval for H",
    "intervalNote": "Bands transform a conditional 95% Wilson interval for H at fixed E and ρ. The binomial interval assumes independent observations; it does not account for families, publication selection or measurement error. At ρ > 0, the band remains input sensitivity, not an estimated interval for dependent embryos or clinical success.",
    "iid95": "95% Wilson CI (ignoring clustering)",
    "inputSummary": "The input contains {{n}} records from {{sources}} publications: {{blastocysts}} are explicitly labelled blastocysts, and {{unspecified}} have no specified stage. {{nd}} not-detected records lack a detection limit. This is a mixed set of published observations, not complete independent cycles.",
    "inputIntervalNote": "H = k/n uses the included records for each variant. The full dataset mixes cleavage embryos, 3PN embryos and transferred-only values (Hyslop 2025, Thorburn 2009); selection for low heteroplasmy biases H upward. The filter keeps explicitly identified blastocyst TE biopsies only. Intervals use their upper bound; undetected values are assumed below the boundary. Wilson intervals ignore clustering.",
    "crossing": "Threshold-crossing intervals: {{n}}",
    "sampleComposition": "Input sample composition",
    "sourceCount": "Publications: {{n}}",
    "stageCount": "Blastocysts: {{b}}; stage unspecified: {{u}}",
    "ndCount": "Not detected without LOD: {{n}}",
    "tableN": "Blastocyst count for the table, N",
    "tableAge": "Age {{age}}",
    "vus": "Variant of uncertain significance (VUS)",
    "dependentFormula": "For 0 < ρ < 1, the shared probability Q follows a beta distribution with mean q. Embryos are conditionally independent given Q; integrating Q induces positive dependence. At ρ = 0, the binomial limit is used.",
    "boundsTitle": "When independence of the two tests is unknown",
    "boundsNote": "Marginal H and E determine only bounds on the joint q for one embryo. The table shows these bounds, not confidence intervals. They are conditional on the input fractions and do not describe dependence between embryos.",
    "evidenceTitle": "Joint results in primary series",
    "evidenceNote": "The fixed endpoint here is H≤18% and strict euploidy. Each denominator is the TE blastocysts of one published series. These small series describe specific carriers; their fractions do not calibrate scenario curves for new families.",
    "confirmedEuploid": "Confirmed euploid",
    "jointPass": "Passed both criteria",
    "evidence": {
      "tofilo": "One carrier; one of six biopsies meets both criteria.",
      "hu": "One carrier of a variant of uncertain significance (VUS); the result does not characterise pathogenic variants.",
      "ji": "One patient, two cycles; PGT-A informative for 14/15. The remaining blastocyst has H=99.4%, so it fails the joint criterion regardless of its unknown ploidy.",
      "spathB": "Patient B. All biopsies were not detected; LOD unspecified. Fractions assume ND below 18%. Constant H status cannot test independence of the two tests.",
      "spathD": "Patient D. Fractions involving ND assume a detection limit below 18%. Joint 3/9 differs from the product of marginals 8/27; this small series cannot establish association."
    },
    "salleveltNote": "Sallevelt 2017: 3/22 numerical records below 18% include a low value in a 3PN embryo. Confirmed diagnostic yield for 2PN is 2/23. Four analyses are inconclusive due to a positive blank; accepting the other 19 classifications bounds the below-18% fraction at 2/23–6/23. These are incomplete-data bounds, not a confidence interval.",
    "publicationCarriers": "Carriers reported per publication (do not sum)",
    "correlationExample": "Teaching example using current data: H = {{h}}, E = {{e}}, N = 6 gives {{p0}} at ρ = 0 and {{p2}} at ρ = 0.2. This is a scenario calculation, not an individual prediction.",
    "scenarioNote": "Values are not assigned to ages.",
    "symbols": "H — share at or below the selected boundary; E — scenario euploid blastocyst share; ◆ model calculation.",
    "teOnly": "Blastocyst TE biopsies only",
    "carrierCaveat": "With 1–2 carriers, the share describes these women, not the variant. Unknown record linkages remain unestablished. Publication-level counts are separate; the same woman can appear in several papers, so these counts must not be summed.",
    "unknown": "not established",
    "carriers": "carriers: {{n}}; records: {{records}}"
  },
  "data": {
    "maternalCluster": "Maternal cluster",
    "embryoSample": "Embryo sample",
    "day3Blastomere": "One day-3 blastomere",
    "atlasRow": "Atlas source worksheet, row {{row}}",
    "countSummary": "{{records}} records, including {{pairs}} exact pairs in {{children}} fetuses and children. {{pubs}} publications, including {{embryoPubs}} with embryo values.",
    "locator": "Source location",
    "title": "Table of values",
    "lead": "The full set of observations with the provenance of every value. Tables of the normalised database are available as CSV.",
    "embryos": "Embryos (Heteroplasmy Landscape)",
    "offspring": "Offspring (Embryo-to-Offspring)",
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
    "lead": "Published cases and series: heteroplasmy values, tissues and outcome categories. Personal medical details are omitted; numerical values retain attribution.",
    "range": "Range in the embryo pool",
    "transferred": "Transferred embryo",
    "offspring": "Fetal / child tissues",
    "dataType": "Data type",
    "origin": "Where the value comes from"
  },
  "sources": {
    "verificationSummary": "DOIs checked against PubMed on 11 October 2026; PMIDs are shown in the table. Exceptions identify publications without a PubMed record.",
    "title": "Sources",
    "lead": "Publications that supply the dataset values, reference lines and model parameters. Authorship and DOI of the primary studies are given for every entry.",
    "rolesTitle": "Role on the site",
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
      "model_parameter": "PGT-mt + PGT-A model",
      "excluded_data": "considered, not included",
      "classification_basis": "variant classification"
    },
    "roles": {
      "observations": "observations: individual heteroplasmy values ({{section}})",
      "case_summary": "summary of a published case or series (Cases)",
      "threshold": "reference line on the charts ({{section}})",
      "model_parameter": "scenario model parameter: share of euploid blastocysts by age",
      "excluded_data": "data reviewed and not included (reason in Methods)",
      "classification_basis": "basis for the classification of {{section}}"
    },
    "sections": {
      "heteroplasmy-landscape": "heteroplasmy landscape",
      "embryo-concordance": "embryo concordance",
      "embryo-to-offspring": "embryo to offspring"
    },
    "doiException": "DOI exception",
    "records": "records in the dataset",
    "verified": "Verified",
    "supplementary": "Supplementary material"
  },
  "contribute": {
    "title": "Contribute Data",
    "kicker": "International contributions to the evidence base",
    "motto": "Every outcome matters. Negative results are data, too.",
    "lead": "PGT-mt Atlas is open to research groups and clinics worldwide. If you have performed PGT-mt or studied embryos carrying mtDNA variants, your results — including unsuccessful cycles and embryos that were never transferred — help build a more complete and more honest picture of what the method can do.",
    "downloadTemplate": "Download the template (.xlsx)",
    "contactLink": "Contact the curator",
    "templateMeta": "PGT-mt Research Data Submission · version {{v}} · {{date}} · Excel",
    "why": {
      "title": "Why every outcome matters",
      "note": "publication bias",
      "p1": "Positive PGT-mt results are published more often than negative ones. A cycle that ends with the birth of a healthy child is more likely to reach a journal than a cycle with no suitable embryo, a transfer without implantation or a pregnancy loss.",
      "p2": "As a result, the literature may give a biased estimate: it can look as if a suitable embryo is almost always found and the outcome is predictable. The failure rate stays invisible, although it is exactly what families need to know in counselling.",
      "p3": "The Atlas collects every outcome with the same care. A negative result does not weaken the evidence base — it makes it more accurate."
    },
    "cycles": {
      "title": "Why complete cycles matter",
      "note": "from oocyte to child",
      "lead": "To estimate how often PGT-mt leads to a transfer and a birth, the denominator is needed: every oocyte and every embryo of the cycle, not only the transferred ones. Each step below is a point where a cycle can end, and every such outcome is data.",
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
      "lossesTitle": "Where a cycle can end — and all of it counts:",
      "p": "The distribution of heteroplasmy across all embryos of a cycle — including aneuploid, arrested and non-transferred ones — shows how an mtDNA variant is transmitted through oogenesis and early development. Without them, the estimate of risk for a family is incomplete."
    },
    "interest": {
      "title": "What we are interested in",
      "note": "studies and observations",
      "items": [
        "Complete PGT-mt cycles — every started cycle, including those that ended without a transfer.",
        "Heteroplasmy values for every embryo, not only for the transferred ones; PGT-A and morphology results.",
        "Studies of embryos donated for research: trophectoderm biopsy versus inner cell mass and remaining trophectoderm, repeated biopsies, single blastomeres.",
        "Oocytes and polar bodies; heteroplasmy in the carrier’s tissues.",
        "Prenatal diagnosis and postnatal follow-up of children, with the tissue, age and method stated.",
        "Negative and unexpected results: no suitable embryo, no implantation, pregnancy losses, discordance between the embryo and fetal tissues.",
        "Methodological data: validation, limit of detection, linearity, effects of whole-genome amplification, repeated measurements.",
        "Published studies not yet in the Atlas — a reference and where in the paper the values are is enough."
      ]
    },
    "how": {
      "title": "How to contribute",
      "note": "step by step",
      "steps": [
        [
          "Write to the curator",
          "Briefly describe the study, the amount of data and its publication status."
        ],
        [
          "Fill in the template",
          "Download PGT-mt Research Data Submission and complete the sheets that apply to your data. A published study can also be proposed simply by reference."
        ],
        [
          "Agree on the transfer",
          "The curator will propose a secure channel for the file. Patient data are never sent by unencrypted e-mail and are never uploaded to the website or to GitHub."
        ],
        [
          "Scientific review",
          "The curator checks completeness, consistency, overlap with published data, authority, permissions, de-identification and ethics, and asks questions where needed."
        ],
        [
          "Decision and credit",
          "You receive a decision with its reasons. Included values appear in the Atlas with their source and authors."
        ]
      ]
    },
    "template": {
      "detailsTitle": "Template in detail: sheets, filling rules, de-identification",
      "title": "A scientific standard for data submission",
      "note": "Excel template",
      "lead": "The PGT-mt Research Data Submission template describes the minimal data set of a PGT-mt cycle — patient and cycle, embryo, method and outcome — and extends it with the fields needed for complete cycles and negative results. Linked sheets describe every oocyte, embryo, sample and outcome without direct identifiers.",
      "sheetsTitle": "Sheets of the template",
      "fields": "{{n}} fields, {{r}} required",
      "extra": "Also included: instructions (EN/RU), a Data Dictionary with the definition, unit and allowed values of every field, and drop-down lists.",
      "rulesTitle": "Zero, missing and the detection limit are different",
      "rules": [
        "A blank cell means “not reported / unknown”.",
        "0 in a count means “counted, none”.",
        "Below the detection limit is its own value type (below_lod) with the limit stated — not 0.",
        "A published interval or bound is kept as published; no midpoint is imputed.",
        "A failed or not-performed analysis stays in the table — it is part of the cycle."
      ],
      "privacyTitle": "No direct identifiers",
      "privacy": "The template has no fields for names, initials, exact dates of birth or procedures, addresses, patient contacts or medical record numbers. Age is recorded in groups, time points are relative (embryo day, gestational week, child age in months) and all codes are de-identified."
    },
    "review": {
      "title": "Scientific review",
      "note": "the path of data",
      "lead": "Every submission goes through the same statuses. Nothing that is submitted reaches the public charts automatically: inclusion is a separate decision by the curator, made as a reviewed change to the dataset.",
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
          "The enquiry or file is registered; nothing is shown."
        ],
        "under_review": [
          "Under review",
          "Completeness, consistency, overlap with published data, authority and de-identification; questions to the authors."
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
      "tiersLead": "The origin of the data stays visible next to every value. Levels are never mixed without an explicit label.",
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
        "Every included value carries its primary publication, its authors and DOI — or the research group and institution that shared unpublished data.",
        "Contributing groups are acknowledged in the Atlas in the form they choose.",
        "The Atlas welcomes scientific collaboration. Groups that make a substantial contribution may be invited to collaborate on joint scientific publications."
      ],
      "authorship": "Co-authorship is not automatic: it is discussed for each publication separately and determined by the accepted authorship criteria (ICMJE)."
    },
    "contact": {
      "title": "Contact the curator",
      "note": "scientific enquiries",
      "lead": "Scientific questions and offers of data or collaboration go to the curator of PGT-mt Atlas, Ilya Mazunin.",
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
        "whether negative outcomes and complete cycles are included;",
        "which way of transferring a file is acceptable to you."
      ],
      "subjectLabel": "Subject",
      "subject": "PGT-mt data contribution",
      "body": "Dear Dr Mazunin,\n\nName, position, institution, country:\nType of data (published — DOI / unpublished):\nmtDNA variant(s):\nNumber of cycles / embryos / outcomes:\nNegative outcomes and complete cycles included:\n\nI am not attaching any medical information about patients to this message.",
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
    "more": "Want more detail? Chapters of the PGT-mt Fundamentals course:"
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
    "research": "Research directions",
    "researchNote": "five directions",
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
    "pubsNote": "by research direction",
    "pubsCount": "A selection from the {{original}} original research articles and {{reviews}} reviews listed in the CV; also {{patents}} patents and software registrations.",
    "profiles": "Research profiles and contact",
    "profilesNote": "get in touch",
    "researchProfiles": "Research profiles",
    "contact": "Contact",
    "collaboration": "Research collaboration",
    "patients": "Patient enquiries",
    "pending": "pending the curator’s approval",
    "noAdvice": "This site does not provide medical advice; questions about an individual situation should be discussed with a treating physician and a clinical geneticist.",
    "coi": "Disclosure of interests",
    "coiNote": "transparency"
  },
  "methods": {
    "title": "Methods & limitations"
  },
  "fundamentals": {
    "title": "PGT-mt Fundamentals",
    "kicker": "A scientific and educational section",
    "lead": "A six-chapter course: mitochondrial genetics, heteroplasmy, the genetic bottleneck, embryo development and biopsy, the technology of PGT-mt and the interpretation of its results. Every scientific statement is linked to a primary publication.",
    "howTo": "Each chapter has two reading levels: “Essentials” — an accessible explanation of the key concepts; “Advanced” — mechanisms, methodological caveats and primary sources. Diagrams and models are shared by both levels.",
    "tocTitle": "Contents",
    "tocNote": "six chapters",
    "chapter": "Chapter {{n}}",
    "chapters": "Chapters",
    "modelsTitle": "Interactive models",
    "modelsNote": "illustrations of concepts",
    "modelsText": "The three educational models use no experimental results and give no individual predictions. Real published values are in the scientific sections of the Atlas.",
    "bibliography": "Bibliography",
    "bibliographyNote": "all sources of the section",
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
    "refs": "Sources of this chapter",
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
      "note": "This illustrates the concept of heteroplasmy; it is not a model of disease development. A real cell contains hundreds or thousands of mtDNA copies; 100 are shown here. The level measured in a sample is an average over many cells that may differ from one another, and the functional consequences depend on the variant and the tissue (Chapter 2)."
    },
    "thr": {
      "title": "The threshold effect",
      "kind": "Diagram",
      "x": "proportion of mutant mtDNA, %",
      "y": "respiratory-chain function",
      "a": "variant / tissue A",
      "b": "variant / tissue B",
      "zone": "threshold",
      "caption": "A non-linear relationship between heteroplasmy and function: while the proportion of mutant mtDNA is small, normal molecules compensate for the defect; above the threshold, function falls steeply. The position of the threshold differs between variants, tissues and respiratory complexes [@rossignol2003]. The curves are schematic and do not represent real measurements."
    },
    "bn": {
      "title": "Genetic bottleneck simulator",
      "kind": "Interactive model",
      "h0": "Starting heteroplasmy",
      "n": "Notional effective pool size N",
      "count": "Virtual oocytes",
      "redraw": "New random draw",
      "axis": "heteroplasmy of a virtual oocyte, %",
      "start": "starting level",
      "summary": "Median {{med}}%; half of the values lie between {{q1}}% and {{q3}}%; range {{min}}–{{max}}%. Theoretical standard deviation: {{sd}} pp.",
      "banner": "A simplified stochastic model. It shows how the size of the effective pool affects the spread of heteroplasmy between oocytes; it does not predict the distribution of any individual patient’s embryos.",
      "modelTitle": "Mathematical model",
      "model": "Each virtual oocyte receives N segregating units drawn at random and independently from a pool in which the proportion of mutant mtDNA is h₀. The number of mutant units K follows a binomial distribution, K ~ Bin(N, h₀); the oocyte’s heteroplasmy is h = K / N. The mean of h is h₀ and its variance is h₀(1 − h₀) / N. This is a single Wright–Fisher sampling step; the Kimura distribution used to describe segregation in carriers generalises it to repeated drift [@otten2018].",
      "limitsTitle": "Limitations of the model",
      "limits": [
        "N is a notional statistical quantity, not the physical number of mtDNA molecules in a cell; published estimates for carriers vary widely (for example, 10–145) [@otten2018].",
        "The model includes random drift only: it has no selection, preferential replication, cell death or oocyte maturation, which appear to matter for some variants (Chapter 3).",
        "Oocytes are independent and identical; there is no within-family correlation, no variation between cycles and no age effect.",
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
      "title": "Blastocyst & biopsy explorer",
      "kind": "Interactive diagram",
      "choose": "Select a structure in the diagram or with a button",
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
          "fate": "The placenta and extra-embryonic membranes; TE cells do not contribute to fetal tissues.",
          "diagnostic": "The source of cells for blastocyst-stage biopsy. In many studies the TE level closely matched the ICM level [@treff2012; @rubens2025; @tofilo2026].",
          "caveat": "Agreement is not identity: individual TE cells can differ, which is why the number of cells in the biopsy matters [@rubens2025]."
        },
        "icm": {
          "name": "Inner cell mass (ICM)",
          "origin": "A cluster of cells at one pole of the blastocyst, set apart from the outer layer as the blastocyst forms.",
          "fate": "The embryo proper (and some extra-embryonic tissues); heteroplasmy in ICM derivatives is what matters clinically.",
          "diagnostic": "The ICM is not sampled during clinical biopsy for the safety of the embryo. This measure is studied only by dividing embryos that were unsuitable for transfer and donated for scientific purposes into separate parts [@tofilo2026; @rubens2025].",
          "caveat": "The blastocyst ICM is not yet fetal tissue; agreement between TE and ICM does not guarantee equal levels in every tissue of the child."
        },
        "bx": {
          "name": "Trophectoderm biopsy",
          "origin": "Several TE cells removed with a biopsy pipette through an opening in the zona pellucida, without touching the ICM.",
          "fate": "The placenta and extra-embryonic membranes; TE cells do not contribute to fetal tissues. In this case, however, the biopsy is used for genetic analysis.",
          "diagnostic": "The measured heteroplasmy is an average over the biopsied cells. According to published data, 5–10 cells are needed for a reliable estimate [@rubens2025].",
          "caveat": "It is a sample of cells of the future placenta at one point in time. The number of cells and the biopsy and analysis methods are defined and validated by the laboratory."
        }
      }
    }
  },
  "patientContent": {
    "intro": "This section explains what PGT-mt is and how this laboratory technology may help you. We also explicitly describe the limitations of PGT-mt and the predictions made using this technology. The text will help you prepare for a conversation with a clinical geneticist but will not replace that consultation.",
    "sections": [
      {
        "title": "What mitochondrial DNA is",
        "paragraphs": [
          "Mitochondria are the “power stations” of cells. They have their own small DNA (mtDNA), which a child inherits only from the mother.",
          "Each cell contains hundreds or thousands of mtDNA copies. A pathogenic variant (mutation) is usually inherited from the mother and arises for the first time less often. Often it is present in only some copies. The proportion of altered copies is called the heteroplasmy level and is expressed as a percentage.",
          "One woman’s proportion of altered mtDNA may differ in blood, urine, muscle and different egg cells.",
          "PGT-mt helps only when a woman has a pathogenic mtDNA variant in a heteroplasmic state: her cells contain both altered and normal copies. If all copies are altered (homoplasmy), an embryo with a lower proportion cannot be selected. If disease is caused by a nuclear DNA gene, a different test (PGT-M) is needed. A male carrier does not pass the mtDNA variant to his children."
        ]
      },
      {
        "title": "How PGT-mt works",
        "paragraphs": [
          "During IVF, cells are sampled on day 3 or days 5–6: usually one blastomere (an early embryo cell) on day 3, or several trophectoderm cells (the outer layer that forms the placenta) on days 5–6. The proportion of altered mtDNA is measured in them.",
          "Embryos from one woman can differ in the proportion of altered mtDNA. Testing helps select the embryo with the lowest proportion if it is below a cut-off agreed in advance with the geneticist for your variant. If all embryos are above it, transfer is generally not recommended.",
          "Unfortunately, the exact outcome cannot be predicted before a cycle begins. Some patients will have more embryos with a low mutant mtDNA percentage, others fewer, and in some cycles there may be none."
        ]
      },
      {
        "title": "Why is the percentage not a diagnosis?",
        "paragraphs": [
          "The PGT-mt result compares embryos using an agreed cut-off for the proportion of altered mtDNA; it does not diagnose the future child.",
          "The test measures the proportion of altered mtDNA in only one or a few cells at one moment. The child’s health depends on its future distribution across tissues and organs.",
          "There is no universal “safe” percentage in medicine. Numbers in scientific papers were obtained in different ways: 18% is an estimate based on mutation levels in the muscle of adult carriers, and 30% is a working embryo-selection criterion of one clinical programme. Thresholds differ between mtDNA variants, and no number guarantees a healthy child. See chapter 6 of the Fundamentals for details."
        ]
      },
      {
        "title": "PGT-mt and chromosome testing (PGT-A)",
        "paragraphs": [
          "The embryo’s chromosome number also matters for pregnancy and the child’s health. PGT-mt can be combined with PGT-A, a chromosome-number test, on the same sample. The doctor and family decide whether it is needed, taking the woman’s age into account.",
          "With maternal age, the share of embryos with the correct chromosome number falls; this often limits selection more than mtDNA does."
        ]
      },
      {
        "title": "The risk is reduced, not removed",
        "paragraphs": [
          "According to published data, PGT-mt reduces the risk of passing on the disease but does not remove it completely.",
          "After any PGT-mt transfer, even if altered mtDNA was not detected in the biopsy, discuss prenatal diagnosis with the doctor in advance. “Not detected” means below the method’s sensitivity, not “0%”.",
          "There may be no embryo entirely without altered mtDNA. Doctors then plan follow-up during pregnancy and after birth in advance.",
          "Your doctor can also help prepare an individual plan for monitoring your child’s health and development after birth."
        ]
      },
      {
        "title": "What other options are there?",
        "paragraphs": [
          "PGT-mt is only one possible route. Modern medicine also considers other options:"
        ],
        "items": [
          "Prenatal diagnosis — testing during an established pregnancy. Chorionic villi or amniotic fluid are examined; this assessment of the proportion is uninformative in homoplasmy.",
          "Donor oocytes (egg cells) — using eggs from a healthy donor. The child will not be genetically related to the mother.",
          "Mitochondrial donation — transfer of the patient’s nuclear material into a donor oocyte or zygote with non-pathogenic mtDNA. Availability depends on the country’s legislation. A small amount of maternal mtDNA may accompany the nuclear material, so risk is reduced but not eliminated."
        ],
        "closingTitle": "How do you choose?",
        "closing": "There is no single solution for everyone. The best next step depends on the specific mtDNA variant, family history, technical possibilities and availability of methods. The final decision is always individual, made in an open discussion with your fertility specialist and geneticist."
      }
    ],
    "questions": {
      "title": "What should you ask your clinical geneticist?",
      "intro": "A list of questions can help you remember what to ask at your appointment:",
      "groups": [
        {
          "title": "About your situation",
          "items": [
            "“Which pathogenic mtDNA variant has been identified in me, and what does modern medicine know about it?”",
            "“What percentage of mutant mtDNA is in my own tissues (for example, blood or epithelial cells), and how does this affect the chance of transmission to egg cells?”"
          ]
        },
        {
          "title": "About PGT and embryo selection",
          "items": [
            "“Which cut-off for the proportion of altered mtDNA do you recommend for embryo selection in my case, and why?”",
            "“Will PGT-mt be performed at the same time as PGT-A (testing for chromosome abnormalities)?”"
          ]
        },
        {
          "title": "About planning and risks",
          "items": [
            "“What are our next steps and alternatives if this cycle produces no embryo with a low mutant mtDNA percentage?”"
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
          "The small DNA genome of mitochondria."
        ],
        [
          "Pathogenic variant",
          "A DNA change that can cause disease."
        ],
        [
          "Heteroplasmy",
          "Coexistence of altered and normal mtDNA copies."
        ],
        [
          "Homoplasmy",
          "The same variant in all mtDNA copies."
        ],
        [
          "Heteroplasmy level",
          "The proportion of altered mtDNA, expressed as a percentage."
        ],
        [
          "Biopsy",
          "Cells sampled for testing."
        ],
        [
          "Blastomere",
          "A cell of an early embryo."
        ],
        [
          "Trophectoderm",
          "The outer blastocyst layer that forms the placenta."
        ],
        [
          "Oocyte and zygote",
          "An egg cell and the cell after fertilisation."
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
      "collectedTitle": "What was collected",
      "datasetSummary": "Heteroplasmy values were extracted from primary publications for the embryos whose individual values were published. Current version: {{v0}} values for the {{v1}} mtDNA variants included in the dataset; {{v2}} blastocysts with several fractions measured (TE biopsy, ICM, remaining TE or a combined ICM+TE fraction); post-implantation data for {{v3}} children whose transferred-embryo level is known. Values come from primary publications; reviews were used only where the original is unavailable, and this is flagged.",
      "incompleteCycles": "Publications do not always report values for every embryo of a cycle, so the dataset does not equal the full number of embryos in the cycles. A clinical success rate of PGT-mt cannot be calculated from cases pooled across publications.",
      "sizeTitle": "Dataset size",
      "measure": "Measure",
      "count": "Count",
      "representationTitle": "How values are represented",
      "undetectedMeaning": "“0” means the variant was not detected by the method used, not a proven molecular zero. The detection limit is shown only when the source states it.",
      "intervalMeaning": "If only an interval was published, its bounds are stored; no midpoint is imputed.",
      "derivationMeaning": "Every value carries how it was obtained. A label is set only if the rule is recorded in the supplementary workbook:",
      "landscapeValues": "Heteroplasmy Landscape values",
      "pointProvenance": "Every point leads back to its row in the supplementary workbook and to the publication (DOI).",
      "guidesTitle": "Reference lines on the charts",
      "checked": "Checked",
      "guideCaveat": "None of these numbers defines a safe threshold for an individual embryo. The three numbers used in practice (18, 15–30 and 30%) answer different questions and come from different tissues, methods and outcomes.",
      "limitationsTitle": "Limitations",
      "heterogeneousStudies": "The dataset is descriptive and does not allow a meta-analysis: studies differ in biopsy stage, measurement methods and detection limits.",
      "publicationBias": "Successful cycles are published more often than unsuccessful ones; there are no data to correct for this bias.",
      "dependentEmbryos": "Embryos are not independent observations: many come from one patient in one cycle; variants are unevenly represented. A pooled share is not an individual risk.",
      "dependentChildSamples": "In embryo–child comparisons several measurements belong to the same child (different tissues, ages, methods, laboratories).",
      "scenarioModel": "The PGT-mt × PGT-A Model is a scenario calculation: it ignores within-family correlation and gives no individual prediction.",
      "classificationTitle": "Variant classification",
      "classificationMeaning": "The variant class is taken from the supplementary workbook; Atlas introduces no classifier of its own, including one based on heteroplasmy level. For every variant the statement of the primary publication on which the class rests and the date of the check are given. The variants were not checked against MITOMAP or ClinVar in this review.",
      "variant": "Variant",
      "variantClass": "Class",
      "basis": "Basis",
      "reportingTitle": "What to report about a PGT-mt cycle",
      "reportPatient": "Patient and cycle: age; family history; carrier tissue heteroplasmy; number of oocytes; fertilisation and embryo development.",
      "reportEmbryo": "Embryo: biopsy day; morphology; PGT-A result; heteroplasmy in every sample — for every embryo, including those not transferred.",
      "reportMethod": "Method: whole-genome amplification; target region; linearity; detection limit; controls.",
      "reportOutcome": "Outcome: prenatal diagnosis and postnatal follow-up with tissue, age and method."
    },
    "Cases": {
      "primaryAttribution": "The primary source for each case is listed in the Source column: authors, publication and DOI."
    },
    "Concordance": {
      "pathogenicShort": "path.",
      "medianBar": "red bar",
      "rangeSummary": "Median range: {{v0}} pp ({{v1}} pathogenic blastocysts), {{v2}} pp (HV2), {{v3}} pp (all {{v4}}); cleavage stage — {{v5}} pp (n = {{v6}}).",
      "range": "Range",
      "blastomeres": "Blastomeres",
      "rangePp": "Range, pp",
      "cells": "Cells",
      "coverage": "Depth, ×"
    },
    "Offspring": {
      "panelA": "A",
      "panelB": "B",
      "comparisonSummary": "Of {{v0}} comparisons with low embryo heteroplasmy, {{v1}} showed low or undetectable tissue heteroplasmy; all discordant values ({{v2}}) come from re-analysis of one child by another method.",
      "referenceView": "In the reference view",
      "yes": "yes",
      "no": "no"
    },
    "ScienceIndex": {
      "landscapeSummary": "{{v0}} {{values}}, {{variants}} {{variantWord}} mtDNA",
      "concordanceSummary": "{{v0}} {{blastocysts}} + {{v1}} cleavage {{embryos}}",
      "offspringSummary": "{{v0}} {{comparisons}}, {{v1}} fetuses and children",
      "scenarioSummary": "scenario calculation",
      "lead": "Four scientific sections of the Atlas. Every chart opens in its reference view; extra filters are labelled “extended view”. Every point leads to the primary publication and the row of the source workbook."
    }
  },
  "methodLabels": {
    "countLabels": {
      "landscape_values": "embryo heteroplasmy values",
      "landscape_variants": "mtDNA variants in the heteroplasmy landscape",
      "concordance_blastocysts": "blastocysts with several fractions measured",
      "concordance_records": "blastocyst fraction records",
      "cleavage_embryos": "cleavage-stage embryos (two blastomeres)",
      "offspring_records": "embryo → offspring records",
      "offspring_children": "children in embryo → offspring records",
      "offspring_children_exact_pair": "children with an exact transferred-embryo–tissue pair",
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
