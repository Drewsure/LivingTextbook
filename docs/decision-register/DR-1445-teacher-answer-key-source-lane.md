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
- **Implementation gate:** The `teacher-answer-key` manifest asset kind and
  separate evidence coverage are now present. Runtime tenant-scoped access and
  final student-bundle exclusion remain required before promotion.
- **Verification:** Adapter regression coverage passes; current student and
  teacher files remain physically separate; no promotion or student activation
  is enabled.
