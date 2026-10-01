# ADR 1389: Bridge Structured QR Preview Into Package Review

## Status

Accepted for review-only pilot architecture.

## Decision

The Sample Publisher package preview derives its QR entries from the
structured publisher intake QR preview through a shared, fail-closed adapter.
The adapter requires matching tenant, package, and version identities and
preserves the printed QR id, stable alias, and package-bound local fallback.

## Why

Maintaining one QR list in the intake workspace and another in the package
preview creates a white-label provenance gap. A publisher could see one alias
at intake and a different alias in delivery review. A shared adapter keeps the
review surfaces consistent and makes identity drift visible early.

## Boundaries

The adapter is pure metadata mapping. It does not write a QR registry, create
or mutate routes, authorize print, activate hosted persistence, create learner
records, or enable student-facing use. Those actions remain behind the release,
rollback, durable-registry, print-authorization, persistence, and student
safety gates.

## Verification

`node scripts/verify-publisher-pilot-qr-preview-adapter.mjs`

The verifier covers stable identity preservation, print blocking, package
fallback binding, and tenant-drift rejection.
