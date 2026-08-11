# DR-417: AI Generator Lineage Map Validator

Date: 2026-08-11

## Decision

AI generator lineage maps now use a shared content-model validator before request-to-review chains can inform future package review, promotion, or writer decisions.

## Rationale

Lineage maps are powerful because they connect prompt, draft, correction, verifier, manifest, publish readiness, and teacher review evidence. That same power creates risk if a lineage map is treated like approval to assemble or publish. The shared guard keeps lineage inspection-only and blocks every student-facing shortcut.

## Rules Preserved

- Lineage maps must stay in `Lineage review only` state.
- Required records are generator request, prompt package, Draft JSON preview, correction queue, verifier packet, generated manifest, publish readiness, and teacher review handoff.
- Lineage maps must block live generation, verifier submission, package assembly, route creation, playlist creation, local bundle writes, student assignment, and student-ready markers.
- MiniStar lineage must keep Japanese support-language unlocks blocked while English remains the target-language trigger.

## Consequences

Teacher generator routes now surface `Lineage guard active`, `Lineage guard blocks`, and `Lineage guard warnings`. `verify:ai-generator` fails if the shared validator, sample guard exports, or visible guard labels are removed.
