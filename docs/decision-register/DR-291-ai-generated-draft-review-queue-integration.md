# DR-291: AI-Generated Draft Review Queue Integration

Status: Accepted  
Date: 2026-07-31

Decision: Add AI-generated draft package previews to the standard teacher draft review queue as read-only queue items.

White-label impact: Strongly positive. It gives schools and publisher tenants one consistent review workflow for teacher-created and AI-generated materials.

Cost impact: Positive. A shared queue avoids a second AI-only approval system and reduces future support, audit, and training complexity.

Constraints:

- AI-generated drafts must show source lineage, verifier packet requirements, target-language audio blockers, media-rights blockers, engine/gamification checks, route/playlist/assignment blocks, and approval blocks.
- AI-generated drafts cannot bypass verifier storage, reviewer identity, evidence storage, audio cue approval, approval ledger policy, or release-control binding.
- The preview must not submit, approve, publish, create routes, create playlists, assign students, or mark generated packages student-ready.
- This decision is recorded in `docs/adr/0291-ai-generated-draft-review-queue-integration.md`.
