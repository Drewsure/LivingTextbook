# ADR-0411: Generator Prototype Review Cross-Links

Date: 2026-08-21

## Status

Accepted.

## Context

The generator and prototype review routes now split related but distinct responsibilities. Future reviewers need to reach prototype handoff evidence from the generator context without mistaking the link for approval to export, import, or patch code.

## Decision

Add review-only navigation links from each tenant generator route to the matching `/teacher/prototypes/[tenantId]` route.

## Consequences

- Positive: Generator review and prototype review remain connected.
- Positive: Z.ai discussions can move from request context to evidence gates quickly.
- Constraint: The link remains navigation only and cannot authorize handoff, import, patch, scoring, audio, package, assignment, or storage behavior.

## Verification

See `docs/decision-register/DR-482-generator-prototype-review-cross-links.md`.
