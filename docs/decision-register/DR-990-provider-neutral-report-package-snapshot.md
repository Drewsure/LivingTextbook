# DR-990: Provider-Neutral Report Package Snapshot

Decision: require a canonical, provider-neutral report-package snapshot in the
teacher report persistence rehearsal and support both hosted-managed and
local-classroom deployment modes with the same privacy and no-side-effect rules.

Required invariants:

- Tenant, package, and launch identity must match the report aggregation.
- Snapshot export and writes remain false.
- Raw event records, learner audio, transcripts, and real learner identifiers
  remain excluded.
- Event acceptance and envelope-gate summaries are preserved.
- Provider selection and activation remain separate future decisions.

Evidence: `docs/adr/0918-provider-neutral-report-package-snapshot.md`,
`packages/content-model/src/teacherReportPackageSnapshot.ts`, and
`packages/content-model/src/teacherReportPersistenceRuntime.ts`.
