# ADR-0506: Classroom Doorway Behavior Verification

Status: Accepted

## Context

The teacher QR/front-door flow joins reviewed packages, private assignments, classroom sessions, student identity, audio, progression, and reporting. A route can render correctly while a shared contract still permits a tenant mismatch or support-language progression shortcut.

## Decision

Extend the local compiled-contract behavior harness to exercise content package, launch, and assignment runtime boundaries.

The harness covers:

- package tenant mismatch rejection;
- support-language progress rejection in QR launch requests;
- support-language progress rejection in assignment requests;
- review-only no-side-effect behavior for all three adapters.

## Consequences

- The teacher-led onboarding contract has executable boundary evidence.
- The same target-language authority rule applies across hosted, local, and hybrid deployment candidates.
- No session, roster, assignment, QR, report, or learner-data provider is activated by the harness.
