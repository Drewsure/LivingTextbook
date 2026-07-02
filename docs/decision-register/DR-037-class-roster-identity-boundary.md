# DR-037: Class Roster Identity Boundary

Date: 2026-07-02

## Decision

Living Textbook will treat class roster identity as a lightweight, policy-gated boundary before full accounts or durable school records are introduced.

The foundation path uses anonymous practice or teacher-issued learner codes. Real learner names, family contact details, raw microphone audio, and speech transcripts remain outside the core roster until a tenant has accepted policy, persistence, reporting export, and retention rules.

## Rationale

The platform needs teacher reports, QR entry, user-code entry, and white-label partner pilots. It should not force an expensive authentication build before the first pilot, and it should not quietly collect personal data just because reports are useful.

Teacher-issued codes give the product enough structure for classroom progress summaries while keeping the build practical, low-cost, and suitable for MiniStar plus other textbook partners.

## Consequences

- `/teacher/intake` now exposes roster readiness as part of the content and pilot review surface.
- Durable learner history remains blocked until persistence and policy choices are accepted.
- Speech features and AI Tutor reports cannot store raw audio or transcripts in the roster by default.
- Closed/local deployments still need backup, export, update, and retention procedures.

## Files

- `packages/content-model/src/classRoster.ts`
- `apps/web/src/data/sampleClassRosterPlans.ts`
- `apps/web/src/features/teacher/ClassRosterReadinessPanel.tsx`
- `docs/CLASS_ROSTER_CONTRACT.md`
- `docs/verification/CLASS_ROSTER_READINESS_CHECKS.md`
