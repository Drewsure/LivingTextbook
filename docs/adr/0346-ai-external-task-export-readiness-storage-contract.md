# ADR 0346: AI External Task Export Readiness Storage Contract

Status: accepted

## Context

The teacher generator now shows an external task export readiness gate, but future hosted and closed-local deployments need the same record shape before export tooling, prompt-copy actions, repository issue creation, archive downloads, or outside-builder handoff workflows can exist.

## Decision

Add backend-neutral storage coverage for `ai_external_task_export_readiness_gate` / `ai-external-task-export-readiness-gate`.

Hosted and local adapters must preserve export channels, readiness checks, blocked export actions, reviewer identity requirement, evidence storage requirement, external repository policy requirement, return-review intake requirement, and Codex owner confirmation requirement.

## Consequences

- Export readiness remains auditable before it becomes operational.
- Prompt copy, repository issue creation, archive download, live handoff, app writes, route creation, scoring authority, student-facing pathways, and support-language progress stay blocked.
- Z.ai or other outside-builder work can be prepared without becoming an uncontrolled production workflow.
- MiniStar support-language progress remains blocked while English remains the target-language trigger.
