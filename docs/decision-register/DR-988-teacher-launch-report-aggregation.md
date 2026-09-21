# DR-988: Teacher Launch Report Aggregation

Decision: return a deterministic, pseudonymous, read-only report summary
alongside the already authorized launch-scoped event review response.

Required invariants:

- Scope is tenant + reviewed package + launch only.
- Raw student session identifiers, learner audio, and transcripts stay out of
  the aggregation response and rendered panel.
- Event effects remain distinct, with target-language progress as the only
  progression-bearing category.
- Reward totals use an explicit delta-versus-cumulative snapshot rule.
- The response cannot be used as export authorization or live-session control.

Evidence: `docs/adr/0916-teacher-launch-report-aggregation.md`,
`packages/content-model/src/teacherLaunchReportAggregation.ts`, and
`scripts/verify-teacher-launch-report-aggregation.mjs`.
