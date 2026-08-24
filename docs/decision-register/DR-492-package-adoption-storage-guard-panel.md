# DR-492: Package Adoption Storage Guard Panel

Status: Accepted

Decision: Show package adoption storage guards on the entitlement workbench before any premium package adoption can become an activation workflow.

White-label impact: Positive. School and publisher admins can see which fields, storage contracts, policy approvals, and rollback gates belong to package adoption without relying on MiniStar-specific assumptions.

Cost impact: Positive. The panel keeps model calls, speech scoring, billing writes, report exports, hosted storage, and local companion activation visibly blocked until a school has accepted the paid package scope and cost posture.

Constraints:

- The panel is review-only.
- The panel must not include purchase, upload, microphone, billing, storage, export, or activation controls.
- The panel must preserve hosted and local companion parity.
- The panel must keep package adoption separate from student-facing learning routes.

Follow-up: Use this guard when designing the future accepted package adoption record workflow.
