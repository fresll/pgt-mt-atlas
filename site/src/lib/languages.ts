// Arabic is available only in a private review build; there is no public flag.
export const arabicEnabled = import.meta.env.VITE_ATLAS_PRIVATE_PREVIEW === '1' ? import.meta.env.VITE_ATLAS_ARABIC_REVIEW === '1' : import.meta.env.VITE_ATLAS_ARABIC_PUBLIC === '1'

// Public Chinese release and owner-only review are explicit build choices.
export const chineseEnabled = import.meta.env.VITE_ATLAS_PRIVATE_PREVIEW === '1'
  ? import.meta.env.VITE_ATLAS_CHINESE_REVIEW === '1'
  : import.meta.env.VITE_ATLAS_CHINESE_PUBLIC === '1'

// Public English release and owner-only review are independent build choices.
export const englishEnabled = import.meta.env.VITE_ATLAS_PRIVATE_PREVIEW === '1'
  ? import.meta.env.VITE_ATLAS_ENGLISH_REVIEW === '1'
  : import.meta.env.VITE_ATLAS_ENGLISH_PUBLIC === '1'
