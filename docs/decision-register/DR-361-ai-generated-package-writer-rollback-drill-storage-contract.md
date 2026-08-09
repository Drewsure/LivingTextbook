# DR-361: AI Generated Package Writer Rollback Drill Storage Contract

Decision: Preserve generated package writer rollback drills as backend-neutral durable records before any generated package writer or rollback implementation can exist.

Rationale: The rollback drill names restore evidence, but the platform needs an auditable hosted/local record that does not execute rollback actions or mutate student-facing state.

White-label impact: Strongly positive. A saleable platform needs tenant-safe rollback evidence before schools or publishers trust generated package writing.

Cost impact: Positive. Durable rollback planning reduces future support burden and avoids fragile one-way publish workflows.

Blocked actions:

- No rollback execution.
- No package writer execution.
- No package JSON rollback.
- No route registry rollback.
- No media playlist rollback.
- No local bundle rollback.
- No assignment rollback.
- No production QR redirect mutation.
- No student-ready marker.
- No support-language-only rollback evidence.

Follow-up:

- Future package writer work still requires a separate writer implementation, storage, release-control, and rollback execution decision.
