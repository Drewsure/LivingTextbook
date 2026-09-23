# DR-1126: Composite Evidence Adjudication

## Decision

Use a separate exact-scope adjudication record for the composite evidence
packet. Blocked decisions are allowed while a lane is pending; acceptance for
the next review gate requires browser continuity, privacy-negative, and
tenant-isolation lanes all to be passed.

## Status

Implemented and verified as local review-only evidence.

## Guardrail

Even an accepted adjudication keeps hosted writes, student-data collection,
export, promotion, QR mutation, and student production launch disabled.

