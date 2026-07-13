# DR-187: Review Evidence Storage Contract

## Decision

Add a durable storage contract for teacher draft review evidence packets.

## Rationale

Reviewer decisions need evidence, but file upload and signature capture require identity, storage, retention, rights, and approval policies. A backend-neutral contract prevents future implementations from treating preview text or chat approval as sufficient proof.

## Implications

- Shared content-model persistence categories include teacher draft review evidence records.
- Hosted and local adapter plans include review evidence write intents.
- Backend schema, migration candidates, and migration specs include evidence packet metadata.
- Evidence upload remains blocked.

## Next

Connect evidence packets to object/local file storage and approval ledgers only after identity, retention, rights, and policy gates are accepted.
