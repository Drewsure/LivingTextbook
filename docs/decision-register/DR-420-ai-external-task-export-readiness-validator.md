# DR-420: AI External Task Export Readiness Validator

Date: 2026-08-14

## Decision

AI external prototype task export readiness gates now use a shared content-model validator before prompt copy, repository issue creation, archive download, live handoff, returned prototype review, app patch planning, route integration, scoring changes, package assembly, student-facing pathways, or assignment can be considered.

## Rationale

The task packet may be copy-ready for planning, but the product must not expose real handoff actions until reviewer identity, evidence storage, repository boundaries, return-review intake, and Codex ownership are explicit. A shared guard keeps the export surface blocked in the same way across sample data, teacher routes, and future storage adapters.

## Rules Preserved

- Export gates must stay `blocked`.
- Required source records include the external prototype task packet, responsibility matrix, reviewer runbook, review summary, reviewer identity signature gate, evidence packet, and prototype return review.
- Manual prompt copy, repository issue creation, and task archive download channels must remain blocked.
- Readiness checks must include reviewer identity, evidence storage, durable task packet storage, repository policy, and return-review intake.
- Codex owner confirmation is required before any future export action.
- Task export, prompt copy, issue creation, archive download, live handoff, app writes, route creation, scoring authority, student-facing pathways, and support-language progress remain blocked.
- MiniStar gates must block Japanese support-language progress.

## Consequences

Teacher generator routes now surface `Export readiness guard active`, `Export readiness guard blocks`, and `Export readiness guard warnings`. `verify:ai-generator` fails if the shared validator, sample guard exports, or visible guard labels are removed.
