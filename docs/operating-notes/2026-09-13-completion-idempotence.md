# Operating Note: Completion Idempotence

**Status:** Active

## Procedure

1. Run `npm run verify:completion-idempotence` after changing canonical game
   completion handlers or progression callbacks.
2. Confirm the first completion still passes the canonical event-sequence
   validator.
3. Confirm a duplicate callback does not append a second `game_completed`
   event, award Star Dust, or create a false contract error.
4. Confirm front-door and student flows track accepted modes independently.
5. Run web typecheck, production build, and active-route verification after
   route-shell changes.

## Consistent workaround

The current guard is in-memory and protects one browser route session. It is
not a substitute for durable hosted/local persistence. When persistence is
implemented, carry a stable idempotency key derived from tenant, unit,
launch/session, game mode, and completion attempt into the adapter write
boundary. Never solve duplicate completion by trusting a disabled button alone.

## Boundary

Already-completed replay responses without a new completion event are expected
and remain quiet. Missing completion evidence for an incomplete mode remains a
visible contract error. This rule does not authorize Phaser source import,
reward inventory writes, assignment activation, or production launch.
