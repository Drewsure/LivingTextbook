# ADR 0262: School Rollback Impact Matrix

## Status

Accepted.

## Context

The school policy revocation and rollback preview names the future rollback lanes, but a school, publisher, or platform reviewer also needs to see what records and evidence areas would be touched before a rollback workflow is designed.

## Decision

Add a read-only `School rollback impact matrix` beside the rollback preview on teacher intake, launch-gate, and school policy handoff routes.

The matrix covers:

- release state,
- printed QR routes,
- learner-data and reports,
- media and local packages,
- premium features,
- support operations.

Every row lists affected records, required evidence, and blocked actions. The matrix cannot mutate releases, redirect QR routes, delete learner data, export reports, replace media, change AI Tutor entitlements, or shut down classrooms.

## Consequences

- Reviewers can see rollback blast radius before live rollback mechanics exist.
- Future hosted and local implementations inherit a clearer record/evidence map.
- The foundation continues to block live rollback, evidence export, learner-data deletion, and premium entitlement changes.
