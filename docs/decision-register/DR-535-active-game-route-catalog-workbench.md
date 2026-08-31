# DR-535: Active Game Route Catalog Workbench

Status: Accepted

Decision: The game-readiness workbench should show a review-only active game route catalog sourced from the shared game-mode route helper.

Reasoning:

- Route wiring should be visible before the platform starts evaluating more Phaser, Z.ai, or outside game prototypes.
- A shared catalog helps compare MiniStar and partner launch routes without creating tenant-specific route branches.
- The panel makes the route helper, parent engine, scoring profile, audio requirement, and active mode metadata auditable in one place.

Rules:

- The route catalog must use `getGameModeRoutePath`.
- The catalog is review-only and cannot publish routes, mutate offer maps, import prototypes, write scores, or unlock games.
- Unit offer maps may still override student launch routes after package review.
- The game-mode coverage verifier must protect shared route helper mappings.

Verification:

- `npm run verify:game-modes`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:routes`
