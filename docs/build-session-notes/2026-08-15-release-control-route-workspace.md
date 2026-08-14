# Build Session: Release-Control Route Workspace

## Summary

Added a focused release-control route for partner-facing pilot release review.

## Changes

- Added `/teacher/release-control/sample-publisher`.
- Reused the existing pilot release candidate, package publish gate, and approval ledger panels.
- Added route contract, AppShell navigation, partner demo link, active route matrix entry, active route list entry, and active route verifier coverage.
- Updated release candidate, package publish gate, and package approval ledger verification docs.
- Recorded the decision as DR-449.

## Boundaries

- No publish button, release-state mutation, assignment activation, local bundle release, student-ready marker, signed approval capture, or support-language-only release path is enabled.
