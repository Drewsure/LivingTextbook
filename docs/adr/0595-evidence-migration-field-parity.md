# ADR-0595: Evidence Migration Field Parity

Status: Accepted

## Decision

Evidence packet and evidence attachment migration specifications must declare
the required identity, scope_kind, and tenant_id fields that the
vendor-neutral schema requires.

The backend contract alignment validator checks this parity before migration
design is treated as coherent.

## Why

Tenant scope written only in prose, a tenantScope string, or an index
description is not enough for an implementable migration. The field must exist
in the record shape that a hosted or local store will actually create.

## Guardrails

- Migration parity does not enable live persistence.
- Upload, approval, promotion, download, and student-facing use remain
  independently blocked.
- The required-field map is intentionally narrow until broader migration
  implementation begins.

## Consequences

Backend candidates cannot quietly omit tenant ownership while still claiming to
support the evidence schema. The same explicit record shape can be used by the
hosted and closed/local white-label deployments.
