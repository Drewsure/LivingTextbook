# ADR 1134: Quarantine Metadata Review Read Path

## Status

Accepted for foundation implementation; review remains read-only.

## Decision

Provide a tenant-authorized review endpoint that reads only validated
quarantine metadata and gate state. It may list all records for a tenant or
inspect one opaque quarantine identity, but it must never return raw payload
bytes, filesystem paths, download URLs, credentials, or learner records.

The review summary must preserve pending scan, unknown rights, unreviewed
source, payload presence, and explicit blocked actions. It cannot mutate scan,
rights, source review, target mapping, release, playlist, game, assignment,
QR, local bundle, or student-facing state.

## Consequences

- A teacher or controlled service can see what is waiting for review without
  making the file usable.
- Malformed, cross-tenant, unsafe, or unreadable records fail closed and are
  withheld from the response.
- Future scan and rights adapters have a stable metadata-only read seam.
