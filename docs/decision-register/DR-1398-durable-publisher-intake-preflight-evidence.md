# DR-1398: Durable Publisher Intake Preflight Evidence

- **Decision:** Allow an explicit `--output` path for the publisher intake
  preflight report, written with create-once semantics.
- **Why:** A publisher handoff needs durable inventory evidence that can be
  attached to later source review; terminal output alone is not durable.
- **Safety:** The report is bounded metadata only. It does not promote files,
  assemble packages, print QR codes, activate persistence, or enable students.
- **Verification:** Publisher intake self-test, intake-kit verifier, and pilot
  package execution runbook verifier pass.
- **Related ADR:** `docs/adr/1398-durable-publisher-intake-preflight-evidence.md`.
