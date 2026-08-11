# DR-405: AI Package Writer Rollback Drill Validator

Date: 2026-08-11

## Decision

AI-generated package writer rollback drills now use a shared content-model validator before future package-writer implementation work can treat rollback rehearsal as structurally valid.

## Rationale

The rollback drill names the proof needed before a future writer can safely touch package JSON, route registry, media playlist, local companion, assignment shell, and release-control records. That rehearsal is valuable only if it stays blocked, explicit, and testable. A shared guard keeps rollback planning visible without creating a hidden rollback workflow.

## Rules Preserved

- Rollback drill status stays blocked in the foundation.
- Required snapshots cover package JSON, route registry, media playlist, local companion, assignment shell, and release-control state.
- Post-write verification remains mandatory before rollback planning can be considered complete.
- Rollback execution, package writer execution, package JSON rollback, route rollback, media playlist rollback, local bundle rollback, assignment rollback, production QR redirect mutation, and support-language-only rollback evidence remain blocked.
- Support-language boundaries remain explicit and cannot trigger rollback evidence or writer readiness.

## Consequences

The generator pages show `Rollback drill guard active`, `Rollback drill guard blocks`, and `Rollback drill guard warnings`. `verify:ai-generator` fails if the shared rollback drill validator or visible guard labels disappear.
