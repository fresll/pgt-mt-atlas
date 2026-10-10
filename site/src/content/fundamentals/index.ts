import type { Lang } from '../../data/atlas'
import en from './en'
import ru from './ru'
import type { FundamentalsContent } from './types'

export const FUNDAMENTALS: Record<Lang, FundamentalsContent> = { en, ru }

/** Постоянные адреса глав: /<язык>/fundamentals/<slug>/ — одинаковы в обоих языках. */
export const CHAPTER_SLUGS = ru.chapters.map((c) => c.slug)
