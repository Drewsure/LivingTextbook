# DR-476: Parent Engine Readiness Panel

Date: 2026-08-21

Status: Accepted

## Decision

Expose a parent engine readiness panel on `/teacher/intake` before accepting more game prototype intake or premium game polish.

## Rationale

The platform must grow through reusable parent engines, not a pile of isolated game pages. The current active routes already cover pairing, selection, and text-spelling behaviors. Future Phaser work, Z.ai prototypes, narrative routes, and premium visual skins need a visible gate that shows which parent engines are ready, which are blocked, and what evidence is required before promotion.

## Impact

- `/teacher/intake` now shows `Parent engine readiness` with Pairing, Selection, Text-spelling, and Narrative parent engine statuses.
- Pairing, Selection, and Text-spelling are marked ready for their current reviewed active routes.
- Narrative remains blocked until state, branching, persistence, privacy, AI Tutor entitlement, transcript, and cost controls are defined.
- Z.ai and Phaser work remains an outside prototype candidate until fixture replay, event replay, audio coverage, scoring replay, mobile/accessibility review, and Codex integration gates pass.

## Constraints

- Do not build 48 isolated games.
- No support-language-only progress.
- No live AI Tutor route, transcript capture, model call, or narrative persistence.
- No Phaser wrapper promotion from outside prototype work without a documented Codex integration gate.
- No scoring, route, storage, upload, microphone, or support-language behavior changed.

## Verification

- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
