# ADR 0213: Pilot Evidence Packet Storage Contract

Date: 2026-07-14

## Status

Accepted

## Context

The pilot evidence packet preview defines what proof a partner pilot needs, but a real pilot cannot rely on UI-only state or chat notes. The platform needs a vendor-neutral record contract before live evidence upload, signed approval capture, or backend-specific migrations.

## Decision

Add `pilot_evidence_packet` across the backend-neutral storage layers:

- durable record category,
- hosted and local adapter write intents,
- backend schema draft,
- migration candidate,
- migration spec,
- backend storage verifier,
- teacher intake route verification.

The record must preserve gate evidence and approval evidence while keeping evidence upload and signed approval capture blocked until identity, storage, retention, export, and release-control policy are accepted.

## Consequences

- Future backend work has a clear evidence packet target.
- Hosted and local deployments share the same record vocabulary.
- Partner pilot proof cannot be accepted through chat-only approval or anonymous evidence.
