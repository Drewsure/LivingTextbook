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
- The game readiness and tenant prototype review workbenches show the prototype intake readiness summary, including the not-ready state, Codex alert state, ready lanes, missing lanes, and blocked next actions.
- The game readiness and tenant prototype review workbenches show the prototype intake and return storage guard, including intake queue storage, return package checklist storage, hosted/local write intents, visible storage fields, required evidence, and blocked actions.
- The game readiness and tenant prototype review workbenches show the prototype intake evidence packet flow, including source snapshot, fixture replay, event/scoring, target-language audio, mobile/accessibility, and wrapper-boundary packets.
- The game readiness and tenant prototype review workbenches show the returned prototype package checklist, including source archive manifest, reviewed fixture folder, event and scoring replay, target-language audio map, mobile accessibility capture, wrapper notes, and no-archive-import blockers.
- Prototype return package checklists have backend-neutral schema, migration, durable record, hosted write-intent, and local write-intent markers before any returned package evidence can become a durable workflow.
- Prototype return package checklist storage guard markers stay visible before returned outside-game evidence can move toward Codex review.
- The game readiness and tenant prototype review workbenches show the prototype return readiness summary, including return checklist visibility, return storage guard visibility, missing source archive manifest, missing fixture replay, missing audio/mobile/scoring proof, and closed Codex return review state.
- Prototype review pages keep no-write, no-scoring-mutation, no-route-creation, no-audio-manifest-mutation, no-package-promotion, and no-student-assignment boundaries visible.
- The active route verifier protects the same markers.
- The visible foundation gate includes `Prototype review readiness`.

This check does not import code, approve Phaser wrappers, create routes, write storage, mutate scoring, publish packages, or assign student work.
