# ADR 0214: Pilot Launch Checklist Preview

Date: 2026-07-15

## Status

Accepted

## Context

The platform now has readiness summaries, evidence packets, handoff packages, publish gates, and approval ledgers. A partner-facing pilot still needs a simple go/no-go checklist that explains what can be shown as a controlled demo and what remains before real classroom use.

## Decision

Add a `Pilot launch checklist preview` to `/teacher/intake`.

The checklist derives from the readiness summary, pilot evidence packet, and pilot handoff package. It shows staged launch planning without creating a launch button or any live approval/upload behavior.

## Consequences

- Publisher conversations get a clearer path from demo to classroom pilot.
- Teacher dry-run requirements are visible before student launch.
- Classroom launch remains blocked until policy, persistence, evidence, release gates, and deployment decisions close.
