# DR-274: Private Assignment Link Storage Contract

Date: 2026-07-17

## Decision

Create a backend-neutral storage contract for `private_assignment_link`.

## Rationale

Private assignment links are the first teacher sharing lane. Without a durable record, a route preview could drift into public sharing, iframe embed behavior, teacher/admin exposure, real learner data collection, or report export before access and policy gates are ready.

## Guardrails

- Private assignment links remain tenant-scoped.
- Student-facing links do not expose teacher/admin controls.
- Public sharing and public community discovery stay blocked.
- IFrame embeds stay blocked.
- Real learner data collection and report export stay blocked.
- Support-language activity cannot satisfy target-language progression.

## Verification

`npm run verify:private-assignments`, `npm run verify:backend-storage`, and `npm run verify:foundation` must pass after private assignment link storage changes.
