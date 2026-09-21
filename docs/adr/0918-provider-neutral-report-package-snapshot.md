# ADR 0918: Provider-Neutral Report Package Snapshot

## Decision

Define one provider-neutral teacher report-package snapshot shape for hosted
and closed/local deployments. The snapshot carries the sanitized launch report,
package boundary, event acceptance summary, settings-independent export plan
summary, and envelope-gate summary without embedding raw event records.

## Required invariants

- `deploymentMode` may be `hosted-managed` or `local-classroom`, but the
  snapshot shape and privacy rules are identical.
- The snapshot is tenant, package, and launch scoped.
- `exportAllowed` and `writesAllowed` are always false in foundation mode.
- Raw learner audio, transcripts, real learner identifiers, and raw event
  records are excluded.
- Event acceptance and progress-event envelope gates remain part of the
  snapshot evidence.
- Provider choice, retention activation, export, and live classroom writes
  remain separate approval decisions.

## Consequences

Hosted and closed/local products can share report-package review tooling and
acceptance evidence without forcing the platform to choose a database or local
store prematurely. A future provider adapter must validate this same snapshot
before any mutation or export is considered.

## Evidence

- `packages/content-model/src/teacherReportPackageSnapshot.ts`
- `packages/content-model/src/teacherReportPersistenceRuntime.ts`
- `apps/web/src/data/sampleTeacherReportPersistenceRehearsal.ts`
- `scripts/verify-runtime-behavior.mjs`
