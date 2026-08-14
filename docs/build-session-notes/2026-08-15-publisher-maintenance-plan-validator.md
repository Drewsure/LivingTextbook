# Build Session: Publisher Maintenance Plan Validator

## Summary

Added a shared validation guard for publisher maintenance plans.

## Changes

- Added `packages/content-model/src/publisherMaintenance.ts`.
- Exported publisher maintenance types and validation from the content model package.
- Wired `samplePublisherMaintenancePlan` to expose guard errors and warnings.
- Added visible maintenance guard blocks and warnings to `/teacher/intake`.
- Updated release-control and active-route verification to require the guard labels.
- Recorded the decision as DR-447.

## Boundaries

- No live publisher upload, media replacement, route mutation, report policy change, partner self-maintenance workflow, local bundle update, or package release action is enabled.
- QR redirect changes remain blocked until rollback and notice rules are reviewed.
