# ADR 0853: Local Bundle Preview Resolution Evidence

## Status

Accepted for foundation rehearsal.

## Context

The local bundle manifest validator and read-only resolver are shared
content-model contracts, but a review page that only prints a manifest can
drift away from the behavior that a future local companion would need. The
preview must prove the route and asset mappings without turning review into
file access or offline activation.

## Decision

Wire the MiniStar and sample-publisher local companion previews to
`createReadOnlyLocalBundleResolver`. Render tenant scope, resolved route and
asset counts, each declared fallback/asset status, and the resolver warnings.

## Boundaries

The preview remains server-rendered review evidence. It does not read local
directories or files, write a bundle, register a service worker, cache media,
activate offline mode, or store learner data. A valid planning resolver does
not approve rights, final checksums, or closed-package handoff.

## Consequences

The local preview now exercises the same mapping contract that a future loader
must consume. The first production-shaped loader remains a separate decision
after package rights, checksums, update behavior, and reporting persistence are
approved.
