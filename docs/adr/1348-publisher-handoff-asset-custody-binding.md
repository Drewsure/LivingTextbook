# ADR 1348: Publisher Handoff Asset Custody Binding

## Status

Accepted

## Context

The local package runtime already returns a verified handoff receipt bound to
release, QR, and integrity metadata. Package assembly now records whether
publisher files were copied from the package-scoped approved promotion root or
from the temporary compatibility flat root. A publisher handoff that omits
that fact can appear complete while hiding an unapproved source boundary.

## Decision

Extend the verified local-package handoff with `approvedAssetSourceScope` and
`copiedAssetCount`. Build both values from the immutable assembly record and
validate them before a handoff is returned. Accept the legacy flat-root value
only as explicitly labelled compatibility evidence; package-scoped promotion
is the intended saleable-pilot path.

The handoff remains read-only metadata. It does not export raw files, create
learner records, mutate QR aliases, activate hosted persistence, or enable
student-facing use.

## Consequences

- Publisher operators can see which approved asset custody boundary produced
  the package.
- Tampered or incomplete assembly metadata blocks the handoff receipt.
- Existing compatibility rehearsals remain readable while migration proceeds.
- A later export or installer workflow can consume this bounded receipt without
  inventing a second asset lineage model.

## Verification

The local package assembler behavior verifier asserts package-scoped promotion
and a positive copied-asset count in the handoff receipt. Runtime typecheck,
production build, and foundation-composition verification remain required.
