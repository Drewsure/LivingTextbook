# ADR 0449: Package Writer Assignment Handoff Evidence Packet Storage Contract

Status: Accepted

Date: 2026-08-28

## Context

Assignment handoff evidence packets now make generated-package assignment proof visible after the assignment shell guard. Before any hosted, installed PWA, desktop, or local-classroom implementation can rely on that packet, its storage shape must be backend-neutral and explicit.

## Decision

Add `ai_generated_package_writer_assignment_handoff_evidence_packet` as a backend schema entity, migration candidate, migration spec, durable record contract, and active route verification expectation.

The record preserves assignment shell guard lineage, package preview id, assignment preview id, evidence lanes, missing evidence, blocked handoff actions, next required records, rollout gate requirements, report policy requirements, rollback evidence, and support-language boundaries.

## Consequences

- Assignment handoff evidence can become durable later without selecting a storage vendor now.
- Assignment handoff, private assignment link activation, roster binding, progress streams, teacher report export, live classroom launch, generated assignment activation, writer execution, raw learner audio/transcript storage, and support-language-only handoff remain blocked.
- MiniStar keeps English as the target-language progress trigger and keeps Foundation/Bronze/Plus Japanese support hiragana-only and support-only.
