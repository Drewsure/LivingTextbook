# Completion Idempotence Checks

The canonical game completion boundary must accept one valid completion per
game mode in a student session. A second click, duplicate callback, or stale
completed replay must not award more Star Dust, append another
`game_completed` event, or show a false contract error.

## Required checks

- `PlayableGameRouteShell` ignores a completion after the same route has
  already accepted it.
- Front-door and student launch flows guard each accepted mode independently,
  so moving to a later recommended mode remains possible.
- A completion result without an event is a quiet no-op when the mode is
  already completed in the current progression state.
- A missing completion event for an incomplete mode remains a visible contract
  error.
- The guard does not bypass canonical event validation for the first accepted
  completion.

Run:

```text
npm run verify:completion-idempotence
```

This is a state-integrity check. It does not authorize persistence, reward
inventory writes, production assignment, or external Phaser integration.

## Durable contract checks

- Progress-event durable records and hosted/local write intents preserve the
  canonical completion key fields.
- A progress-event write request without an idempotency key is rejected.
- A valid progress-event write request with a canonical key is structurally
  accepted by the request validator.
- Hosted and local adapters retain the same contract; the database choice is
  still open.

Run the broader executable coverage with:

```text
npm run verify:runtime-behavior
npm run verify:backend-storage
```

The runtime behavior harness also checks cross-layer alignment: a valid
progress-event record and adapter intent pass together, while a missing
completion key field or mismatched atomic-write flag is rejected.

It also checks provider-neutral write resolution: a new key plans `create`,
an identical retry plans `return-existing`, a same-key payload mismatch plans
`conflict`, and missing required fields plan `invalid`.

Canonical completion evidence must also carry the same deterministic
`scoringProfileId` on `mastery_updated` and `game_completed`; missing or
mismatched profile metadata is rejected.

Progress-event write requests must carry structured `completionIdentity`, and
the supplied idempotency key must be the canonical key derived from it. A key
from another identity is rejected.

Canonical game event sequences must also include tenant metadata and unit,
launch, and student-session identity on every event.
