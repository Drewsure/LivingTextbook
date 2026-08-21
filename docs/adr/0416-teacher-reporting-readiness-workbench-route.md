# ADR 0416: Teacher Reporting Readiness Workbench Route

Status: Accepted

## Context

Teacher reporting is a major live-use boundary. Reports need coded learner identity, event acceptance, retention policy, export policy, sensitive-data exclusions, and school approval before real classroom use. Those rules existed across session monitor and report-package preview pages, but they needed one focused review route.

## Decision

Add `/teacher/reporting` as a review-only route that gathers class roster boundaries, report package boundaries, event acceptance, export blockers, support-only signals, and excluded sensitive fields.

## Consequences

- Reporting policy becomes easier to review before persistence, accounts, or report export are built.
- The route keeps raw learner audio, transcripts, ungated AI Tutor state, private identifiers, and unreviewed teacher notes out of the core export boundary.
- Support-language taps, route guidance, media playback, and background media remain report context only.
- Active route verification now checks the reporting workbench and grows to 81 routes.
