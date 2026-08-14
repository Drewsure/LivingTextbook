# 2026-08-14: AI Prototype Integration Plan Validator

## Context

Returned prototypes need a wrapper-first integration path, but the path must not become permission to import files, write routes, mutate scoring, change audio, promote packages, or assign students.

## Work Completed

- Added a shared content-model validator for AI prototype integration plans.
- Reused the validator in sample integration plan data and the teacher generator panel.
- Added `prototype_scoring_replay_report` as a required next review record.
- Added visible guard blocks and warnings to teacher generator routes.
- Updated generator and route verification so integration-plan guard labels and scoring replay lineage are required.
- Updated the generator contract, verification checklist, build-session checklist, and decision register.

## Guardrail

Prototype integration stays wrapper-first and review-only. Direct imports, route writes, scoring or audio mutations, package promotion, assignment, and support-language-only scoring or release remain blocked.
