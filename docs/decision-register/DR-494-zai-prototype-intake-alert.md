# DR-494: Z.ai Prototype Intake Alert

Status: Accepted

Decision: Show a Z.ai/outside prototype intake alert on the game-readiness workbench before any external game prototype can be treated as integration-ready.

White-label impact: Positive. External prototypes can remain useful inventory while the platform protects parent engines, tenant configuration, target-language audio, scoring, and route ownership.

Cost impact: Positive. Free or low-cost outside prototype work can continue without creating expensive refactors, direct imports, scoring mutations, route creation, or hidden maintenance debt.

Constraints:

- Codex must explicitly alert the user when controlled Z.ai intake is ready.
- Z.ai output remains external prototype inventory until the alert gate is ready.
- Required evidence includes fixture replay, standard events, target-language audio, deterministic scoring, mobile layout, accessibility, and Phaser wrapper review when Phaser is used.
- No direct app file writes, route creation, scoring mutation, reward mutation, audio manifest mutation, playlist creation, package promotion, or student assignment is allowed.

Follow-up: Use the alert gate when comparing existing Z.ai Phaser/game prototypes against the parent-engine wrapper and replay evidence requirements.
