# ADR 0775: Teacher Reporting Contract Types

## Status

Accepted

## Context

Reusable teacher reporting panels imported their public TypeScript contracts
from `sampleTeacherSessionMonitor.ts`. Although most imports were type-only,
that made a demo provider module appear to be the reporting domain boundary
and encouraged future feature code to depend on sample data.

## Decision

Teacher session monitor metrics, roster-aware context, preflight gates, event
acceptance gates, launch gates, pilot snapshots, and report package boundaries
are owned by `features/teacher/teacherSessionMonitorTypes.ts`. The sample
monitor remains responsible for constructing demo records and importing those
contracts, while reusable panels import only the feature-owned types.

## Consequences

Hosted, local, and partner reporting providers can return the same contract
without importing or extending a sample data module. Demo behavior remains
unchanged, and missing persistence or policy continues to be represented as a
review state.

## Verification

Run `npm run typecheck --workspace @living-textbook/web`,
`npm run verify:foundation-composition`, and `npm run verify:routes`.
