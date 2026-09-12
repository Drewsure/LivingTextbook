# ADR-0604: Backend Lifecycle Policy Contract

Status: Accepted

## Decision

Every migration specification must declare retention, export, and local
fallback policies. Every migration candidate must describe its purpose and
declare rollback or export needs.

## Why

The Living Textbook must support hosted, closed/local, and hybrid white-label
deployments. Storage shape alone is not enough: records need an explicit
lifecycle, a portable recovery path, and a documented local equivalent before
an adapter can be selected.

## Guardrails

- These are review contracts, not executable retention or export jobs.
- No live persistence, deletion, export, local file write, or student data
  storage is enabled by this rule.
- Vendor-specific behavior remains deferred until policy and backend selection
  gates pass.

## Consequences

Future backend work must preserve lifecycle policy alongside fields and
indexes. A definition without retention, export, or local-fallback intent is
incomplete and cannot be treated as adapter-ready.
