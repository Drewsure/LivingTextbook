# Prototype Review Readiness Checks

Use this focused check before any Z.ai, Phaser, or outside game prototype is treated as a candidate for Living Textbook integration.

Command:

```powershell
npm run verify:prototype-review
```

The check confirms:

- Tenant prototype review routes are active for MiniStar and sample publisher.
- Teacher generator routes link to their focused prototype review workbenches.
- The game readiness workbench links to both prototype review workbenches.
- The game readiness workbench shows the Z.ai prototype intake alert, including the Codex alert requirement, ready-when conditions, required evidence, and blocked actions.
- The game readiness and tenant prototype review workbenches show the prototype intake queue, including source repository scope, target surface, required evidence, missing evidence, blocked actions, and tenant filtering.
- Prototype intake queue items have backend-neutral schema, migration, durable record, hosted write-intent, and local write-intent markers before any controlled outside-prototype intake workflow can exist.
- Prototype review pages keep no-write, no-scoring-mutation, no-route-creation, no-audio-manifest-mutation, no-package-promotion, and no-student-assignment boundaries visible.
- The active route verifier protects the same markers.
- The visible foundation gate includes `Prototype review readiness`.

This check does not import code, approve Phaser wrappers, create routes, write storage, mutate scoring, publish packages, or assign student work.
