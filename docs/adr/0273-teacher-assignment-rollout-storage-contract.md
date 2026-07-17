# ADR 0273: Teacher Assignment Rollout Storage Contract

Date: 2026-07-17

Status: accepted

## Context

Assignment rollout is now visible as the gate between reviewed assignment previews and scheduled classroom pilots. Without a durable storage contract, a future hosted or local implementation could treat demo-preview, blocked, ready-to-schedule, and pilot-ready states as UI-only state.

## Decision

Add `teacher_assignment_rollout_gate` / `teacher-assignment-rollout-gate` as a backend-neutral storage contract.

The contract preserves rollout status, gate summary, gate evidence, blockers, and teacher-visible scheduling rules. It blocks scheduling, student launch, live classroom launch, real learner data collection, and report export until later launch, school policy, route, media, persistence, privacy, and reporting gates pass.

## Consequences

- Hosted and local deployments use the same record vocabulary.
- Demo-preview and blocked rollouts cannot become scheduled pilots by URL access, local bundle presence, or package draft status.
- Teacher-visible rollout gates remain review and planning artifacts until live classroom policy and persistence are accepted.
