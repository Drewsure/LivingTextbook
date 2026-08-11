# DR-416: AI Generator Responsibility Matrix Validator

Date: 2026-08-11

## Decision

AI generator responsibility matrices now use a shared content-model validator before role ownership can inform future outside-builder handoff, live generation, app patching, scoring authority, route creation, playlist creation, package assembly, local bundle writes, assignment, or student-ready marker work.

## Rationale

The platform can use Z.ai and other outside builders effectively only if ownership stays crisp. The shared guard preserves the division between teacher/school review, Codex architecture and integration, isolated external prototypes, verifier checks, and platform admin cost/storage/release duties.

## Rules Preserved

- Matrices must stay `review-only`.
- Required roles are teacher/school, Codex architecture, external AI builder, verifier layer, and platform admin.
- Codex remains the architecture and integration owner.
- Outside AI builders remain blocked from app file writes, route creation, scoring authority, reward inventory writes, and student assignment.
- The verifier role must block support-language progress.
- Platform admins must block API cost without tenant approval and premium upsell shown to children.

## Consequences

Teacher generator routes now surface `Responsibility guard active`, `Responsibility guard blocks`, and `Responsibility guard warnings`. `verify:ai-generator` fails if the shared validator, sample guard exports, or visible guard labels are removed.
