# ADR 0135: Local Companion Release Gate Storage Contract

## Status

Accepted

## Context

The local companion preview now has a visible release gate, but a future closed local product cannot rely on UI-only gate state. Publisher handoff, installer packaging, local backup, restore, and audit all need a durable record shape.

## Decision

Promote local companion release gates into durable records, adapter write intents, backend schema draft, migration candidates, and migration specs.

## Consequences

- Closed local package readiness has a vendor-neutral storage contract.
- Hosted review and local classroom deployments use the same release-gate vocabulary.
- Installer, local server, and desktop companion packaging remain blocked until release gate records can preserve media, update, backup/export, QR, game/audio reporting, and school policy decisions.
