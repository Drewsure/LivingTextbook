# ADR 0922: Reporting Workbench Recovery Coverage

## Status

Accepted for foundation review; report recovery remains non-executing.

## Decision

Show the provider-neutral report snapshot recovery rehearsal for both the
MiniStar and sample publisher contexts on the teacher reporting workbench.
Each context is resolved independently from its tenant-aware launch monitor.

## Rationale

The reporting workbench is the comparison point for a saleable white-label
platform. It must demonstrate that a flagship tenant and a publisher tenant
can share the same report contract without sharing identity, package scope,
or recovery authority. The rehearsal remains evidence only while storage,
policy, retention, and release gates are unfinished.

## Required Invariants

- MiniStar and sample publisher contexts remain tenant/package/launch scoped.
- Both contexts use the canonical hosted/local snapshot recovery contract.
- No report export, backup, restore, provider write, or progression mutation is
  exposed.
- Raw events, learner audio, transcripts, and real learner identifiers remain
  excluded.

## Evidence

- `apps/web/src/app/teacher/reporting/page.tsx`
- `apps/web/src/data/sampleTeacherReportSnapshotRecoveryRehearsal.ts`
- `scripts/verify-active-routes.mjs`

