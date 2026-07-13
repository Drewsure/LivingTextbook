# DR-185: Reviewer Decision Storage Contract

## Decision

Add a durable storage contract for teacher draft reviewer decisions.

## Rationale

Reviewer decisions need auditable identity and evidence before they can affect workflow state. The current UI is preview-only, so the storage contract must preserve disabled-state semantics before live workflow implementation.

## Implications

- Shared content-model persistence categories include teacher draft reviewer decision records.
- Hosted and local adapter plans include reviewer decision write intents.
- Backend schema, migration candidates, and migration specs include the decision shape.
- Reviewer decisions cannot change package state, publish, approve, or assign students without future policy gates.

## Next

Connect reviewer decisions to auth, evidence storage, verifier workflow, and package approval ledger only after backend and policy gates are accepted.
