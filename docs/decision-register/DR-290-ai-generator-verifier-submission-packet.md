# DR-290: AI Generator Verifier Submission Packet

Status: Accepted  
Date: 2026-07-31

Decision: Add a review-only verifier submission packet preview to `/teacher/generator/sample-publisher`.

White-label impact: Strongly positive. It gives tenants and publishers a clear safety-and-quality gate for AI-generated game packages before any student-facing workflow exists.

Cost impact: Positive. The packet prevents expensive downstream cleanup by catching schema, audio, rights, engine, scoring, and approval gaps before route, playlist, or assignment work begins.

Constraints:

- Generated game requests must produce an `ai_verifier_submission_packet` before teacher approval.
- The packet must show schema validation, pedagogical lock, target-language progression, audio coverage, engine binding, gamification mapping, activity compatibility, media rights, and teacher approval checks.
- Verifier submission, generated package approval, route creation, playlist creation, assignment creation, and student-ready marking remain blocked until durable verifier storage, reviewer identity, media evidence attachments, audio cue approval, approval ledger binding, and release-control binding exist.
- This decision is recorded in `docs/adr/0290-ai-generator-verifier-submission-packet.md`.
