Decision: Add backend-neutral storage coverage for AI generated package teacher review packets.

Rationale: Teacher approval prep must be durable, exportable, and reviewable before any future generated package approval, package assembly, route, playlist, assignment, or local bundle workflow exists.

White-label impact: Positive. Tenants can preserve their own review questions, evidence lanes, media-rights blockers, language rules, and next required records without hard-coding MiniStar globally.

Cost impact: Positive. This blocks expensive approval, package writer, route, playlist, assignment, and local bundle work until missing evidence and policy gates are visible.

Blocked actions:
- No teacher approval capture.
- No generated package assembly.
- No route registry write.
- No media playlist write.
- No assignment creation.
- No local bundle write.
- No student-ready marker.
- No support-language progress trigger.

Verification:
- `npm.cmd run verify:backend-storage`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`

Follow-up:
- Keep the teacher review packet as approval-prep only until reviewer identity, evidence attachments, target-language audio approval, approval ledger, release-control, and assignment rollout gates exist.
