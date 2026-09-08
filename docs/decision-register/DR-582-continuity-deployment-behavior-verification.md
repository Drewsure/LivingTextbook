# DR-582: Continuity And Deployment Behavior Verification

Status: Accepted

Decision: Execute hosted-managed and non-hosted recovery behavior in the compiled foundation harness.

Guardrails:

- Local and hybrid recovery requires reviewed fallback evidence.
- Hosted recovery still requires privacy, integrity, policy, rollback, release, and learner-media exclusion gates.
- Restore and rollback state rules remain explicit.
- Review-only recovery returns `sideEffect: "none"`.
