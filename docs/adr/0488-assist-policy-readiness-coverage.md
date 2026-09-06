# ADR 0488: Assist-Policy Readiness Coverage

Status: Accepted

## Decision

Expose assist-language policy records and script-policy coverage in the unit-package readiness summary and review panel. Keep assist-language optional at pilot level, but show invalid or undeclared student-visible Japanese policy as a distinct blocked assist gate and retain package-validation blocking for invalid content.

## Rationale

- Counting assist plans is not enough to prove they are safe for the curriculum level.
- Teachers need to see the difference between reviewed translation and script-safe student content.
- Optional support must not block a tenant that chooses no assist language, while invalid content must never become student-facing.

## Guardrails

- The readiness panel is review-only and cannot publish, upload, assign, or unlock content.
- Target-language practice remains the only progression trigger.
- The package validator remains the authoritative student-facing safety gate.
- `npm run verify:package-readiness`, typecheck, build, and route verification protect the coverage panel.

This decision is recorded in `docs/DECISION_REGISTER.md` DR-559.
