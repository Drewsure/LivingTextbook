# DR-419: AI External Prototype Task Packet Validator

Date: 2026-08-14

## Decision

AI external prototype task packets now use a shared content-model validator before prompt copy, issue creation, archive export, live handoff, returned prototype review, app patch planning, route integration, scoring changes, reward work, playlist creation, package assembly, student-facing preview, or assignment can be considered.

## Rationale

Copy-ready Z.ai instructions are useful only when they stay inside strict boundaries. The shared guard lets the platform give external builders concrete tasks while keeping repository scope, fixture replay, standard events, audio, scoring, return evidence, and Codex review intact.

## Rules Preserved

- Task packets must stay `review-only` with `No live handoff`.
- Required source records include the generated build brief, responsibility matrix, reviewer runbook, engine binding, standard event contract, audio cue manifest, and reward readiness gate.
- Handoff scope remains `Drewsure/ministar-lab only`.
- Codex confirmation is required before any external handoff.
- Every task must require supplied fixtures, no hard-coded content, standard events, audio cue coverage, deterministic scoring, deliverables, return evidence, and Codex integration review.
- App writes, route creation, scoring authority, reward inventory writes, playlist creation, package assembly, assignments, production merge, direct import, audio manifest mutation, and student-facing previews remain blocked.

## Consequences

Teacher generator routes now surface `External task guard active`, `External task guard blocks`, and `External task guard warnings`. `verify:ai-generator` fails if the shared validator, sample guard exports, or visible guard labels are removed.
