# DR-559: Assist-Policy Readiness Coverage

Status: Accepted

Decision: Show assist-language policy records and script-policy coverage in the unit-package readiness summary and panel.

Rationale:

- A reviewed translation alone does not prove level-safe Japanese script.
- Teachers and tenant reviewers need visible evidence for policy, curriculum band, and review status.
- Optional assist language must remain optional, while invalid student-visible policy must remain blocked by package validation.

Guardrails:

- No assist policy record can unlock a game, award mastery, or replace target-language practice.
- No-assist packages remain reviewable without a false blocker.
- Invalid or undeclared student-visible Japanese policy is shown as blocked in the assist gate and remains a package validation error.
- The readiness surface stays review-only and does not enable uploads, publishing, assignment, or live storage.

Evidence:

- `apps/web/src/data/sampleUnitPackageReadiness.ts`
- `apps/web/src/features/content-intake/UnitPackageReadinessPanel.tsx`
- `scripts/verify-package-readiness.mjs`
- `docs/adr/0488-assist-policy-readiness-coverage.md`
