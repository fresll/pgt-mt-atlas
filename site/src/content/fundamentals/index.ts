import type { Lang } from '../../data/atlas'
import en from './en'
import ru from './ru'
import es from './es'
import zh from './zh'
import ar from './ar'
import type { FundamentalsContent } from './types'

export const FUNDAMENTALS: Record<Lang, FundamentalsContent> = { en, ru, es, ar, 'zh-Hans': zh }

/** Постоянные адреса глав: /<язык>/fundamentals/<slug>/ — одинаковы во всех языках. */
export const CHAPTER_SLUGS = ru.chapters.map((c) => c.slug)
