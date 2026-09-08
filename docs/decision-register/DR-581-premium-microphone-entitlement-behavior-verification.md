# DR-581: Premium And Microphone Entitlement Behavior Verification

Status: Accepted

Decision: Execute microphone and premium AI Tutor entitlement behavior in the compiled foundation harness.

Guardrails:

- Core-tier AI Tutor is rejected.
- Review-only microphone practice is rejected.
- Premium validation requires teacher, school, privacy, cost, persistence, release, usage, level, and target-audio gates.
- Review-only execution returns `sideEffect: "none"`.
