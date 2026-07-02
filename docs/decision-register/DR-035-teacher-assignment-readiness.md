# DR-035: Teacher Assignment Readiness

Status: Accepted

Decision: Add a teacher assignment readiness contract before live classroom launch work proceeds.

White-label impact: Strongly positive. Future tenants can use the same assignment model for teacher QR launches, front-door entry codes, home practice, small-group practice, and closed textbook companion packages.

Cost impact: Positive. The contract keeps expensive or policy-heavy controls disabled by default. AI Tutor, cloud speech scoring, raw learner audio storage, transcript storage, and report export cannot quietly become baseline costs.

Portability: Positive. The contract is tenant-neutral and links content packages, launch codes, route paths, game modes, access rules, and feature controls without assuming MiniStar-only classroom behavior.

Constraints:

- Reviewed content packages are assigned through explicit teacher assignment plans.
- Target-language audio support is a core assignment control.
- Assist language remains support only and cannot satisfy target-language progression gates.
- Microphone record/replay can be teacher-optional only while local, no-upload, and no-transcript.
- Report export requires persistence and policy before live use.
- AI Tutor and cloud speech scoring remain premium-disabled unless a tenant adopts them explicitly.
- Local/closed deployment must show backup, update, storage, export, and local media bundle blockers before pilot use.

Verification:

- See `docs/verification/TEACHER_ASSIGNMENT_READINESS_CHECKS.md`.
