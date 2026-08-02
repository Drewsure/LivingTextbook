# ADR 0344: AI External Prototype Task Packet Storage Contract

Status: accepted

## Context

AI external prototype task packets are useful because they turn generated build briefs into concrete outside-builder instructions. Without a durable storage contract, those packets could later become informal live handoffs or untracked prototype assignments.

## Decision

Add backend-neutral storage coverage for `ai_external_prototype_task_packet` / `ai-external-prototype-task-packet`.

Hosted and local adapters must preserve repository scope, permitted handoff contents, required-before-handoff checks, mode tasks, standard event contract, audio cue manifest, deterministic scoring snapshot, return evidence requirements, and blocked handoff actions.

## Consequences

- Outside-builder task packets can be audited before export or return-review intake exists.
- Z.ai or other builder instructions remain separate from app writes, route creation, scoring authority, reward writes, playlist creation, package assembly, student-facing previews, and assignment.
- Closed local classroom deployments can back up the same task packet records without enabling offline workflow shortcuts.
- MiniStar support-language progress remains blocked while English remains the target-language trigger.
