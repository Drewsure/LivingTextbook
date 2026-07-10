# ADR 0123: Teacher Report Package Storage Contract

## Status

Accepted

## Context

Teacher session pages now render a report package boundary, but the persistence planning still treated reporting mainly as export policy and event storage.

## Decision

Add a teacher report package storage contract across durable records, persistence boundaries, adapter write intents, backend schema draft, migration candidates, and migration specs.

## Consequences

- Future backend selection can evaluate report packages directly.
- Hosted and local deployments preserve the same reporting vocabulary.
- Teacher report exports remain policy-gated and audit-ready.
- Core reporting continues to reject raw learner audio and transcripts.
