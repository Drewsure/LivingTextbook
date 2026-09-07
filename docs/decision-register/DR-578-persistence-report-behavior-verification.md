# DR-578: Persistence And Teacher Report Behavior Verification

Status: Accepted

Decision: Extend the compiled-contract behavior harness to cover persistence privacy and teacher-report export boundaries.

Guardrails:

- Raw learner audio and transcripts remain excluded from core persistence and reports.
- Core teacher reports remain pseudonymous-slot-only.
- Mutation and export require separate policy, release, persistence, and approval evidence.
- Review-only adapters return `sideEffect: "none"` and perform no provider work.
