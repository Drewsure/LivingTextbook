# DR-520: Package Writer Assignment Handoff Evidence Packet Storage Contract

Status: Accepted

Decision: Add a backend-neutral storage contract for assignment handoff evidence packets.

White-label impact: Positive. Assignment handoff evidence can be persisted consistently for hosted, installed PWA, desktop, and local-classroom deployments without hard-coding one school workflow or storage vendor.

Cost impact: Positive. The storage contract prevents expensive support and privacy issues by keeping assignment handoff, reporting, roster, launch, rollback, raw audio, transcript, and support-language proof auditable before live assignment features exist.

Constraints:

- Preserve assignment shell guard lineage, package preview id, assignment preview id, evidence lanes, missing evidence, blocked handoff actions, next records, rollout gate requirements, report policy requirements, rollback evidence, and support-language boundaries.
- Do not enable assignment handoff, private assignment links, roster binding, progress streams, teacher report export, live classroom launch, raw learner audio/transcript storage, generated assignment activation, writer execution, or support-language-only handoff.
- MiniStar keeps English target-language progress and hiragana-only Japanese support.

ADR: `docs/adr/0449-package-writer-assignment-handoff-evidence-packet-storage-contract.md`
