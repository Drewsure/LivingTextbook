# DR-679: Prototype Integration Gate Readiness Lane

Status: Accepted

## Decision

Prototype intake readiness now exposes an `integration-readiness-gates` lane
derived from the detailed prototype integration readiness gate collection.
Tenant summaries filter and validate only their own gate records. A gate
collection is not ready unless every scoped gate is structurally valid and
`ready-for-codex-review`.

## Rationale

- The handoff alert must consume the same detailed evidence that Codex reviews.
- Wrapper, fixture, event, audio, mobile, scoring, and Codex decision evidence
  must remain visible as a prerequisite to integration.
- A structurally valid preview or queue record must not be mistaken for an
  integration-ready package.

## Evidence

- `samplePrototypeIntakeReadinessSummary` includes the new lane.
- Tenant summaries derive the lane from tenant-filtered gate records.
- Prototype review verification checks the lane and source collection markers.
- No application import, route promotion, scoring mutation, or student
  assignment behavior was enabled.

This decision is recorded in
`docs/adr/0607-prototype-integration-gate-readiness-lane.md`.
