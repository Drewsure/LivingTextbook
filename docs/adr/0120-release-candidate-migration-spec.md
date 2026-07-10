# ADR 0120: Release Candidate Migration Spec

## Status

Accepted

## Context

Release candidate status is now represented in the durable record map, persistence boundary, adapter write intents, and backend schema draft.

## Decision

Extend backend migration candidates and migration specs with package release candidate status.

## Consequences

- Backend implementation can map release-control state consistently.
- Hosted and local storage paths preserve the same release-candidate vocabulary.
- Pilot-ready status remains derived from gates and approvals instead of a manual toggle.

