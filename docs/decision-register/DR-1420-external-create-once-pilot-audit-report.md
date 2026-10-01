# DR-1420: External Create-Once Pilot Audit Report

- **Decision:** Add an external, create-once audit report for the first
  saleable-pilot review.
- **Reason:** A publisher needs a durable record of what was proved and what
  remains human-owned without turning a console log or repository file into a
  release artifact.
- **Implementation:** `audit-first-saleable-pilot.mjs --output` writes
  versioned metadata with source revision, gate statuses, and next actions;
  repository paths and overwrites are rejected.
- **Safety:** The report is review metadata only. It cannot upload, assemble,
  print QR codes, activate persistence, or enable students.
- **White-label impact:** Positive. Every tenant can retain the same neutral
  audit handoff outside the platform source tree.
