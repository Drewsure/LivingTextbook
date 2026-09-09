# ADR-0517: Content Package Metadata Integrity

Status: Accepted

## Context

Content package metadata is reused across review, release, persistence, backup, report, and tenant workflows. A package with malformed or reversed timestamps cannot provide reliable lineage evidence.

## Decision

Validate package creation and update timestamps in the shared content model. Creation is required and parseable; update is optional but must be parseable and no earlier than creation.

## Consequences

- Package evidence is chronologically auditable before provider integration.
- Hosted, local, hybrid, and white-label tenants share the same metadata rule.
- Validation does not write storage, mutate release state, or activate routes.
