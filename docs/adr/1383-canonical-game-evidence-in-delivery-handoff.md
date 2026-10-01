# ADR 1383: Carry Canonical Game Evidence Into Delivery Handoff

## Status

Accepted for the review-only pilot foundation.

## Decision

The metadata-only publisher delivery handoff must carry the exact canonical
game-derived evidence IDs from package review. A reviewed package handoff is
invalid if its status claims complete package evidence without the complete
canonical game set.

## Why

The delivery handoff is the shared inspection point for local, hosted, and
hybrid delivery. Preserving only origin counts was insufficient for a reviewer
to trace the game readiness claim back to its three required records.

## Boundary

The handoff remains blocked, review-only, and payload-free. This does not
authorize package assembly, QR printing, persistence activation, or student
access.

## Verification

The delivery handoff verifier checks the complete set, rejects an incomplete
set, and confirms the panel exposes the canonical IDs without write controls.
