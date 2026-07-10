# ADR 0126: Publisher Maintenance Change Storage Contract

## Status

Accepted

## Context

Publisher maintenance change requests now appear in `/teacher/intake`, but they needed a backend-agnostic record shape for future partner self-maintenance.

## Decision

Add a publisher maintenance change storage contract across durable records, hosted/local adapter write intents, backend schema draft, migration candidates, and migration specs.

## Consequences

- White-label partner maintenance has a clearer path from review queue to release candidate.
- Hosted and closed/local deployments use the same maintenance vocabulary.
- Active routes, media manifests, game offers, and report packages remain protected until release review passes.
- The platform avoids manual year-on-year update procedures that would be hard to scale.
