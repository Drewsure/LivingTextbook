# 2026-08-11: AI Generator Reviewer Runbook Validator

## Context

The AI generator reviewer runbook gives humans an ordered path through generator evidence. It needed a shared guard so future workflow work cannot mistake that order for approval to generate, patch, assemble, publish, or assign.

## Work Completed

- Added a shared content-model validator for AI generator reviewer runbooks.
- Reused the validator in sample reviewer runbook data and the reviewer runbook panel.
- Added visible guard blocks and warnings to teacher generator routes.
- Updated generator and route verification so reviewer runbook guard labels are required.
- Updated the contract, verification checklist, build-session checklist, and decision register.

## Guardrail

The reviewer runbook remains guidance only. It cannot call a live model, generate app patches, assemble packages, create routes, create playlists, write local bundles, assign students, or mark content student-ready.
