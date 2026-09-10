# ADR-0529: Game-Mode Audio Coverage

Status: Accepted

## Context

Unit audio plans can provide per-game coverage for curated pathways. The existing contract resolved cue IDs and checked language, but imported data could use an unsupported game-mode key, a UI-label/story-line cue, or a cue with conflicting mode metadata.

## Decision

Game-mode audio coverage keys must use the supported curated mode catalog. Coverage may use term, sentence, instruction, and feedback cues. UI-label and story-line cues cannot satisfy a gameplay lane. If a cue declares a game mode, it must match the lane using it; cues without a declaration may be reused across modes.

## Consequences

- Curated parent engines receive semantically appropriate audio evidence.
- Mode metadata cannot silently contradict the activity pathway.
- Shared audio remains economical because undeclared cues may be reused.
- The validator remains provider-neutral and side-effect free.

## Verification

- Runtime tests cover unsupported mode keys, non-learner-facing cue kinds, and conflicting cue-level mode declarations.
- The full foundation gate must pass typechecks, production build, and all active routes.
