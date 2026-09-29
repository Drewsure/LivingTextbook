# Build Session Note: Local Package and QR Print Behavior

## Goal

Move the white-label pilot from review-only delivery claims toward a tested
closed-local package path without opening production writes.

## Delivered

- Added `verify-local-pilot-package-assembler-behavior.mjs`.
- Compiled and exercised the real local package assembler against temporary
  approved-asset and package custody roots.
- Confirmed generated QR JSON and printable HTML, SVG evidence, local fallback
  mapping, copied asset count, and assembly read-back.
- Confirmed exact reassembly is idempotent.
- Confirmed the resulting package is readable through the real local runtime
  reader, including QR readiness, fallback mapping, and learner-record privacy.
- Confirmed a reviewed partner-style content payload passes canonical content
  validation before local student-facing content reads are allowed.
- Confirmed approved audio and transcript files resolve through the package
  manifest with safe content types, while undeclared media is rejected.
- Confirmed disabled writes and unsafe `file:` print bases remain blocked.
- Added the behavior verifier to `verify:foundation`.

## Boundary kept

The rehearsal uses synthetic approved evidence only. It does not promote the
frozen Z.ai/Phaser source, activate a tenant, create learner records, print a
real publisher run, or enable hosted persistence.

## Next evidence needed

A real publisher package must still supply reviewed source lineage, rights and
accessibility evidence, human release approval, QR print authorization, device
fallback testing, and a signed rollback record before production handoff.
