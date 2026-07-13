# DR-191: Verifier Submission Storage Contract

## Decision

Add a durable storage contract for teacher draft verifier submission preflights.

## Rationale

Draft review should not become a live verifier workflow until preflight checks are durable. The storage contract preserves schema, audio, support-language, route, evidence, audit, and approval checks while blocking automatic submission.

## Implications

- Shared content-model persistence categories include teacher draft verifier submission records.
- Hosted and local adapter plans include verifier submission write intents.
- Backend schema, migration candidates, and migration specs include preflight metadata.
- Preflight records cannot approve, publish, assign students, or submit automatically by themselves.

## Next

Connect verifier submission records to real verifier workflow ownership only after authentication, evidence storage, approval ledger policy, and release-control policy are accepted.
