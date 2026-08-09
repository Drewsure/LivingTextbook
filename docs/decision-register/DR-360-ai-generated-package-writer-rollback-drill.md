# DR-360: AI Generated Package Writer Rollback Drill

Decision: Show review-only generated package writer rollback drills on tenant generator routes after writer preflight.

Rationale: A generated package writer should not be designed without visible restore evidence. The drill makes pre-write snapshots, post-write checks, rollback rehearsals, and support-language boundaries reviewable before any writer or rollback action exists.

White-label impact: Strongly positive. Tenants and school partners can see reversibility requirements before accepting a generated package workflow.

Cost impact: Positive. Early rollback rehearsal reduces expensive rework and prevents fragile one-way publish designs.

Blocked actions:

- No rollback execution.
- No package writer execution.
- No package JSON rollback execution.
- No route registry rollback.
- No media playlist rollback.
- No local bundle rollback.
- No assignment rollback.
- No production QR redirect mutation.
- No support-language-only rollback evidence.

Follow-up:

- Add a backend-neutral storage contract only after the visible rollback drill shape proves stable.
