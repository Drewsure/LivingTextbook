# DR-343: AI External Prototype Task Packet

Date: 2026-08-02

## Decision

The generator route now includes review-only AI external prototype task packets between generated build briefs and prototype return reviews.

## Why

We need to give outside builders such as Z.ai concrete, command-style instructions without letting the handoff become a production workflow. This keeps rapid prototype help available while preserving Codex ownership of architecture, parent-engine integration, event contracts, audio, scoring, route safety, and final review.

## Guardrails

- `Drewsure/ministar-lab only` for outside prototype output.
- No live handoff from the app.
- No app file writes.
- No route creation.
- No scoring authority.
- No reward inventory writes.
- No playlist creation.
- No package assembly.
- No student assignment.
- No student-facing preview.
- MiniStar Japanese remains support-only and cannot unlock progress.

## Follow-Up

Add a backend-neutral storage contract for `ai_external_prototype_task_packet` before any durable handoff, export, outside-builder assignment, or task-status workflow exists.
