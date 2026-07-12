# DR-175: Teacher Draft Package Preview Route

## Decision

Add a teacher-only draft package preview route for the sample publisher tenant.

## Rationale

This gives the authoring workflow a visible product surface without introducing a live editor, persistence, or student assignment shortcut.

## Implications

- `/teacher/authoring/draft-sample-publisher-l1-u1` is an active scaffold route.
- Student assignment remains blocked.
- The route must show draft-only, audio-before-students, review-before-assignment, source lineage, and no-direct-publish boundaries.
- Active route verification now checks 36 routes.

## Next

Connect draft ownership, copy lineage, and verifier review to durable persistence after backend and authentication decisions are accepted.
