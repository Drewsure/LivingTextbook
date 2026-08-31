# DR-534: Shared Game-Mode Route Path Helper

Status: Accepted

Decision: Student, teacher, and partner demo surfaces should resolve playable game links through the shared `getGameModeRoutePath` helper.

Reasoning:

- Repeated mode-to-route branches create drift as the game catalog expands.
- White-label tenants need predictable game route behavior while still allowing reviewed offer maps to override tenant/package-specific launch routes.
- Centralizing game route resolution lowers the cost of adding future modes and reviewing outside prototypes.

Rules:

- Use the shared helper for playable game-mode routes in launch, activity hub, recommendation, completion, teacher shortcut, and partner demo surfaces.
- Keep printable, media, training, collection, teacher, assignment, and review routes explicit unless they become true game-mode routes.
- Offer-map launch routes may override the helper when reviewed package data requires a specific path.
- The helper cannot publish routes, unlock hidden/premium/teacher-only offers, write scores, or treat support-language actions as progress.

Verification:

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:routes`
