# ADR 0212: Pilot Evidence Packet Preview

Date: 2026-07-14

## Status

Accepted

## Context

A real white-label pilot will need proof: media rights, game/audio coverage, QR stability, privacy/reporting policy, deployment acceptance, backend decisions, and platform QA. Uploading files or capturing signatures before these categories are defined would create a messy and risky workflow.

## Decision

Add a `Pilot evidence packet preview` to `/teacher/intake`.

The packet is derived from the package publish gate and package approval ledger. It names gate evidence and approval evidence, but keeps upload, signature capture, and pilot release blocked.

## Consequences

- Future upload tools have a clear target evidence shape.
- Partner conversations can move from vague promises to concrete proof categories.
- The foundation remains safe because the packet is metadata-first and cannot approve release by itself.
