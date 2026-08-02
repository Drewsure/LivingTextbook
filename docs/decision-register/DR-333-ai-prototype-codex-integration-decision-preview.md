# DR-333: AI Prototype Codex Integration Decision Preview

## Decision

The platform will show a review-only Codex integration decision preview before any returned prototype can move from evidence review toward app integration.

## Rationale

Prototype evidence is necessary but not sufficient. A separate Codex decision preview keeps the final architecture/integration decision manual, visible, and blocked until wrapper, fixture, event, audio, mobile, scoring, readiness, and tenant-safety evidence passes.

## Implementation Notes

- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` now include the Codex integration decision preview.
- The preview shows required evidence checks, disabled decision options, and `No decision recorded`.
- App patch generation, direct imports, route registry writes, student-facing routes, scoring profile mutations, Star Dust or reward writes, audio manifest mutations, package promotion, and assignments remain blocked.
- MiniStar-specific decisions keep Japanese support language support-only and hiragana-safe for early levels.

## Follow-Up

Add a backend-neutral storage contract for `codex_integration_review_decision` only after the review-only decision shape stays stable.
