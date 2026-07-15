# 2026-07-15 Evidence Packet Storage Contract

## Build Slice

Promoted evidence packets from review-only UI flow into the backend-neutral storage plan.

## Added

- `evidence_packet` schema entity.
- `m035-evidence-packet-records` migration candidate.
- `spec-evidence-packet` migration spec.
- Hosted and local evidence packet adapter write intents.
- `evidence-packet-record` durable record contract.
- `evidence-packet-boundary` persistence boundary.

## Guardrail

Evidence packets preserve proof and blockers. They do not upload files, capture signatures, approve, publish, promote, transcode, create playlists, activate local folders, create routes, or assign students.

## Verification

`npm run verify:backend-storage` and `npm run verify:foundation` must pass after any evidence packet storage, upload, media, asset, or release-control change.
