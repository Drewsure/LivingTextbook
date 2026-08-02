# DR-344: AI External Prototype Task Packet Storage Contract

Date: 2026-08-02

## Decision

The platform now defines a backend-neutral storage contract for AI external prototype task packets.

## Why

The task packet is intentionally copy-ready, but it must not become an informal live handoff. Storage rules need to preserve the exact source records, repository scope, task instructions, event/audio/scoring requirements, return evidence, and blocked actions before any future export, handoff, return review, or integration workflow exists.

## Required Blocks

- No live handoff.
- No app file writes.
- No external-builder scoring authority.
- No route creation.
- No reward inventory writes.
- No playlist creation.
- No package assembly.
- No student assignment.
- No student-facing preview.
- No support-language progress trigger.

## Follow-Up

Future handoff/export UI must depend on this record plus reviewer identity, evidence storage, and Codex integration review gates.
