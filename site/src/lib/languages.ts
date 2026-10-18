// Public English release and owner-only review are independent build choices.
export const englishEnabled = import.meta.env.VITE_ATLAS_PRIVATE_PREVIEW === '1'
  ? import.meta.env.VITE_ATLAS_ENGLISH_REVIEW === '1'
  : import.meta.env.VITE_ATLAS_ENGLISH_PUBLIC === '1'
