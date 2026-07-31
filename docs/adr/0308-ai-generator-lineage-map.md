# ADR 0308: AI Generator Lineage Map

Status: Accepted  
Date: 2026-07-31

## Decision

Add an inspection-only AI generator lineage map to teacher generator routes.

The map traces each generated request from request draft through prompt package, Draft JSON preview, correction queue, verifier packet, generated package manifest, publish readiness gate, and teacher review queue item.

## Rationale

The generator surface has grown several review gates. Teachers, reviewers, and future AI agents need one compact place to understand the whole chain without inferring lineage from many panels. A lineage map also reinforces that generated content is evidence-first and cannot skip review, audio, rights, approval, storage, release-control, or launch-safety gates.

## Consequences

- `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` show request-to-review lineage.
- MiniStar lineage explicitly preserves English as target-language trigger and Japanese as hiragana-only support.
- Live generation, verifier submission, package assembly, route creation, playlist creation, assignment, local bundle writes, support-language unlocks, and student-ready state remain blocked from the lineage map.
