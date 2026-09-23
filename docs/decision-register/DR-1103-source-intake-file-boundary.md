# DR-1103: Source Intake File Boundary

- Source-runtime requests now require MIME type and positive byte length.
- MIME must match the declared source type and size must remain at or below
  the shared 50 MiB review ceiling.
- The boundary does not enable storage, extraction, draft creation, package
  promotion, assignment, or raw-source student use.

References: ADR 1103, Build session 1017, FR-061, and source-runtime
regressions.
