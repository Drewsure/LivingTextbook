# 2026-08-25 AI Request-To-Draft Handoff Preview

Added a review-only AI request-to-draft handoff preview to teacher generator routes.

## Why

The generator now has visible request packets and downstream draft/package review surfaces. The handoff makes the boundary explicit: reviewed request evidence may be inspected against the target draft preview, but it cannot trigger a live model, billing, draft generation, draft JSON write, verifier submission, package assembly, route, playlist, assignment, or student-ready marker.

## Built

- Shared content-model validator for request-to-draft handoff packets.
- Sample handoffs for sample-publisher and MiniStar.
- Teacher generator route panel between request packet preview and storage guard.
- Route and generator verifier coverage.
- Decision register entry DR-507 and ADR 0436.

## Guardrails

- `handoff_mode: review-only-preflight`
- `target_language_progress_trigger: target-language-only`
- `support_language_progress_allowed: false`
- `draft_creation_allowed: false`
- `draft_json_write_allowed: false`
- MiniStar Japanese support remains hiragana-only, support-only, and unable to unlock progress.

## Next Step

Continue tightening draft review and correction evidence before adding provider integrations, live model calls, or package writer behavior.
