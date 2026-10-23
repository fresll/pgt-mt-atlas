import type { Lang } from '../../data/atlas'
import en from './en'
import ru from './ru'
import es from './es'
import type { FundamentalsContent } from './types'

export const FUNDAMENTALS: Record<Lang, FundamentalsContent> = { en, ru, es }

/** Постоянные адреса глав: /<язык>/fundamentals/<slug>/ — одинаковы во всех языках. */
export const CHAPTER_SLUGS = ru.chapters.map((c) => c.slug)
