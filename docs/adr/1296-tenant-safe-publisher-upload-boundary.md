# ADR 1296: Tenant-Safe Publisher Upload Boundary

Status: Accepted

## Context

The shared upload route correctly resolved a tenant, but it rendered the populated Sample Publisher/MiniStar review queue and evidence fixtures for every tenant. That made the upload workspace look complete while weakening the white-label custody boundary.

## Decision

Keep the full populated upload review workspace only for the Sample Publisher reference tenant. For every other safe tenant, render a generic upload workspace that provides platform channel policy and the explicit opt-in quarantine intake, but no sample review records, sample evidence packets, or sample asset candidates.

## Boundaries

- Quarantine intake remains disabled unless the operator explicitly enables the server gate.
- A submitted file remains tenant-bound quarantine metadata and payload; it is not a student-facing asset.
- Scan, rights, source mapping, accessibility, audio coverage, package, QR, persistence, local delivery, and release gates remain separate.
- No sample tenant records may appear in a new publisher workspace.

## Verification

- `/teacher/uploads/white-label-review` shows the generic tenant workspace.
- `/teacher/uploads/sample-publisher` retains the populated reference preview.
- The upload verifier checks the route split and the generic empty-state markers.
