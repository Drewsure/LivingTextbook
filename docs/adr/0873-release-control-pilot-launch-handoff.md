# ADR 0873: Release-Control To Pilot Launch Handoff

## Status

Accepted for foundation rehearsal.

## Context

The release-control route now consumes media evidence, but the pilot summary
and classroom launch gate were still derived from the broader package gate
without the new binding. That could let downstream surfaces under-report a
media identity mismatch or open approval.

## Decision

Pass the media release-control binding into the pilot readiness summary and
classroom launch gate. Add an explicit downstream blocker carrying its reasons,
required approvals, and blocked actions while preserving the existing package,
policy, persistence, roster, reporting, and dry-run gates.

## Consequences

Pilot and launch review now share one media release meaning. The handoff is
diagnostic only: it adds no launch, assignment, persistence, export, or release
mutation capability.
