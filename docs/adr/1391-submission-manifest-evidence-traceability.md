# ADR 1391: Preserve publisher evidence traceability in the submission manifest

## Status

Accepted for review-only pilot foundation

## Context

The publisher intake brief now declares rights, accessibility/caption, and
scan evidence requests. If the adapter drops those declarations when it builds
the canonical submission manifest, later reviewers can see that evidence is
required but cannot see which record covers which asset.

## Decision

Add a review-only `evidenceRequests` collection to the canonical publisher
submission manifest. Each record preserves the intake reference id, evidence
kind, safe relative path, required state, review status, and resolved manifest
asset ids. The adapter rejects unresolved coverage through the existing intake
validation and the manifest validator rejects unknown asset ids.

## Consequences

- Publisher intake and package review share one evidence identity trail.
- Teacher review can expose exact coverage without accepting files or proving
  approval.
- Existing release, promotion, QR, persistence, and student-use gates remain
  unchanged and blocked.
- Future evidence adjudication can consume canonical asset ids instead of
  re-parsing publisher paths.
