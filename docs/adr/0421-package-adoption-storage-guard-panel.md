# ADR 0421: Package Adoption Storage Guard Panel

Status: Accepted

## Context

The backend schema and persistence contract now preserve package adoption record previews, but the entitlement workbench also needs a human-readable guard so admins can understand why premium activation remains blocked.

## Decision

Add a review-only `PackageAdoptionStorageGuardPanel` to `/teacher/entitlements`. The panel lists storage contract ids, visible storage fields, required pre-activation decisions, and blocked activations for premium package adoption.

## Consequences

- The package adoption storage contract is visible in the commercial/admin surface, not only the backend intake surface.
- Optional AI generation, Voice Tutor, microphone scoring, report export, hosted storage, and local companion activation remain explicitly blocked.
- Future accepted package adoption workflows can reuse the same field and guard vocabulary.
