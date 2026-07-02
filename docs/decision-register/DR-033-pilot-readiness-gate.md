# DR-033: Pilot Readiness Gate

Status: Accepted

Decision: Add a visible pilot readiness gate to the teacher/admin intake flow before any first partner pilot is treated as live-classroom ready.

White-label impact: Strongly positive. A saleable platform must clearly separate demo readiness from partner pilot readiness, especially when the same app can serve MiniStar, a second publisher tenant, or a closed textbook companion package.

Cost impact: Positive. The gate keeps the first commercial promise disciplined: hosted PWA first unless the partner truly needs closed local deployment immediately. This avoids premature installer, sync, backup, and local media-update work while preserving that path.

Portability: Positive. The gate reads existing tenant-neutral readiness, policy, and persistence plans rather than hard-coding a MiniStar-only launch decision.

Constraints:

- Static demo content must not be presented as production persistence.
- Hosted PWA remains the recommended first pilot path for cost and speed.
- Local classroom server or packaged local app remains a first-class later path for closed textbook companion deployments.
- Real student progress storage and teacher report export require accepted school or tenant policy.
- Core pilot does not require AI Tutor, raw learner audio storage, or transcript storage.
- Detailed policy and adapter panels remain available below the summary gate.

Verification:

- See `docs/verification/PILOT_READINESS_GATE_CHECKS.md`.
