# ADR 1359: Durable-Records Local Package Request

## Status

Accepted

## Context

The local package preflight and writer accepted a complete request containing
the approved delivery manifest, receipt, package index, and QR registry record.
Those records already exist in tenant-scoped custody after the earlier release
gates, but requiring an operator or client to copy them into a new request was
error-prone and did not resemble a saleable publisher workflow.

## Decision

Both local package endpoints accept a durable-records draft containing only:

- tenant, package, quarantine, and review-packet identities;
- the reviewed local bundle manifest;
- bounded operator identity and timestamp.

The server derives the exact delivery metadata and QR registry records from
tenant/package/version-scoped custody, then runs the existing lineage,
review-packet, custody, source-preflight, asset, bundle, print, and write-gate
checks. No wildcard or placeholder custody lookup is allowed. The full request
shape remains available for controlled integrations.

## Consequences

- A teacher/operator workflow can submit a small reviewed draft instead of
  reconstructing release records.
- Stored records remain the source of truth; client-supplied copies cannot
  silently replace them.
- Missing or mismatched custody remains blocked and visible.
- The preflight remains read-only, and the writer remains separately gated.

## Protected boundaries

The derived records are never returned as raw payloads by the preflight route.
The feature does not print QR codes, mutate aliases, activate students, enable
hosted persistence, or store learner records.

## Verification

- `npm run verify:foundation-composition`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
