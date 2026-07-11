# ADR 0134: Local Companion Release Gate

## Status

Accepted

## Context

The local companion preview now shows bundled games, media, QR fallback, handoff requirements, a generated manifest snapshot, and deployment preflight checks. The platform still needed a concise release decision that separates a useful planning preview from a closed local product that can be handed to a publisher or school.

## Decision

Add a local companion release gate to `/local/sample-publisher`.

The gate summarizes pass, warning, and blocked items across source review, media rights, installer/update strategy, backup/restore/export, QR/deep-link fallback, game audio/reporting coverage, and school access/privacy policy.

## Consequences

- Local companion packages can be previewed without implying they are release-ready.
- The white-label product path now has an explicit closed-package handoff blocker.
- Future local application work must clear release gate blockers before being described as production-ready.
