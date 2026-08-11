Decision: Add a review-only AI generated package teacher review packet.

Rationale: Teachers need one readable approval-prep surface that gathers generated content, target-language audio, curated activity path, deterministic rewards, media-rights evidence, support-language boundaries, verifier readiness, missing evidence, blocked actions, and next required records before any generated package can move toward approval.

White-label impact: Positive. The packet is tenant-scoped and keeps MiniStar-specific English/Japanese rules as tenant rules, not global platform assumptions.

Cost impact: Positive. It avoids premature package assembly, route work, playlist work, live approval capture, and assignment workflow build-out until the missing evidence and storage gates are narrow and visible.

Blocked actions:
- No teacher approval capture.
- No package assembly from teacher packet.
- No route creation from teacher packet.
- No playlist creation from teacher packet.
- No assignment creation from teacher packet.
- No local bundle write from teacher packet.
- No student-ready marker from teacher packet.
- No support-language progress trigger.

Verification:
- `npm.cmd run verify:ai-generator`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`

Follow-up:
- Add a backend-neutral storage contract only when the teacher review packet must persist outside route sample data.
