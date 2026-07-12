# DR-176: Teacher Draft Package Storage Contract

## Decision

Treat teacher draft packages as first-class backend-neutral authoring records.

## Rationale

Fast teacher authoring is commercially important, but drafts must remain private and review-gated before student assignment.

## Implications

- Durable records and adapter plans include `teacher-draft-package`.
- Backend schema, migration candidates, and migration specs include teacher draft packages.
- Draft records preserve source lineage, owner, visibility, review gates, and audio plan state.
- Direct draft assignment and direct AI publish remain blocked.

## Next

Map draft package storage to the selected backend after authentication, teacher identity, private library visibility, and package approval workflow are accepted.
