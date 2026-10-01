# ADR 1387: Closure Review Names Canonical Game Evidence

## Status

Accepted for the review-only pilot foundation.

## Decision

The publisher delivery closure packet must include a dedicated
`canonical-game-evidence` check in addition to the general package-evidence
check. Its status is derived from the complete curated activity pathway,
canonical game integration, and package game-audio evidence set.

## Why

The first saleable pilot promises reviewed games, not merely a package that
contains a generic game lane. Naming the canonical set at closure makes the
final publisher handoff auditable and keeps the writer, runtime, and closure
contracts aligned.

## Boundary

The closure packet remains blocked, review-only, and side-effect-free. The new
check does not authorize release, QR printing, persistence activation, or
student-facing use.

## Verification

The closure-packet verifier now requires eleven checks and confirms the
canonical game evidence check is present in the live readiness route.
