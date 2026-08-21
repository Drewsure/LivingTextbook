# DR-472: Playable Game Route Shell

Date: 2026-08-21

Status: Accepted

## Decision

Use a shared `PlayableGameRouteShell` for active playable student routes that need the same assignment settings, unit progress summary, completion-next routing, earned reward display, and session event log.

## Rationale

The text-spelling routes were repeating the same wrapper state and layout for Type Answer, Spelling Practice, Sentence Builder, and Fill in the Blank. That duplication makes later game growth more expensive and increases the chance that one route drifts from the teacher assignment, target-language, progress-event, or deterministic reward rules.

The shared shell keeps the route structure consistent while each game component remains responsible for its own interaction logic, audio controls, scoring calls, and answer flow.

## Impact

- Type Answer, Spelling Practice, Sentence Builder, and Fill in the Blank now share one route shell.
- Future playable modes can reuse the same shell before premium skinning or Phaser wrappers are considered.
- The shell does not change scoring, unlock logic, audio policy, support-language boundaries, assignment settings, or event semantics.
- The route wrapper remains white-label friendly because tenant reward labels and existing tenant styles still flow through props.

## Constraints

- No Z.ai or outside prototype code is imported by this decision.
- No game behavior is promoted unless its own parent-engine component and verification still pass.
- No support-language-only event may unlock progress through this shell.
- No live storage, assignment mutation, report export, or settings save is enabled.

## Verification

- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
