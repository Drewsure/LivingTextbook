# ADR 0770: Balloon Pop Evidence Handoff

## Status

Accepted

## Context

The Selection parent engine now has executable foundation coverage, and the
frozen Z.ai snapshot contains Balloon Pop as a second candidate interaction.
The external handoff needs an explicit brief so timing, motion, misses, audio,
accessibility, and deterministic replay are not left to interpretation.

## Decision

Add a review-only Balloon Pop evidence request scoped to
`Drewsure/ministar-lab`. Memory Match remains the first candidate review;
Balloon Pop may be prepared in parallel but cannot be promoted or imported
without the same candidate package gate.

## Consequences

The Z.ai handoff now has a precise second candidate contract while preserving
tenant-neutral content, platform-owned scoring, audio-first interaction, and
source isolation. No route, persistence, assignment, or student behavior is
changed by this brief.

## Verification

Review `docs/agent-briefs/ZAI_BALLOON_POP_EVIDENCE_REQUEST.md` and run the
candidate package verifier only when an isolated return folder is supplied.
