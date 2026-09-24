# ADR 1167: Pairing Round Event Semantics

Status: Accepted

## Context

Pairing games reveal two cards during one attempt. Emitting `round_shown` for
both taps inflates round counts and makes teacher replay evidence differ by
skin even though the learning action is the same.

## Decision

Emit one `round_shown` event when the first card in an attempt is selected.
Emit `answer_submitted` and `answer_result` only after the second card closes
the attempt. Audio requests may occur for either card but remain support-only.

## Consequences

- Memory Match and Match Up produce comparable replay evidence.
- Attempt counts and teacher reports remain deterministic.
- Audio cannot accidentally become a progression trigger.

## Verification

- `npm run verify:pairing-engine-runtime`
- `npm run verify:canonical-games`
- `npm run typecheck --workspace @living-textbook/web`
