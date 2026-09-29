# DR-1241: Release-Bound QR Print Artifact

## Decision

Generate the first tangible QR handoff artifact inside the approved local
publisher package: a self-contained HTML print sheet and a JSON manifest with
printed identity, stable alias, encoded URL, and local fallback.

## Guardrails

- Requires approved delivery manifest and manual release receipt.
- Requires both manifest and receipt QR print authorization.
- Requires explicit HTTP/HTTPS print base URL with no credentials, query, or
  fragment.
- Encodes only safe stable /q/ aliases.
- Binds base URL and artifact output to tenant, package, version, checksum, and
  assembly record.
- Replays must verify metadata, print artifacts, and declared asset checksums.
- Does not mutate aliases, activate students, enable hosted persistence, or
  store learner records.

## Current State

Implemented and verified as part of controlled local package assembly. The
current sample remains blocked because it lacks real release approval and
publisher evidence.
