# ADR 0119: Release Candidate Durable Record

## Status

Accepted

## Context

The app now shows a pilot release candidate summary. That summary joins publish gate and approval ledger status, but it needs a future storage home before real pilot backend work starts.

## Decision

Add `package-release-candidate` as a durable record category, persistence boundary, hosted/local adapter write intent, and vendor-neutral backend schema entity.

## Consequences

- Release control remains portable across hosted and local deployments.
- Demo-visible and pilot-ready status can be stored separately from the detailed gate and ledger records.
- Backend implementation can map release candidate status without inventing a provider-specific shape later.

