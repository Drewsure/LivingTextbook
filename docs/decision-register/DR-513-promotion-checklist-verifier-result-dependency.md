# DR-513: Promotion Checklist Verifier Result Dependency

Status: Accepted

Decision: AI generated package promotion checklists must require `ai_verifier_result_evidence_packet` before a generated package can be considered for promotion.

Reason: A verifier submission packet describes what should be checked. Promotion requires evidence of the verifier result, and it must remain blocked while that result is unsubmitted, unresolved, or missing.

White-label impact: Positive. This keeps the promotion pathway consistent across MiniStar and partner tenants while preserving tenant-specific review, media, and language rules.

Cost impact: Positive. The platform avoids route, playlist, assignment, package, and release work until verifier outcomes are explicit.

Constraints:

- Promotion checklists must include a verifier result evidence step.
- Promotion checklists must keep `ai_verifier_result_evidence_packet` in next required records.
- Promotion remains blocked while verifier status is `verifier-result-not-submitted`.
- Support-language-only promotion remains blocked.
- MiniStar promotion must preserve English target-language trigger and hiragana-only Japanese support.
