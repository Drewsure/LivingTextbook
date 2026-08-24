# 2026-08-25 AI Draft Repair Evidence Packet

Added evidence-only AI draft repair evidence packets to teacher generator routes.

## Why

The AI draft correction queue tells reviewers what is wrong. The repair evidence packet now states what proof must exist before verifier submission can be considered.

## Built

- Shared content-model validator for AI draft repair evidence packets.
- Sample repair evidence packets for sample-publisher and MiniStar.
- Teacher generator route panel in the Draft repair section.
- Generator and active route verifier coverage.
- Decision register entry DR-508 and ADR 0437.

## Guardrails

- `target_language_progress_trigger: target-language-only`
- `support_language_progress_allowed: false`
- `auto_fix_allowed: false`
- `live_ai_regeneration_allowed: false`
- `verifier_submission_allowed: false`
- No package assembly, route writes, playlist writes, assignments, or student-ready markers.
- MiniStar Japanese support remains hiragana-only, support-only, and unable to unlock progress.

## Next Step

Continue strengthening verifier-submission evidence and package review readiness before any live AI regeneration, provider integration, or package writer behavior.
