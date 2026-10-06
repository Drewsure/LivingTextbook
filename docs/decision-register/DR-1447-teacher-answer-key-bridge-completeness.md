# DR-1447: Teacher Answer-Key Bridge Completeness

- **Decision:** The package-review evidence bridge must derive teacher answer-key
  metadata only when it contains exactly one valid record for every
  source-preflight `teacher-answer-key` entry in the selected unit.
- **Reason:** A direct metadata passthrough could preserve a partial or
  content-bearing record and leave the final human audit to discover the
  omission too late.
- **Boundary:** The bridge never reads, copies, extracts, or exposes teacher
  answer content. It carries only bounded identity, path, checksum, reviewer,
  rights-reference, and answer-mapping-reference metadata.
- **Verification:** The bridge self-test covers valid evidence, answer-content
  rejection, omitted-file rejection, checksum drift, overwrite refusal, and
  incomplete-review rejection. Student activation and promotion remain false.

