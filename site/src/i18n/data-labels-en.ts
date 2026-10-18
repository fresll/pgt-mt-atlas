// Presentation-only wording. ETL categories, source values and CSV data retain their original schema.
export const dataLabelsEn: Record<string, Record<string, string>> = {
  stage: { unspecified: 'Developmental stage not specified' },
  sample_type: {
    te_biopsy: 'TE biopsy sample',
    te_icm_multiple: 'Multiple TE and ICM biopsy samples (mean)',
    mixed_unspecified: 'Blastomeres and/or whole embryo (not specified)',
  },
  fraction: {
    te_biopsy: 'TE biopsy sample',
    combined_te_icm: 'Combined ICM+TE sample',
  },
  tissue: { fetal_tissue: 'Foetal tissues' },
  qualifier: { not_detected: 'Not detected by the assay' },
  derivation: {
    mean_blastomeres_and_te: 'Mean of blastomere and TE measurements',
    mean_of_biopsies: 'Mean of several biopsy measurements',
    digitized_from_figure: 'Value digitised from a published figure',
    via_secondary_review: 'Value obtained from reviews (primary source: abstract)',
  },
}

export const templatePurposesEn: Record<string, string> = {
  Study: 'One row per study or dataset: who generated the data, where, and its publication status.',
  Cycle: 'One row per initiated IVF/PGT-mt cycle, including cycles with no suitable embryo or no transfer.',
  Embryos: 'One row per embryo or tested oocyte. Include every embryo in the cycle, not only those transferred.',
  Samples_Measurements: 'One row per measurement from carrier tissues, oocytes, polar bodies, embryo samples, or prenatal and postnatal samples. Record replicates in separate rows.',
  Methods: 'One row per analytical method or protocol version used for the measurements.',
  Clinical_Outcomes: 'One row per outcome: no suitable embryo, implantation failure, pregnancy loss, birth or follow-up visit.',
}
