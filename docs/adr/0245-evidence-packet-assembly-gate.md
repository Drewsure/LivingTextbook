# 0245 Evidence Packet Assembly Gate

Status: accepted
Date: 2026-07-16

## Context

The upload, Labelled Diagram, media, handoff, export-readiness, attachment-storage, and storage-adapter gates now exist as separate review surfaces. The remaining risk is that a reviewer sees many useful panels but cannot tell whether the whole evidence packet is ready to freeze, approve, export, promote, or assign.

## Decision

Add an evidence packet assembly gate to `/teacher/evidence/sample-publisher`.

The gate rolls up upload intake, Labelled Diagram, media, and release-control evidence into release readiness lanes. It keeps packet version freeze, approval capture, release-state mutation, student assignment, export generation, QR promotion, route promotion, local bundle activation, storage write, and evidence download explicitly blocked.

## Consequences

- Reviewers get one go/no-go view before any future release workflow exists.
- Evidence remains metadata-first and review-only.
- Target-language, audio, accessibility, rights, scan, storage, dry-run, and classroom launch evidence stay visible as preconditions.
- The build does not create packet exports, signatures, live upload, route promotion, QR promotion, local bundle activation, or assignments.
