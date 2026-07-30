# DR-296: AI Draft Correction Queue

Status: Accepted  
Date: 2026-07-31

Decision: Add a review-only correction queue that turns AI draft validation blocks and warnings into owned repair work.

White-label impact: Positive. Every tenant can understand what must be fixed before generated content enters review while keeping tenant-specific reviewers, media policies, and curriculum standards configurable.

Cost impact: Positive. The queue avoids costly live regeneration loops and blocks generated drafts before verifier work, package assembly, storage, routes, playlists, or assignments are attempted.

Constraints:

- The queue must be driven by the shared draft payload validator.
- Repair items must show lane, required owner, next record, and student-use effect.
- Auto-fix, live AI regeneration, verifier submission, package assembly, route creation, playlist creation, and student assignment remain blocked.
- This decision is recorded in `docs/adr/0296-ai-draft-correction-queue.md`.
