# DR-1446: Student Bundle Answer-Key Exclusion

- **Decision:** Make teacher answer-key exclusion an explicit student-bundle
  contract rather than relying on the current manifest shape to omit it.
- **Reason:** The publisher pilot now has separate student and teacher PDFs.
  A future bundle or adapter must fail closed if teacher-only material is
  accidentally added.
- **Implementation:** The shared validator and local package assembler reject
  teacher answer-key kinds, `teacherOnly` markers, and `teacher/answers/`
  paths. A tenant-scoped teacher review API is metadata-only and provider-
  blocked.
- **Verification:** Foundation composition includes the answer-key boundary
  verifier. No answer file is copied into the student bundle or exposed by the
  web app.
- **Teacher UI:** The persistence workbench now offers a teacher-only status
  card that calls the same bounded API after tenant authorization. It reports
  metadata availability or the intentionally blocked provider state; it never
  displays answer content.
- **External evidence:** When intake declares teacher answer files, the
  external `package-review-evidence.json` must include one checksum-bound,
  review-only metadata record per file. The validator hashes the external file
  in place and rejects answer text, bytes, student-facing flags, or drift.
