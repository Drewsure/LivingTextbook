# ADR 1306: QR Print Artifact Integrity

## Status

Accepted for the first saleable-pilot foundation; production delivery remains
controlled by the existing release and local-package gates.

## Decision

Every assembled local package QR print sheet must carry a typed artifact
identity, tenant/package/version identity, manifest and receipt identity,
source assembly checksum, safe print base URL, and a checksum for every
generated SVG. The local runtime must validate those fields before declaring
the QR artifact ready.

## Consequences

- A copied or stale QR sheet cannot silently travel with a different package.
- The runtime can distinguish “file exists” from “artifact matches the approved
  release lineage.”
- The existing QR generator remains the single encoding path for local delivery.
- Artifact validation remains fail-closed and does not perform redirects or
  mutate a registry.
