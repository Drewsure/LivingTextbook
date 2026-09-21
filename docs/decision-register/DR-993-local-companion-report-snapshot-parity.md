# DR-993: Local Companion Report Snapshot Parity

Decision: show the shared report snapshot recovery rehearsal in both local
companion previews. Resolve each preview from its tenant-aware sample context,
while keeping local writes, recovery execution, export, and activation
blocked.

Required invariants:

- MiniStar and sample publisher local routes remain tenant-specific.
- Hosted-managed and closed-local checks use the canonical snapshot contract.
- The panel is evidence only and does not create a local file or store.
- Raw events, learner audio, transcripts, and real learner identifiers remain
  excluded.

Evidence: `docs/adr/0921-local-companion-report-snapshot-parity.md`,
`apps/web/src/features/deployment/LocalCompanionPackagePreviewPanel.tsx`,
and `scripts/verify-active-routes.mjs`.

