# ADR 1177: Assist-Language Review Packet Before Student Visibility

## Status

Accepted for foundation scaffolding; live approval remains unimplemented.

## Decision

Expose one teacher/admin review packet per sample content package. The packet
must show target language, assist language, script policy, curriculum band,
review provenance, text coverage, assist-audio coverage, AI fallback policy,
open items, and blocked actions.

The packet is read-only. It does not call a translation service, record an
approval, assign a student, write hosted state, export evidence, activate QR,
or promote a package.

## Rationale

Assist language is a white-label package capability, not a universal MiniStar
requirement. Making its boundaries visible at intake prevents support text from
quietly becoming a progression trigger and makes the early Japanese
hiragana-only rule inspectable before later runtime work.

## Consequences

- MiniStar Japanese support is visible as reviewed text with a declared
  hiragana-only Foundation policy.
- Missing assist-language audio is visible as an open item rather than being
  mistaken for complete multimedia coverage.
- A tenant with no support language remains explicitly not configured.
- Future approval and durable teacher settings can attach to this packet without
  changing the student progression contract.

## Evidence

- `apps/web/src/data/sampleAssistLanguageReview.ts`
- `apps/web/src/features/teacher/TeacherAssistLanguageReviewPanel.tsx`
- `scripts/verify-assist-language-review-readiness.mjs`
