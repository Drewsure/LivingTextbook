# ADR 0464: Active Game Route Catalog Workbench

Status: Accepted

Date: 2026-08-31

## Context

The game-readiness workbench already shows parent-engine readiness, active replay checks, game offer maps, compatibility rules, and outside prototype gates. As active modes grow, teachers and integrators also need one review-only place to see which playable route each game mode resolves to for each tenant launch code.

## Decision

Add an active game route catalog panel to the game-readiness workbench. The panel must source playable links from `getGameModeRoutePath`, show catalog metadata, and remain review-only.

## Consequences

- Game mode route wiring is visible before adding or reviewing more game prototypes.
- MiniStar and sample publisher playable route links can be compared from the same workbench.
- Route helper coverage is protected by both TypeScript exhaustiveness and the game-mode coverage verifier.
- Outside prototype review has a clearer target surface without enabling direct import.

## Still Blocked

- No route publishing.
- No direct prototype promotion.
- No live template-switching panel.
- No support-language-only progress.
