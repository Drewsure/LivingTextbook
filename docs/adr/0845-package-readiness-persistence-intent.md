# ADR 0845: Package Readiness Persistence Intent

## Status

Accepted for foundation scaffolding; implementation remains review-only.

## Decision

Represent package readiness reconciliation as a first-class tenant-scoped
metadata intent before selecting a hosted or local persistence provider.

The intent carries the seven evidence-lane references and keeps provider
selection, storage writes, package promotion, route/playlist/assignment writes,
local bundle writes, and student activation explicitly blocked.

## Rationale

The reconciliation is the durable join between source intake, approval,
verification, language audio, media rights, publishing, and assignment review.
Keeping it as a named record prevents a future adapter from reconstructing
release readiness from UI state or from a partial package record. The same
shape can support a hosted publisher pilot and a closed local textbook
companion without making either deployment the universal architecture.

## Consequences

- Hosted and local adapter plans must preserve the same evidence references.
- Provider-neutral metadata can be reviewed before a paid backend is chosen.
- The record remains non-student data and excludes raw audio and transcripts.
- A later persistence implementation still needs retention, export, policy,
  authorization, backup, migration, and rollback decisions.

## Excluded

Real storage writes, provider credentials, migrations, file uploads, signed
URLs, evidence downloads, package promotion, route mutation, assignment
creation, and classroom launch.
