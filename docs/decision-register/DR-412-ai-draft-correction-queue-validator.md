# DR-412: AI Draft Correction Queue Validator

Date: 2026-08-11

## Decision

AI draft correction queues now use a shared content-model validator before generated drafts can move toward verifier submission, package assembly, route creation, playlist creation, or student assignment.

## Rationale

The correction queue turns AI draft schema output into teacher/admin repair work. Without a shared guard, future code could display repair items while silently allowing auto-fix, live regeneration, verifier submission, package assembly, route writes, playlist creation, or assignment. The validator keeps the queue evidence-first and student-safe.

## Rules Preserved

- Queue status must match validation output: blocked for validation blockers, needs-review for warnings, ready-for-review only when both are clear.
- Validation and warning counts must match the actual correction items.
- Correction items must include lane, owner, issue, next record, and student-use block explanation.
- Required next requirements include teacher repair, target-language audio approval, media rights evidence, schema validation packet, verifier submission packet, and package approval ledger binding.
- Blocked actions include auto-fix from AI draft, live AI regeneration, verifier submission, package assembly, route or playlist creation, and student assignment.

## Consequences

Teacher generator routes now surface `Correction queue guard active`, `Correction queue guard blocks`, and `Correction queue guard warnings`. `verify:ai-generator` fails if the shared validator, sample guard exports, or visible guard labels are removed.
