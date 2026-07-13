# DR-189: Review Audit Trail Storage Contract

## Decision

Add a durable storage contract for teacher draft review audit trails.

## Rationale

Review workflows need accountable event history before reviewer actions can affect package state. Separating audit events from evidence packets and approval ledgers prevents preview UI, chat notes, or anonymous actions from becoming implied approvals.

## Implications

- Shared content-model persistence categories include teacher draft review audit trail records.
- Hosted and local adapter plans include review audit write intents.
- Backend schema, migration candidates, and migration specs include audit event metadata.
- Audit events cannot approve, publish, upload evidence, assign students, or change package state by themselves.

## Next

Connect audit events to reviewer identity, evidence packets, and approval ledgers only after authentication and release-control policies are accepted.
