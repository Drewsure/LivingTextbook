# ADR 1233: Publisher Quarantine Handoff Bridge

## Status

Accepted for the pilot foundation.

## Decision

Connect an accepted quarantine intake record to the tenant-scoped publisher
evidence handoff workspace through the existing authorized package-handoff API.
The workspace remains a review-only metadata bridge. The API may derive a
deterministic candidate package id when the reviewer has not supplied one.

## Boundary

The bridge exposes only bounded metadata, checksum, source/package/unit
identity, admission state, evidence identity, required review, and blockers. It
does not expose payload bytes, filesystem paths, download URLs, credentials,
learner records, or extracted content. It cannot write evidence, assemble a
package, mutate QR routes, activate persistence, promote the quarantine
payload, or enable student-facing use.

## Rationale

The first saleable pilot must show a credible publisher path from source intake
to reviewed package handoff. A static sample alone does not prove that lineage.
The bridge demonstrates the connection while preserving the evidence and
release gates needed for a safe white-label product.

## Verification

Run the quarantine package-handoff verifier, publisher package-preview
verifier, web typecheck, production build, route checks, and foundation
composition gate.
