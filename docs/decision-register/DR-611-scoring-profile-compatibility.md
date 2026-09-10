# DR-611: Scoring Profile Compatibility

Status: Accepted

Decision: Require scoring profiles to declare supported parent engines, learner roles, and skill focuses, and verify those declarations against every catalog mode.

Rationale:

- Profile existence alone does not prove semantic compatibility.
- Engine, role, and skill focus are the smallest useful boundary for preventing reward drift.
- Static verification keeps the rule inexpensive before game integration.

Guardrails:

- Every scoring profile declares supported engines, roles, and skill focuses.
- Every catalog mode references a profile that accepts its engine, role, and skill focus.
- Drift blocks verification and release review.
- Verification cannot award dust, unlock progression, write inventory, or activate providers.

See also: `docs/adr/0539-scoring-profile-compatibility.md`.
