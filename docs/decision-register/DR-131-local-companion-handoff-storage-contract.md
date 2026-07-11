# DR-131: Local Companion Handoff Storage Contract

## Decision

Promote local companion handoff checklists into durable records, adapter plans, schema draft, migration candidates, and migration specs.

## Reason

The local companion route now shows the handoff checklist, but closed package production needs a durable record shape so checklist state survives handoff, backup, restore, package export, and future installer/local server work.

## Standard

- `local-companion-handoff` is a first-class persistence category.
- Hosted and local adapter plans include local companion handoff write intents.
- Backend schema draft includes `local_companion_handoff`.
- Migration candidates and specs define keys, tenant scope, checklist items, blockers, offline-ready gates, retention, export, and local fallback.
- Offline-ready status must be derived from checklist completion and cannot be manually overridden.
