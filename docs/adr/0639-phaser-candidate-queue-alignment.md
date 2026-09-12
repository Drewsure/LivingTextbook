# ADR 0639: Phaser Candidate Queue Alignment

**Status:** Accepted for controlled prototype review  
**Date:** 2026-09-13

## Decision

Represent the frozen Z.ai Phaser Memory Match scene as the first tenant-scoped
prototype intake item, ahead of Balloon Pop. The queue must match the accepted
wrapper order in ADR 0635 and the canonical Memory Match integration in ADR
0636.

Memory Match remains `awaiting-evidence`, not ready for import or promotion.
Its review packet must prove a pairing payload adapter, pair-attempt events,
target-language audio, deterministic replay, and an accessible non-canvas or
equivalent fallback before a Phaser wrapper decision can be made.

## Rationale

The queue is an operational foundation surface. If it omits the first approved
candidate, teacher and reviewer workbenches can show a misleading integration
order and the platform loses traceability between the canonical slice and the
frozen source.

## Guardrails

- The source snapshot remains outside `apps/web` and `apps/ai-service`.
- Queue presence does not authorize source import, route replacement, scoring
  mutation, persistence, package promotion, or student assignment.
- Balloon Pop remains the second Phaser candidate and still requires timing,
  miss semantics, reduced-motion, and touch evidence.
