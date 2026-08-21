# DR-473: Active Playable Route Shell Consolidation

Date: 2026-08-21

Status: Accepted

## Decision

Move active pairing, selection, arcade-reinforcement, and speaking route wrappers onto the shared `PlayableGameRouteShell`.

## Rationale

After the text-spelling routes proved the shell pattern, the same duplicated progress summary, assignment settings, completion-next, earned reward, and event log wiring remained in Memory Match, Match Up, Label It, Quiz, True or False, Balloon Pop, and Speak It.

Consolidating these routes now keeps the foundation clean before adding more game designs, Phaser wrappers, premium visual skins, or controlled outside prototype intake.

## Impact

- Memory Match, Match Up, Label It, Quiz, True or False, Balloon Pop, Speak It, Type Answer, Spelling Practice, Fill in the Blank, and Sentence Builder now share the same playable route shell.
- Flashcards remains a specialized entry route because it owns entry completion, assist-language toggling, reward preview, route guidance, and target-practice readiness.
- Speak It keeps microphone approval and local record/replay policy in the speaking flow; the shell only renders common route scaffolding.
- Game-specific components remain responsible for standard events, target-language audio, answer flow, and deterministic scoring.

## Constraints

- No scoring profile, reward rule, game event taxonomy, microphone policy, assist-language rule, upload boundary, or live persistence behavior changes.
- No support-language-only event can unlock progress.
- No Z.ai or outside prototype code is imported by this consolidation.
- No route may use this shell to bypass its parent-engine adapter or verification checklist.

## Verification

- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
