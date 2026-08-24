# ADR 0427: Prototype Intake Evidence Packet Flow

## Status

Accepted.

## Context

Prototype intake now has a visible queue and storage guard. Future Z.ai or outside game work still needs a clear evidence packet structure before Codex can consider return review or wrapper review.

## Decision

Add `samplePrototypeIntakeEvidencePacketFlow` using the existing `EvidencePacketFlowPanel`.

Render the flow on:

- `/teacher/game-readiness`
- `/teacher/prototypes/[tenantId]`

The flow requires source snapshot, fixture replay, event/scoring replay, target-language audio coverage, mobile accessibility, and wrapper-boundary evidence.

## Consequences

The build now shows what external prototypes must return before controlled review can advance.

This does not create prototype upload, import, app patch, route replacement, scoring mutation, reward write, playlist write, package promotion, assignment, or support-language progress behavior.
