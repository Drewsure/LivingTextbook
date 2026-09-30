# ADR 1308: QR Registry Bound Local Package

## Status

Accepted for the first saleable-pilot foundation. Closed-local assembly remains
explicitly gated by approved release evidence and does not activate students.

## Decision

An assembled closed-local or hybrid package must carry the exact registered QR
alias record beside its QR print artifact. Assembly validates the record against
the delivery manifest, release receipt, tenant/package/version identity, source
checksum, alias paths, and local fallback paths. Staged read-back validates the
same record before the package is committed.

The local runtime must validate and expose both `qrPrintArtifactReady` and
`qrAliasRegistryReady`. If either metadata artifact is missing, malformed, or
drifts from the approved lineage, the runtime fails closed. The package remains
read-only for learners; it does not mutate the stable QR route, swap releases,
enable hosted persistence, or record learner data.

## Consequences

- A printable QR sheet cannot be detached from the alias registry that defined
  its fallback paths.
- Local packages can be inspected and recovered with their release lineage
  intact.
- The registry writer and local package assembler remain separate controlled
  boundaries, which preserves provider-neutral deployment options.
- Production print still requires the human release, rollback, and print gates.
