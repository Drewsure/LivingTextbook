# DR-1233: Publisher Quarantine Handoff Bridge

## Decision

Add a tenant-scoped, metadata-only bridge from a real quarantine intake record
to the publisher evidence handoff workspace. Allow the package id to be
omitted from the request and derived deterministically by the server.

## Why

This is the missing operational link in the first saleable white-label pilot:
publisher content can enter controlled quarantine and be reviewed in the same
package context that shows games, multimedia, QR aliases, local fallback, and
opt-in persistence.

## Guardrails

- Teacher/service authorization remains required.
- No raw payload, filesystem path, download URL, credential, learner record, or
  extracted content is returned.
- Evidence writes, package assembly, QR mutation, persistence activation,
  promotion, and student-facing use remain blocked.
- The static sample handoff remains unchanged when no quarantine query is
  supplied.

## Verification

`node scripts/verify-upload-quarantine-package-handoff.mjs`,
`node scripts/verify-publisher-pilot-package-preview.mjs`, web typecheck,
production build, route checks, and foundation composition gate.
