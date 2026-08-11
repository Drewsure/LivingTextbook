# DR-415: AI Generator Reviewer Runbook Validator

Date: 2026-08-11

## Decision

AI generator reviewer runbooks now use a shared content-model validator before human review order can inform future workflow decisions.

## Rationale

The reviewer runbook is intentionally helpful, but it is also close to workflow instruction. A shared guard keeps the runbook in its correct role: guidance for humans, not permission for live model calls, app patches, package assembly, route creation, playlist creation, or student assignment.

## Rules Preserved

- Runbooks must stay `review-only`.
- Required review sections are generator request, prototype review, integration gates, package review, and draft repair.
- Review steps must use a contiguous human review order.
- Each step must include evidence to review, a required source record, and blocked shortcuts.
- Unknown review sections are rejected.
- Standing rules must preserve detailed source records as authoritative while blocking live model calls, app patch generation, package assembly, route or playlist creation, and student assignment.

## Consequences

Teacher generator routes now surface `Reviewer runbook guard active`, `Reviewer runbook guard blocks`, and `Reviewer runbook guard warnings`. `verify:ai-generator` fails if the shared validator, sample guard exports, or visible guard labels are removed.
