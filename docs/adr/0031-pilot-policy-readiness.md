# ADR-0031: Pilot Policy Readiness

Status: Accepted  
Date: 2026-07-02

## Context

Persistence, report export, microphone practice, local deployment, media bundles, and AI Tutor all depend on policy decisions. The platform should not treat policy as an afterthought or a backend field that appears later.

The product needs a visible policy readiness layer before real classroom or partner pilots.

## Decision

Add a shared pilot policy readiness contract and render a policy readiness panel in `/teacher/intake`.

The scaffold covers:

- student progress retention,
- teacher report export,
- raw learner audio storage,
- learner transcript storage,
- media rights,
- local deployment backup/update rules,
- AI Tutor premium policy.

Core policy keeps raw audio and transcript storage disabled by default.

## Consequences

Positive:

- Makes student-data gates explicit before backend work.
- Keeps report export blocked until school or tenant policy is accepted.
- Separates legal/policy readiness from technical storage readiness.
- Preserves optional premium AI Tutor and speech features without forcing cost or risk into core pilots.

Tradeoffs:

- Adds another scaffold panel to the teacher/admin intake flow.
- Real policy language and legal review remain future human work.
- Future backend implementation must check policy readiness before writing real student data.

## Verification

Use `docs/verification/PILOT_POLICY_CHECKS.md` and verify:

- `http://127.0.0.1:3000/teacher/intake`

## Related Documents

- `docs/PILOT_POLICY_CONTRACT.md`
- `docs/PERSISTENCE_ADAPTER_CONTRACT.md`
- `docs/verification/PILOT_POLICY_CHECKS.md`
- `docs/decision-register/DR-032-pilot-policy-readiness.md`
