# ADR 1360: Persist Reviewed Local Bundle Manifests

## Status

Accepted for the pilot foundation.

## Context

The closed-local package writer needs a reviewed offline bundle manifest, but a
client-submitted manifest is not durable evidence. Requiring operators to copy
the same manifest into every request also creates drift risk between review and
assembly.

## Decision

Persist one immutable, tenant/package/version-scoped reviewed manifest record
under a separately configured custody root. Bind it to the quarantine id,
package review packet id, source preflight evidence id, reviewer, review time,
and a canonical SHA-256 of the manifest. Permit durable-record package requests
to reference the exact record id.

The record is evidence only. Its status may say `reviewed-for-assembly`, but
assembly, promotion, QR printing, hosted persistence, learner records, and
student use remain explicitly false and separately gated. Writes are disabled
by default. The API is authenticated and does not expose secrets, source bytes,
or server paths beyond bounded relative metadata.

## Consequences

- Package assembly receives a stable reviewed source of truth.
- A manifest cannot be silently replaced after review.
- A human reviewer and the upstream packet/source lineage remain auditable.
- The platform adds one operator review step and one custody root to configure.
- This does not yet create a real publisher package or authorize production QR
  printing; those remain later human-approved gates.
