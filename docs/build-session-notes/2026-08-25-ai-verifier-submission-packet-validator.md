# 2026-08-25 AI Verifier Submission Packet Validator

Added a shared AI verifier submission packet validator and wired it into tenant generator routes.

## Built

- Shared content-model validator for AI verifier submission packets.
- Sample-publisher and MiniStar verifier packets now require draft repair evidence packets.
- Teacher generator panel shows verifier guard blocks and warnings.
- Generator and active-route verification were updated to require the new guard markers.
- Decision register entry DR-509 and ADR 0438.

## Guardrails

- Verifier submission remains blocked.
- Generated package approval remains blocked.
- Route, playlist, assignment, and student-ready writes remain blocked.
- MiniStar English remains the target-language progress trigger.
- MiniStar Japanese support remains hiragana-only for Foundation/Bronze/Plus and cannot unlock progress.
