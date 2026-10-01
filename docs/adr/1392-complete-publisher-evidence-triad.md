# ADR 1392: Require the complete publisher evidence triad

## Status

Accepted for review-only pilot foundation

## Context

Structured evidence declarations are useful only if the handoff cannot omit a
core review lane while still presenting itself as complete. Rights,
accessibility/caption, and scan evidence cover different risks and must remain
separately visible.

## Decision

Require one required request of each supported evidence kind in both the
publisher intake brief and the canonical submission manifest. Optional media
may still be explicitly omitted, but an intake cannot become structurally
complete with only a rights, accessibility, or scan record.

## Consequences

- Publisher handoffs fail early when a core evidence lane is absent.
- The manifest remains useful for later human adjudication because each lane is
  still path- and asset-bound.
- No upload, approval, release, QR print, persistence, or student-facing
  behavior is enabled by this validation.
