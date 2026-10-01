# DR-1391: Submission manifest evidence traceability

- **Decision:** Carry structured publisher evidence requests into the canonical
  submission manifest with exact asset coverage.
- **Why:** Evidence declarations must remain traceable after intake adaptation;
  a generic "rights required" flag is too weak for a saleable publisher handoff.
- **Scope:** Review-only manifest, adapter, validator, and teacher evidence
  trace. No file upload, evidence approval, package promotion, QR printing,
  persistence activation, or student assignment.
- **Acceptance:** Intake evidence paths resolve to declared manifest assets;
  unknown coverage and unsafe paths fail closed; the review panel shows record
  ids, kind, path, and coverage; foundation verification remains green.
- **Owner:** Codex architecture and integration review.
- **Next gate:** A real publisher supplies the declared files and a human
  reviewer adjudicates each evidence record.
