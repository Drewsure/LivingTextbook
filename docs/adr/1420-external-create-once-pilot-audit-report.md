# ADR 1420: External Create-Once Pilot Audit Report

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

The first saleable pilot requires a durable operator handoff. Console output
is easy to lose, while storing a report in the application repository would
mix external publisher evidence with platform source and could be mistaken for
release state.

## Decision

The first-pilot audit supports `--output <path>` for a metadata-only JSON
report. The path must be outside the LivingTextbook repository, the report is
create-once, and it records the current source-bound production revision,
status, checks, and next actions. The report never grants approval or
activation.

## Consequences

- Publisher operators can preserve an auditable review handoff.
- Waiting-human and blocked states remain visible instead of being hidden by a
  successful command exit or a stale file.
- The report does not contain raw publisher files, learner data, credentials,
  or protected-action permissions.

See `docs/decision-register/DR-1420-external-create-once-pilot-audit-report.md`.
