# DR-223: Report Package Launch Gate Boundary

Date: 2026-07-15

## Decision

Teacher report package preview routes must show the session launch gate boundary before report rows, event acceptance summaries, or export-readiness details.

## Rationale

Report packages are the surface most likely to be mistaken for production reporting. The launch gate boundary keeps preview reporting separated from live classroom launch, real learner data collection, and export workflows.

## Standard

- Report package routes must show `Session launch gate boundary`.
- Report package routes must show `No live classroom launch`, `Real learner data blocked`, and `Report export still blocked`.
- Export controls remain blocked until policy, persistence, access control, launch gates, and event acceptance are actually implemented and accepted.
