# DR-213: Pilot Evidence Packet Storage Contract

Date: 2026-07-14

## Decision

Promote the pilot evidence packet preview into a backend-neutral storage contract.

## Rationale

A saleable white-label platform needs auditable proof before pilots: media rights, game/audio quality, QR stability, privacy/reporting, deployment, and policy evidence. That proof must be durable and exportable, but live uploads and signed approvals must remain blocked until identity, storage, retention, and release-control policy exist.

## Standard

- `pilot_evidence_packet` must exist in schema, migration candidates, migration specs, durable records, adapter write intents, backend storage verifier, and active route verification.
- The record must preserve `gate_evidence` and `approval_evidence`.
- The record must keep `upload_allowed` and `signed_approval_capture_allowed` blocked until policy gates are accepted.
- No raw learner audio, learner transcripts, anonymous evidence, or chat-only approval proof may enter this record.
