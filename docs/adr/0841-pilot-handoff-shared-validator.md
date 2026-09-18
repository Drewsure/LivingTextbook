# ADR 0841: Pilot Handoff Shared Validator

## Decision

Validate the partner pilot handoff package in the shared content model before
the teacher pilot command view presents it as coherent review evidence.

## Rationale

The pilot handoff is a contract boundary, not only an explanatory panel. A
shared validator keeps tenant identity, required front-door/launch/teacher
routes, human decisions, and safety posture aligned across future web, local,
and partner tooling.

## Guardrails

- The package must remain `review-only`.
- Required routes must be internal and include entry, launch, and teacher
  session paths.
- A student-data policy decision must remain blocked before a classroom pilot.
- The validator never authorizes storage, export, classroom launch, or live
  learner data.

## Excluded

Provider activation, file upload, package publication, policy acceptance,
student accounts, report export, and classroom launch.

See `docs/verification/PILOT_HANDOFF_SHARED_VALIDATOR_CHECKS.md`.
