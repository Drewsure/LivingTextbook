# DR-475: Playable Demo Flow Prop Contract

Date: 2026-08-21

Status: Accepted

## Decision

Export a shared `PlayableGameDemoFlowProps` type from the playable route shell and use it across active non-entry game demo flows.

## Rationale

After active routes moved onto `PlayableGameRouteShell`, each demo flow still repeated the same prop interface for tenant, unit, launch session, progression, audio cues, and teacher assignment plan. Repeating that contract makes future game routes easier to drift and harder for outside wrapper work to follow.

## Impact

- Memory Match, Match Up, Label It, Quiz, True or False, Balloon Pop, Type Answer, Spelling Practice, Fill in the Blank, Sentence Builder, and Speak It now share the same route-level prop type.
- Flashcards intentionally keeps its own entry-specific prop interface because it owns content package, session settings, assist-language plan, target-practice readiness, reward preview, and route guidance.
- Future active game routes should start from `PlayableGameDemoFlowProps` unless they have a documented entry or policy exception.

## Constraints

- No route behavior, scoring, audio cue policy, support-language boundary, microphone policy, assignment behavior, upload state, or backend persistence changed.
- This prop contract does not authorize Z.ai or outside prototype imports.

## Verification

- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
