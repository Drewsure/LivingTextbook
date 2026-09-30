# ADR 1309: Verified QR Print Sheet Read Lane

## Status

Accepted for the first saleable-pilot foundation. The print-sheet read lane is
explicitly gated and does not authorize production printing or route mutation.

## Decision

The local package assembler must record a SHA-256 checksum for the generated QR
print-sheet HTML beside the structured QR print manifest. The local runtime
must read and validate that HTML checksum before a publisher-facing print
artifact is served.

The runtime exposes the print sheet through a bounded tenant/package/version
route only when the package read gate, the separate print-read gate, approved
release metadata, and the QR registry binding all pass. The route serves the
immutable package artifact with a restrictive content policy and has no write,
redirect, learner-record, hosted-persistence, or QR-mutation capability.

## Consequences

- A publisher can retrieve the exact QR sheet produced by the approved local
  package rather than recreating it from an unverified preview.
- Manual edits, detached files, and HTML artifact drift fail closed before
  printing.
- The extra print-read gate keeps a package readable for inspection without
  silently turning on printing or student delivery.
- Production print authorization, registry deployment, and human release
  approval remain separate closure gates.
