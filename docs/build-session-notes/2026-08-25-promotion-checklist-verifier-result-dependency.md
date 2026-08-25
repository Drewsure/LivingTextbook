# 2026-08-25 Promotion Checklist Verifier Result Dependency

Updated AI generated package promotion checklists to depend on verifier result evidence.

## Built

- Shared promotion checklist validator now requires `ai_verifier_result_evidence_packet`.
- Sample-publisher and MiniStar promotion checklists show verifier result evidence as a blocked promotion step.
- Promotion checklist next records keep `ai_verifier_result_evidence_packet` visible.
- Promotion checklist list rendering uses stable index-based keys.
- Generator and active-route verification coverage were updated.

## Guardrails

- Verifier submission packet visibility is not enough for generated package promotion.
- Promotion remains blocked while verifier result status is `verifier-result-not-submitted`.
- Package promotion, routes, playlists, assignments, local bundle writes, and student-ready markers remain blocked.
- MiniStar preserves English target-language progress and hiragana-only Japanese support.
