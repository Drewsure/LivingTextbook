# ADR 0296: AI Draft Correction Queue

Status: Accepted  
Date: 2026-07-31

## Decision

Add a review-only AI draft correction queue to the teacher/admin generator route.

The queue converts shared draft validator blocks and warnings into repair items with a lane, required owner, next record, and student-use effect.

## Rationale

AI-generated teaching content needs a clear repair path before it reaches verifier submission or package approval. A correction queue gives teachers and admins a practical next-step view without pretending that auto-fix, live regeneration, package assembly, route creation, playlist creation, or assignment is safe in the foundation scaffold.

## Consequences

- Generated draft issues are visible as schema, audio, progress-policy, pedagogical, verifier, and release-lock work.
- Teachers can see what must be fixed, but cannot trigger live AI generation or student-facing release from the queue.
- The queue improves partner demos by showing a serious operational path from AI draft to reviewed package.
- `npm run verify:ai-generator` checks the correction queue.
