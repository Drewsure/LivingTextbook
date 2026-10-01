# DR-1425: Explicit Publisher Source Format

- **Decision:** Let the intake-kit generator declare a safe PDF, DOCX, TXT,
  Markdown, or CSV source path, with PDF remaining the default.
- **Reason:** Support real publisher handoffs and MiniStar's editable DOCX
  material without creating a format-specific white-label branch.
- **Boundary:** Relative `source/` path only; all source, rights, checksum,
  extraction, package, release, QR, persistence, and student gates remain.
- **Verification:** Intake-kit self-test, intake-kit verifier, source-manifest
  bridge, and foundation composition.
- **Related:** ADR 1425 and Principles and Standards 667.
