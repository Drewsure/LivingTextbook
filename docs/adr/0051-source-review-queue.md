# ADR 0051: Source Review Queue Before Package Release

Date: 2026-07-09

Status: accepted

## Context

The teacher intake page already shows package readiness and release gates. It needs a clearer stage for raw textbook and multimedia files before those files become reviewed unit packages.

## Decision

Add a source review queue to `/teacher/intake`.

The queue tracks:

- Source kind.
- Source reference.
- Owner.
- Extraction plan.
- Review needs.
- Blockers.
- Output candidate.

## Implications

Source intake is now visibly review-first.

Future PDF/import automation must feed this queue and cannot bypass package review or rights review.
