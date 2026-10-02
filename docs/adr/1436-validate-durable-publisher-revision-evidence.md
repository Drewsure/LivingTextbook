# ADR 1436: Validate Durable Publisher Revision Evidence

## Status

Accepted for the first saleable white-label pilot.

## Decision

Publisher revision evidence is reopened through the read-only
`verify-publisher-pilot-intake-revision.mjs` validator. It recomputes the
current brief checksum, checks copied files, intentional missing/omitted
paths, excluded stale artifacts, and review-only flags. Checksum drift or
custody inconsistencies fail closed.

## Consequences

Operators and later automated gates can verify an external revision after it
was created without rewriting it. Validation remains separate from rights,
package, QR, persistence, release, and student approval.
