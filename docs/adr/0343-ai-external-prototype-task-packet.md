# ADR 0343: AI External Prototype Task Packet

Status: accepted

## Context

Generated game build briefs explain what an outside builder can prototype, and prototype return reviews explain what evidence must come back. The missing step was the handoff-facing task packet that turns a build brief into concrete instructions without making a live work order or integration permission.

## Decision

Add review-only AI external prototype task packets to `/teacher/generator/sample-publisher` and `/teacher/generator/ministar`.

The packet shows copy-ready task brief previews, source records, permitted handoff contents, required-before-handoff checks, repository scope, output-folder rules, mode tasks, fixture requirements, event requirements, audio requirements, deterministic scoring rules, deliverables, return evidence, and blocked actions.

Outside prototype work is scoped to `Drewsure/ministar-lab only` until Codex integration review accepts a wrapper-first plan.

## Consequences

- Z.ai and other outside builders can receive strict, consistent instructions.
- Phaser remains allowed where it is the right surface, but only as a wrapper candidate.
- DOM reference prototypes remain preferred for text, syntax, spelling, and report-heavy modes.
- The panel does not create a live handoff, app patch, route, score authority, playlist, package, reward, assignment, or student-facing preview.
- MiniStar packets keep Japanese support-language progress blocked while English remains the target-language trigger.
