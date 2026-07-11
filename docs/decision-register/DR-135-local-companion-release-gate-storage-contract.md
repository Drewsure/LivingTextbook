# DR-135: Local Companion Release Gate Storage Contract

## Decision

Add local companion release gate records across the durable record map, hosted/local adapter plans, backend schema draft, migration candidates, and migration specs.

## Reason

The local release gate is now visible on `/local/sample-publisher`, but closed companion production needs an auditable record. A publisher handoff, installer, local server, backup, restore, or yearly update must not depend on static UI state.

## Standard

- `local-companion-release-gate` is a first-class persistence category.
- Hosted and local adapter plans include release gate write intents.
- Backend schema draft includes `local_companion_release_gate`.
- Backend migration candidates include local companion release gate records.
- Backend migration specs define primary key, tenant scope, gate items, blocked count, closed handoff gate, retention, export, and local fallback.
- Closed handoff remains blocked until installer/update, media rights/checksums, backup/export, QR fallback, game/audio reporting, and school access/privacy gates are closed.
