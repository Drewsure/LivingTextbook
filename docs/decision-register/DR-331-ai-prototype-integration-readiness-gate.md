# DR-331: AI Prototype Integration Readiness Gate

## Decision

The platform will show a review-only AI prototype integration readiness gate before any returned prototype can move toward `apps/web` integration.

## Rationale

External prototypes are valuable for speed and experimentation, but integration must remain evidence-led. A single readiness gate keeps wrapper fit, fixture replay, standard events, audio coverage, mobile accessibility, deterministic scoring, and Codex review connected before real app code or student-facing routes are considered.

## Implementation Notes

- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` now include the readiness gate preview.
- The gate requires wrapper adapter review, fixture replay report, event replay report, audio coverage report, mobile accessibility report, scoring replay report, and Codex integration review decision evidence.
- Missing evidence blocks `apps/web` patches, direct imports, route registry writes, student-facing routes, scoring profile mutations, Star Dust or reward writes, audio manifest mutations, package promotion, and student assignment.
- MiniStar-specific gates keep Japanese support language support-only and hiragana-safe for early levels.

## Follow-Up

The next durable foundation step is a backend-neutral storage contract for the readiness gate once the visible review shape has stayed stable through route and teacher-review checks.
