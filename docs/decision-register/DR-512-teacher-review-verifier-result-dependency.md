# DR-512: Teacher Review Verifier Result Dependency

Status: Accepted

Decision: AI generated package teacher review packets must require `ai_verifier_result_evidence_packet` before teacher approval prep can be trusted.

Reason: A verifier submission packet only says what should be checked. Teacher approval must depend on the result evidence shape and must remain blocked while verifier results are unsubmitted, unresolved, or missing.

White-label impact: Positive. This keeps approval discipline consistent across MiniStar and partner tenants while allowing tenant-specific review rules.

Cost impact: Positive. The platform avoids live verifier cost and downstream package work until evidence and approval gates are explicit.

Constraints:

- Teacher review packets must list verifier result evidence as missing evidence and next required record.
- Teacher approval from verifier result remains blocked.
- Support-language progress remains blocked.
- MiniStar teacher review must preserve English target-language trigger and hiragana-only Japanese support.
