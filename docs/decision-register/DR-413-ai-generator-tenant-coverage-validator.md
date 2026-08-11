# DR-413: AI Generator Tenant Coverage Validator

Date: 2026-08-11

## Decision

AI generator tenant coverage now uses a shared content-model validator before generated requests can move toward live model calls, verifier submission, package assembly, route or playlist creation, local bundle writes, student assignment, or student-ready markers.

## Rationale

White-label readiness depends on tenant boundaries. A route loading for MiniStar, the sample publisher, or a future school must not imply that the tenant has every required generator record. The shared guard makes required lanes, coverage counts, and blocked live-generator actions explicit and testable.

## Rules Preserved

- Tenant coverage must include all required generator lanes.
- Covered, partial, and missing counts must match lane status.
- Overall coverage status must match the lane counts.
- Next tenant requirements must stay visible.
- Blocked actions include generator request submission, live model calls, verifier submission, package assembly, route or playlist creation, and student assignment.

## Consequences

Teacher generator routes now surface `Tenant coverage guard active`, `Tenant coverage guard blocks`, and `Tenant coverage guard warnings`. `verify:ai-generator` fails if the shared validator, sample guard exports, or visible guard labels are removed.
