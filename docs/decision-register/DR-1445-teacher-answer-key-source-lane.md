# DR-1445: Teacher Answer-Key Source Lane

- **Decision:** Keep teacher answer material in a separate teacher-only source
  lane from the student textbook source.
- **Reason:** The first publisher package now includes separate student and
  teacher PDFs. Answers are necessary for authoring and verification but are
  sensitive instructional material and must not enter student routes or QR
  payloads.
- **Evidence:** External Teacher PDF copied to
  `D:\PublisherPilotInput\teacher\answers\unit-1-answers.pdf` with a
  checksum-bound record in ADR 1445.
- **Implementation gate:** Add a `teacher-answer-key` manifest asset kind,
  teacher-only access checks, separate evidence coverage, and student-bundle
  exclusion before the answer file can enter source preflight or assembly.
- **Verification:** Current student and teacher files remain physically
  separate; no promotion or student activation is enabled.
