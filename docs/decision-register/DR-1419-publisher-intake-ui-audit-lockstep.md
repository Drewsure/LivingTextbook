# DR-1419: Publisher Intake UI And Audit In Lockstep

- **Decision:** Keep the teacher/publisher intake workspace explicitly aligned
  with the canonical checksum-bound preflight audit.
- **Reason:** The first saleable pilot needs an operator path that is
  understandable without weakening evidence or safety boundaries.
- **Implementation:** The intake panel shows the exact command and durable
  evidence path; its verifier checks the checksum, report-version, output-path,
  and blocked-action guidance markers.
- **Safety:** The panel remains review-only. It does not upload, assemble,
  print, activate persistence, or enable students.
- **White-label impact:** Positive. The same procedure works for MiniStar,
  sample publisher, and future textbook tenants.
