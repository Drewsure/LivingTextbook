# ADR 1289: Tenant-Scoped Upload Review Workspace

Date: 2026-09-30  
Status: Accepted

## Context

The saleable white-label pilot must let a publisher review textbook, image,
audio, and video intake for its own tenant. The upload workspace had been
limited to the sample publisher even though the underlying quarantine endpoint
already carried an explicit tenant boundary and remained disabled by default.
That application-level restriction would prevent a future publisher package
from reaching the controlled review surface.

## Decision

Resolve the teacher upload workspace through the shared tenant resolver. Known
tenants retain their package-owned configuration, while a safe, generic
white-label shell supports review-only surfaces before a complete tenant
package exists. Tenant ids must pass the safe identifier policy.

The generic shell does not imply tenant activation. The quarantine feature
remains opt-in and disabled unless its server policy is explicitly enabled.
Authorization, checksum, scan, rights, evidence, promotion, assignment, QR,
playlist, package-release, and student-use gates remain independent and
fail-closed.

## Consequences

- A second publisher can reach the same structured upload review workspace
  without MiniStar-only application assumptions.
- Branding and language defaults are safe placeholders until the publisher
  package supplies approved tenant configuration.
- The route is more reusable, but it must not be mistaken for a production
  upload or release authorization.
- The upload readiness verifier now protects the shared resolver boundary and
  rejects a return to sample-publisher hard-coding.

## Rejected alternative

Keep the route permanently limited to `sample-publisher`. This would make the
white-label pilot appear tenant-aware in data contracts while failing at the
first teacher-facing intake step.
