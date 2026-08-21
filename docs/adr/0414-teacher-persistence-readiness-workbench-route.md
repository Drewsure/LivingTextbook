# ADR 0414: Teacher Persistence Readiness Workbench Route

Date: 2026-08-21

## Status

Accepted

## Context

The project already has backend decision, schema, migration, persistence boundary, and adapter-readiness panels. Those panels are visible in the broad teacher intake route, but white-label and local deployment decisions need a focused review surface before real uploads, report export, learner data storage, or package writer work begins.

## Decision

Create `/teacher/persistence` as a dedicated review-only persistence workbench.

## Consequences

- Backend and local deployment review becomes easier to access.
- Vendor selection remains blocked.
- Storage write behavior remains blocked.
- Active route verification now protects the new route.

