# Build Session Note: Evidence Attachment Storage Contract

Date: 2026-07-15

## Summary

Added the backend-neutral evidence attachment storage contract.

## What Changed

- Added `evidence_attachment` to the backend schema draft.
- Added `m036-evidence-attachment-records` to migration candidates.
- Added `spec-evidence-attachment` to migration specs.
- Added hosted and local persistence adapter write intents.
- Added an evidence attachment durable record.
- Extended backend and active-route verification.

## Safety Boundary

This work does not implement real upload, object storage writes, local folder writes, downloads, signed approval attachment capture, release-state mutation, or student-facing attachment behavior.
