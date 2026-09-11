# ADR 0586: Prototype Readiness Summary Contract

Status: Accepted

## Decision

Validate every prototype-intake readiness summary as a structured review contract. The validator must require tenant identity, unique lane IDs, supported lane statuses, a status derived from the lanes, a matching Codex-alert state, and explicit blocked next actions.

## Context

The readiness summary is the source of truth used to decide whether Codex may issue a future Z.ai handoff signal. Deriving the summary is not enough if a later edit can leave its status, lane collection, or alert label inconsistent.

## Consequences

- Review panels cannot present stale or internally contradictory readiness.
- Tenant scope remains explicit at the summary boundary.
- Missing package and evidence lanes remain visible without opening integration.
- The validator is provider-neutral and does not authorize live writes.

## Verification

Runtime behavior must cover valid, stale-status, and duplicate-lane summaries. Prototype-review verification, web typecheck, full foundation verification, production build, and active route checks remain required.
