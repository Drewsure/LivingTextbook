# DR-1116: White-Label Browser Evidence Integrity

## Decision

Browser evidence must identify its capture mode. Coded rehearsal is valid
review evidence but is not sufficient for pilot-ready status; browser
automation or human-observed evidence is required for that later state.

## Required invariants

- The capture mode is one of `coded-rehearsal`, `browser-automation`, or
  `human-observed`.
- Coded-only browser evidence cannot produce pilot-ready status.
- The mode does not enable release, persistence, export, installation, provider
  activation, QR mutation, or student launch.

## Status

Implemented and verified as review-only evidence.
