# ADR 0836: Teacher Report Rehearsal Surface

## Status

Accepted for foundation hardening.

## Context

The report persistence rehearsal was verified in the content model, but a
teacher could not see whether the report request, adapter intent, and durable
record were aligned on the reporting surfaces.

## Decision

Expose one reusable, read-only rehearsal panel on the reporting workbench and
the per-session report-package preview routes. Resolve its state from the
existing tenant-scoped sample contracts and keep all live actions blocked.

## Consequences

- Teachers and publisher reviewers can see the real blockers before provider
  work begins.
- MiniStar and partner tenants exercise the same white-label component path.
- The UI remains evidence only and cannot be mistaken for live persistence or
  report export readiness.
