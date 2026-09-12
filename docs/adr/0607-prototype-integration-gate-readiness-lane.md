# ADR-0607: Prototype Integration Gate Readiness Lane

Status: Accepted

## Decision

The prototype intake readiness summary must include an explicit
`integration-readiness-gates` lane derived from the detailed prototype
integration readiness gate records. The lane is tenant-scoped when a tenant
workbench is opened.

A summary may describe the integration lane as ready only when its scoped gate
records validate and every gate is `ready-for-codex-review`. Missing,
blocked, or review-only gate records keep the lane blocked or missing. This
lane does not authorize import; it prevents the handoff signal from advancing
without detailed evidence.

## Why

The summary already protected evidence alignment, returned-package shape, and
package availability, but it did not consume the detailed wrapper, fixture,
event, audio, mobile, scoring, and Codex-decision gates. That gap could allow
a future summary edit to appear ready while the actual integration gate
records remained blocked.

## Guardrails

- No source archive is imported into `apps/web` or `apps/ai-service`.
- No route, scoring, reward, audio, playlist, or student-assignment mutation
  is enabled by this lane.
- Tenant filtering is required for tenant workbench summaries.
- The existing Z.ai/Codex handoff alert remains blocked until all independent
  readiness lanes pass.

## Consequences

Prototype review has one more visible readiness dependency, and future game
handoff work must keep the detailed gate records and the summary lane aligned.
The extra validation is intentionally cheap and deterministic because it uses
the existing review-only records rather than a new runtime service.
