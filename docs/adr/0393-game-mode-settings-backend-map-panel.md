# ADR 0393: Game Mode Settings Backend Map Panel

Status: Accepted

Context: Game mode settings now have review profiles, storage readiness, backend schema entities, migration candidates, migration specs, persistence categories, and adapter write intents. The teacher intake route needs a compact review surface that explains the chain without requiring the reviewer to scan the full backend schema inventory.

Decision: add a review-only backend map panel for game mode settings. The panel summarizes each future record across schema entity, migration candidate, migration spec, persistence category, hosted write intent, local write intent, required guarantees, and blocked mutations.

Consequences:

- Teacher/admin reviewers can see the settings storage path before live settings controls exist.
- The panel reinforces learning-audio priority, target-language-only progress, support-language support-only behavior, school policy, accessibility review, release control, and deterministic scoring ownership.
- No live save, mutation, launch, report export, backend selection, or persistence workflow is added.
- `npm run verify:game-settings` and active route checks enforce the panel as part of the foundation.
