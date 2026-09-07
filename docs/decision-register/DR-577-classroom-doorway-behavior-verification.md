# DR-577: Classroom Doorway Behavior Verification

Status: Accepted

Decision: Extend the compiled-contract behavior harness to cover content package, QR launch, and teacher assignment runtime boundaries.

Rationale:

- Teacher QR/front-door onboarding is the bridge between reviewed content and student self-progression.
- Tenant isolation and target-language authority must be enforced below the route UI.

Guardrails:

- Package tenant mismatch remains blocked.
- Support-language and media-only progress remain blocked in launch and assignment requests.
- Review-only package, launch, and assignment adapters return `sideEffect: "none"`.
- The harness performs no classroom activation, roster binding, QR mutation, assignment write, report stream creation, or learner-data collection.
