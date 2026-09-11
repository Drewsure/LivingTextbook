# ADR 0587: Prototype Return Readiness Summary Contract

Status: Accepted

## Decision

Validate every prototype-return readiness summary as a structured review contract. The validator must require summary identity, unique lane IDs, supported lane statuses, a status derived from those lanes, a matching Codex return-review state, and explicit blocked next actions.

## Context

The returned-package summary is the last review surface before a future Codex integration decision. A stale status or duplicated lane could make an incomplete outside prototype appear ready for return review even when no import is permitted.

## Consequences

- Return-review panels cannot present stale or internally contradictory readiness.
- Intake and return summaries now use parallel contract discipline.
- Missing source manifests, fixture replay, audio, mobile, and scoring proof remain visible without enabling archive import.
- The validator remains provider-neutral and does not authorize live writes.

## Verification

Runtime behavior must cover valid, stale-status, and duplicate-lane summaries. Prototype-review verification, web typecheck, full foundation verification, production build, and active route checks remain required.
