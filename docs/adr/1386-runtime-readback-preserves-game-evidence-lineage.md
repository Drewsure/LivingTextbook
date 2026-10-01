# ADR 1386: Runtime Read-Back Preserves Game Evidence Lineage

## Status

Accepted for the review-only pilot foundation.

## Decision

The verified local package runtime summary and operator panel must preserve the
reviewed package-evidence status and exact canonical game-derived evidence
record IDs from the immutable package binding.

## Why

The saleable pilot needs one auditable evidence path from publisher review to
the assembled local handoff. Showing only routes, media, and checksums would
make the package readable while hiding whether the reviewed game promise was
actually carried forward.

## Boundary

This is bounded metadata read-back only. It exposes no publisher payloads,
creates no routes, changes no QR aliases, activates no persistence, and stores
no learner records.

## Verification

The local assembler rehearsal checks the three canonical game evidence IDs in
runtime read-back, and the production build/type checks cover the operator
panel contract.
