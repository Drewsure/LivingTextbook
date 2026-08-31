# DR-536: Local Companion Active Game Coverage

Status: Accepted

Decision: Local companion manifests must name every active playable game mode as included, planned, or blocked using shared mode and parent-engine ids.

Reasoning:

- A closed textbook package must not quietly omit active game routes that exist in the hosted PWA.
- White-label partners need a clear manifest of which games are included, planned, or policy-gated for local handoff.
- Shared ids keep local packages compatible with route replay, reporting, audio coverage, settings, and future prototype review.

Rules:

- Every active `GameModeId` must appear in local companion game coverage.
- Local game entries must use shared `ParentEngine` ids, not local-only aliases or game-family ids.
- Every local game entry must name target-language audio coverage, progress-reporting status, and a local path.
- Planned local routes remain review-only and cannot export packages, copy media, store student data, or activate offline mode.

Verification:

- `npm run verify:local-bundle`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:routes`
