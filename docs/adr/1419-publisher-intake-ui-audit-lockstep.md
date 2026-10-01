# ADR 1419: Keep Publisher Intake UI And Audit In Lockstep

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

The publisher intake process has both a command-line audit and a teacher/admin
requirements workspace. If those surfaces describe different evidence paths,
an operator can follow the UI and still produce a handoff the audit cannot
trust.

## Decision

The requirements workspace must show the canonical durable preflight command,
the `evidence/publisher-intake-preflight.json` output path, the checksum-bound
brief rule, and the actions that remain blocked. The intake-kit verifier must
assert these markers alongside the generator and preflight contract.

## Consequences

- Publisher operators receive one consistent handoff procedure.
- Review-only boundaries stay visible at the point of work.
- The UI remains metadata-only and does not access arbitrary local files or
  activate protected workflows.

See `docs/decision-register/DR-1419-publisher-intake-ui-audit-lockstep.md`.
