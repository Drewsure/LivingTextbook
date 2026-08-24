# DR-509: AI Verifier Submission Packet Validator

Status: Accepted

Decision: AI verifier submission packets must pass a shared validator before any verifier workflow can be considered.

Reason: The verifier packet is a key gate between AI draft work and teacher/package review. It must not depend on hand-written sample text alone. A shared content-model validator keeps required packets, draft repair evidence, blocked actions, and MiniStar support-language boundaries enforceable.

White-label impact: Positive. The rule is tenant-neutral, while still allowing tenant-specific checks such as MiniStar hiragana support boundaries.

Cost impact: Positive. Live verifier calls, model retries, package assembly, route writes, playlist creation, assignments, and student-ready markers remain blocked until review evidence and storage readiness exist.

Constraints:

- Verifier packets must include `ai_draft_repair_evidence_packet`.
- Verifier packets must include schema, pedagogy, target-language progression, audio, engine, gamification, compatibility, rights, and teacher-approval checks.
- Verifier packets must show guard blocks and warnings on teacher generator routes.
- MiniStar verifier packets must preserve English-only progress triggers and hiragana-only Japanese support for Foundation/Bronze/Plus.
