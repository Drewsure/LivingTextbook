# DR-1117: Browser Rehearsal Observation Receipt

## Decision

Use a structured review-only observation receipt for human-observed or
browser-automated evidence.

## Required invariants

- Receipt identity is bound to tenant, package, launch, unit, and student
  session.
- Routes and check ids are explicit and unique.
- Human observation names a teacher reviewer; automation names an automation
  reviewer.
- Promotion and student production launch remain false.

## Status

Implemented and verified as a provider-neutral review-only contract.
