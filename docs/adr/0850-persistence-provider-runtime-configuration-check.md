# ADR 0850: Runtime Persistence Provider Configuration Check

## Status

Accepted.

## Decision

Add an executable runtime check for the server-owned persistence provider
configuration helper. The check must prove the unset process-memory rehearsal
default, the supported `sqlite` value, whitespace trimming, and blocked handling
of unsupported values.

## Rationale

The route-level fail-closed policy is security-sensitive and can be weakened by
a future refactor even when static markers remain present. A small runtime check
keeps the deployment configuration contract executable without creating a
database or enabling live writes.

## Guardrails

- The check runs against the compiled server adapter in an isolated temporary
  output directory.
- It does not instantiate the SQLite store or select a hosted provider.
- It does not write learner records, credentials, raw audio, transcripts, or
  production data.
- Route authorization and blocked-response checks remain covered by the existing
  persistence verification gates.

See `docs/verification/PERSISTENCE_ADAPTER_SEAM_CHECKS.md` and
`docs/decision-register/DR-922-persistence-provider-runtime-configuration-check.md`.
