// Раздел Contribute Data: канал связи с куратором и архитектура научной проверки предложенных данных.
// Здесь нет ни приёма файлов, ни хранения обращений: поступившие материалы обрабатываются вне сайта
// и попадают в набор данных только через проверенный PR с меткой `data-change` (CLAUDE.md).

/**
 * Канал связи с куратором. null — канал не выбран: интерфейс показывает, что связь ещё не активирована,
 * и не имитирует отправку. Для активации куратор подтверждает публичный профессиональный адрес
 * (или иной канал), и он записывается сюда.
 */
export const CURATOR_CONTACT: { email: string | null } = { email: null }

export const SUBJECT_PREFIX = '[PGT-mt Atlas] '

/** mailto-ссылка с темой и текстом письма (без вложений: файлы с данными пациентов почтой не передаются). */
export function mailtoHref(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

// ——— статусы предложения ———
export const SUBMISSION_STATUSES = ['submitted', 'under_review', 'validated', 'included', 'rejected'] as const
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number]

/** Допустимые переходы. Каждый переход — решение куратора; автоматических переходов нет. */
export const TRANSITIONS: Record<SubmissionStatus, readonly SubmissionStatus[]> = {
  submitted: ['under_review', 'rejected'],
  under_review: ['validated', 'rejected'],
  validated: ['included', 'rejected'],
  included: [],
  rejected: [],
}

export function canTransition(from: SubmissionStatus, to: SubmissionStatus): boolean {
  return TRANSITIONS[from].includes(to)
}

// ——— уровни доказательности ———
export const EVIDENCE_TIERS = ['peer_reviewed_published', 'published_not_peer_reviewed', 'unpublished_research_data', 'unverified_report'] as const
export type EvidenceTier = (typeof EVIDENCE_TIERS)[number]

/** Что требуется подтвердить для неопубликованных данных до включения. */
export const UNPUBLISHED_CHECKS = ['authority', 'permission', 'deidentification', 'ethics'] as const
export type UnpublishedCheck = (typeof UNPUBLISHED_CHECKS)[number]

export interface Submission {
  status: SubmissionStatus
  tier: EvidenceTier
  /** Подтверждённые куратором пункты (для неопубликованных данных — все четыре). */
  confirmed: Partial<Record<UnpublishedCheck, boolean>>
  /** Запись о решении куратора (ссылка на PR `data-change` или протокол проверки). */
  curatorDecision?: string
}

/**
 * Может ли предложение появиться в публичных графиках Atlas.
 * Даже при `true` значения попадают в набор данных только через отдельный проверенный PR.
 */
export function isEligibleForPublicCharts(s: Submission): boolean {
  if (s.status !== 'included' || !s.curatorDecision) return false
  if (s.tier === 'unverified_report') return false
  if (s.tier === 'unpublished_research_data') return UNPUBLISHED_CHECKS.every((c) => s.confirmed[c] === true)
  return true
}
