# ADR 1242: Local Package Runtime Readiness

## Status

Accepted for the first white-label pilot foundation.

## Context

The local package assembler can now produce a release-bound package, but a
written package is not evidence that the local application can safely read it.
The pilot needs a bounded runtime handoff that can resolve curated routes,
game paths, media kinds, and QR print readiness without opening a write path or
exposing publisher payload bytes or learner records.

## Decision

Add a read-only local package runtime reader and status endpoint. The reader is
disabled by default and requires an explicit local-package read feature flag
and configured package root. It validates the package index, delivery manifest,
release receipt, local bundle manifest, assembly record, QR print manifest, and
their cross-record identity bindings before returning a metadata-only runtime
summary.

The reader may expose the approved route map, game route paths, media kinds,
local package identity, and QR artifact readiness. It must not write files,
mutate QR aliases, activate students, enable hosted persistence, return raw
publisher payload bytes, or return learner records.

## Consequences

- The local runtime has a concrete, testable package handoff boundary.
- A green reader result means the package is readable, not that production
  release or student activation has been approved.
- Real publisher content, rights, accessibility, release, rollback, and policy
  evidence remain required before a saleable pilot is declared ready.

