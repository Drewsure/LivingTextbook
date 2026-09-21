# ADR 0916: Deterministic Teacher Launch Report Aggregation

## Decision

Add a shared, deterministic aggregation contract for authorized teacher review
of one tenant, reviewed package, and classroom launch. The aggregation is a
read-only summary over already validated event streams; it is not a report
export, roster lookup, learner identity service, or live-classroom authority.

## Required invariants

- Records must match the requested tenant, package, and launch scope.
- Learner slots are deterministic pseudonyms derived from the stored session
  key; raw session identifiers never appear in the report shape or UI.
- Progress-affecting, report-only, and support-only events remain separately
  counted. Support-language and media-only evidence cannot become progression.
- Star Dust is deterministic: explicit `starDustAwarded` values are treated as
  deltas; cumulative `earnedStarDust` snapshots are counted once per stream.
- Raw learner audio, learner transcripts, and real learner identifiers are
  explicitly excluded.
- Stable ordering is required so review screens and future exports do not
  change merely because storage returned records in a different order.
- The report does not authorize export, mutation, live launch, or broader
  student discovery.

## Consequences

Teachers receive useful launch-level evidence without needing raw event
inspection. A future export or analytics service can consume this contract only
after separate policy, retention, identity, and release gates are approved.

## Evidence

- `packages/content-model/src/teacherLaunchReportAggregation.ts`
- `apps/web/src/app/api/persistence/events/route.ts`
- `apps/web/src/features/persistence/HostedProgressEventReviewPanel.tsx`
- `scripts/verify-teacher-launch-report-aggregation.mjs`
