# DR-1101: External Candidate Operator Input

- Literal placeholders such as `<returned-package-folder>` are rejected
  before filesystem resolution with an actionable message.
- Operators must provide the real absolute path to an isolated returned
  evidence package; the frozen source snapshot remains invalid input.
- The diagnostic changes operator feedback only. It does not change evidence,
  provenance, review, quarantine, promotion, or assignment authority.

References: ADR 1101, Build session 1015, FR-059, and the candidate package
behavior regression.
