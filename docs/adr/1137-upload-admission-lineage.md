# ADR 1137: Upload Admission Lineage Into Evidence Handoff

## Status

Accepted for foundation preview.

## Decision

Carry a typed upload admission binding into the tenant evidence handoff
package. The binding preserves tenant, package, source, quarantine, admission,
evidence-packet, decision, and blocker identity, and is rendered in the
review-only handoff preview.

## Boundaries

The binding is an evidence reference, not an authorization. It cannot export,
approve, select storage, promote an asset, release a package, create a route or
playlist, assign students, mutate QR aliases, activate a local bundle, or allow
student-facing use. The binding must remain `review-only` and side-effect-free.

## Verification

The shared content-model validator, evidence handoff scope verifier, upload
admission verifier, full foundation gate, active route checks, and production
build verify this connection.
