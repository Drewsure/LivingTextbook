# DR-495: Prototype Intake Queue

Status: Accepted

Decision: Show ordered Z.ai/outside prototype inventory on the game-readiness and tenant prototype review workbenches before any external prototype can be treated as integration-ready.

White-label impact: Positive. Prototype candidates stay tenant-scoped and parent-engine scoped before any MiniStar, sample publisher, or future tenant code is affected.

Cost impact: Positive. The queue lets free or low-cost Z.ai work continue as inventory while preventing expensive direct imports, one-off scoring, hidden route creation, reward mutation, or Phaser wrapper debt.

Constraints:

- The queue is review-only.
- Source repository scope must remain explicit.
- Required evidence and missing evidence must be visible.
- No app file import, route creation, scoring mutation, reward inventory mutation, audio manifest mutation, playlist creation, package promotion, or student assignment is allowed from the queue.
- Phaser candidates must prove wrapper review, event replay, learning-audio priority, deterministic scoring, and accessibility fallback before integration review.

Follow-up: When Codex declares controlled Z.ai intake ready, use this queue to compare the user’s existing prototypes against the required evidence list.
