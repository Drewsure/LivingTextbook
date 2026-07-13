# DR-182: Draft Review Handoff Storage Contract

## Decision

Add a durable storage contract for teacher draft review handoff packets.

## Rationale

The authoring route needs a visible path from teacher drafts to verifier review, but live review submission must wait for persistent draft ownership, packet sections, audio regeneration, rights/version evidence, route compatibility, and package approval.

## Implications

- Shared content-model persistence categories include teacher draft review handoff records.
- Hosted and local adapter plans include review handoff write intents.
- Backend schema, migration candidates, and migration specs include the packet shape.
- Live review submission and student assignment remain blocked.

## Next

Connect the packet contract to real auth, persistence, verifier workflow, and approval ledger only after backend and policy gates are accepted.
