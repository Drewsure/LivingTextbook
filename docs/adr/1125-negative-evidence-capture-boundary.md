# ADR 1125: Explicit Negative Evidence Capture Boundary

## Decision

Require an explicit teacher action to record privacy-negative and
tenant-isolation evidence for one exact browser rehearsal scope. The capture
must retain the reviewer reference, capture id, timestamp, notes, and the full
tenant, package, launch, unit, student-session, and observation identity.

## Boundaries

The record is local review evidence only. It cannot enable hosted writes,
learner-data collection, audio or transcript retention, evidence export,
promotion, QR mutation, assignment, or classroom launch. A successful browser
journey does not imply privacy or tenant-isolation proof.

Malformed records, cross-tenant lookups, promotion drift, pending reviewers,
and missing scope remain hidden or invalid. The frozen Z.ai/Phaser source is
not changed by this capture path.

## Verification

- `npm run verify-browser-privacy-tenant-evidence-packet`
- `npm run verify-browser-privacy-tenant-evidence-packet-derivation`
- `npm run verify-browser-privacy-tenant-evidence-runtime`
- `npm run verify:foundation`

