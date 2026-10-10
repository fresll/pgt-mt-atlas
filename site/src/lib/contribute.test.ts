import { describe, expect, it } from 'vitest'
import { CURATOR_CONTACT, EVIDENCE_TIERS, SUBMISSION_STATUSES, canTransition, isEligibleForPublicCharts, mailtoHref, type Submission } from './contribute'
import template from '../data/submissionTemplate.json'

const allChecks = { authority: true, permission: true, deidentification: true, ethics: true }

describe('submission review', () => {
  it('statuses follow Submitted → Under review → Validated → Included / Rejected', () => {
    expect(SUBMISSION_STATUSES).toEqual(['submitted', 'under_review', 'validated', 'included', 'rejected'])
    expect(canTransition('submitted', 'under_review')).toBe(true)
    expect(canTransition('submitted', 'included')).toBe(false)
    expect(canTransition('under_review', 'included')).toBe(false)
    expect(canTransition('validated', 'included')).toBe(true)
    expect(canTransition('rejected', 'included')).toBe(false)
  })

  it('nothing reaches public charts before inclusion and a recorded curator decision', () => {
    for (const status of SUBMISSION_STATUSES) {
      const s: Submission = { status, tier: 'peer_reviewed_published', confirmed: {}, curatorDecision: 'PR' }
      expect(isEligibleForPublicCharts(s)).toBe(status === 'included')
    }
    expect(isEligibleForPublicCharts({ status: 'included', tier: 'peer_reviewed_published', confirmed: {} })).toBe(false)
  })

  it('unpublished data need authority, permission, de-identification and ethics; unverified reports never appear', () => {
    const base: Submission = { status: 'included', tier: 'unpublished_research_data', confirmed: { ...allChecks, ethics: false }, curatorDecision: 'PR' }
    expect(isEligibleForPublicCharts(base)).toBe(false)
    expect(isEligibleForPublicCharts({ ...base, confirmed: allChecks })).toBe(true)
    expect(isEligibleForPublicCharts({ ...base, tier: 'unverified_report', confirmed: allChecks })).toBe(false)
  })

  it('template evidence tiers are a subset of the Atlas tiers', () => {
    for (const t of template.evidence_tiers) expect(EVIDENCE_TIERS).toContain(t)
  })
})

describe('curator contact', () => {
  it('no address is configured until the curator confirms a channel', () => {
    expect(CURATOR_CONTACT.email).toBeNull()
  })

  it('builds an encoded mailto link', () => {
    expect(mailtoHref('a@b.org', '[PGT-mt Atlas] Data & methods', 'Line 1\nLine 2')).toBe('mailto:a@b.org?subject=%5BPGT-mt%20Atlas%5D%20Data%20%26%20methods&body=Line%201%0ALine%202')
  })
})
