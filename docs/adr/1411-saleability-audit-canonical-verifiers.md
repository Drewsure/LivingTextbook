# ADR 1411: Saleability Audit Must Reuse Canonical Evidence Verifiers

## Status

Accepted for the first-pilot audit.

## Context

The saleability audit distinguishes platform proof from human-owned publisher,
outside-game, delivery, and release evidence. A shallow directory check would
weaken that boundary by treating an incomplete folder or a marker manifest as
reviewed evidence.

## Decision

When a publisher root is supplied, run `publisher-pilot-intake-preflight.mjs`.
When a Z.ai candidate root is supplied, run
`verify-phaser-candidate-package.mjs` with the isolated candidate root. Mark
the corresponding audit check proved only when the canonical verifier exits
successfully.

## Consequences

The audit has one source of truth for package and candidate validity. It may
report a supplied root as blocked, which is correct and more useful than a
false-ready status. No source import, assembly, release, QR print, or student
activation is introduced.
