# ADR 1356: Carry Preflight Lineage Through Delivery

## Status

Accepted

## Context

The package review gate now requires a durable publisher source preflight
sidecar. Delivery release, QR registration, and local package assembly are
later gates that must preserve the same source identity. A packet-only check
would still allow provenance to disappear between review and the printed/local
package handoff.

## Decision

Delivery release lineage must read and validate the matching source preflight
sidecar. It must match tenant, quarantine, package, and the quarantined source
checksum, and its evidence identity must match the package review packet.

The local package review binding must carry `sourcePreflightEvidenceId`.
Assembly and the read-only local package runtime must validate that identity
and preserve it in the package metadata binding. QR output and local route
readiness therefore remain downstream of the same source provenance chain.

## Consequences

Positive:

- Release, QR, and local package metadata cannot silently detach from the
  publisher source inventory that was reviewed.
- The local companion carries an auditable provenance identity without
  embedding publisher payloads in evidence records.
- Stale or legacy packets fail closed instead of producing an apparently
  publishable package.

Trade-offs:

- Existing rehearsal fixtures must include a matching preflight evidence
  identity.
- Operators must repair missing lineage before delivery gates can advance.

## Protected boundaries

This decision does not enable release writes, QR route mutation, hosted
persistence, learner records, or student-facing activation. It strengthens
identity validation only.

## Verification

- `node scripts/verify-live-release-lineage-boundary.mjs`
- `node scripts/verify-local-pilot-package-assembler.mjs`
- `node scripts/verify-local-pilot-package-runtime-reader.mjs`
- `node scripts/verify-local-pilot-package-assembler-behavior.mjs`
