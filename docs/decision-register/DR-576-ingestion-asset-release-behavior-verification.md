# DR-576: Ingestion, Asset, And Release Behavior Verification

Status: Accepted

Decision: Extend the compiled-contract behavior harness to cover multimedia asset safety, textbook source ingestion safety, and release-control behavior.

Rationale:

- The white-label workflow depends on PDF/text intake and image, audio, video, and font assets.
- Static readiness checks do not prove that unsafe promotion cases are rejected at runtime.
- Release validation must remain separate from release activation.

Guardrails:

- Learner-recorded media remains excluded from the core asset runtime.
- Raw source files cannot become student payloads.
- Review-only asset, source, and release adapters return `sideEffect: "none"`.
- The harness performs no upload, provider call, storage write, release activation, or learner-data collection.
