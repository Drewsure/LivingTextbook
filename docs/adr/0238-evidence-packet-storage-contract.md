# ADR 0238: Evidence Packet Storage Contract

## Status

Accepted.

## Context

The review-only upload, Labelled Diagram, and media workspaces now expose evidence packet flows. Without a backend-neutral storage contract, future upload or asset work could preserve the UI but lose the packet state that proves lineage, rights, missing evidence, blocked actions, and release readiness.

## Decision

Add `evidence_packet` as a generic backend-neutral schema entity, migration candidate, migration spec, durable record, and hosted/local adapter write intent. Evidence packets preserve packet keys, status, owner role, required evidence, missing evidence, blocked live actions, and handoff rules while blocking evidence uploads, signed approval capture, promotion, and student-facing use.

## Consequences

- Upload, image asset, media, local bundle, and pilot evidence flows can share one durable evidence model.
- Hosted and closed/local deployments remain compatible.
- Evidence packets do not approve, publish, assign, upload, transcode, create playlists, activate local folders, or promote assets by themselves.
- Backend storage verification now covers this contract before any real upload controls are built.
