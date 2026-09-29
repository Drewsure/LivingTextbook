# DR-1005: Tenant-Scoped Upload Review Workspace

Date: 2026-09-30  
Status: Accepted

## Decision

The teacher upload workspace resolves any safe tenant id through the shared
white-label tenant resolver. Known tenants use their approved configuration;
unknown-but-safe review tenants receive a generic shell until a publisher
package is approved.

## Safety boundary

This decision changes who can reach the review workspace, not what can be
published. Live quarantine intake remains disabled by default. No upload is
promoted to student content, assignment, playlist, QR alias, release package,
or hosted persistence without the existing authorization and evidence gates.

## Rationale

A saleable white-label platform cannot require every publisher to masquerade
as the sample publisher merely to inspect its intake checklist. The resolver
keeps that flexibility at the presentation boundary while preserving the
fail-closed operational boundaries.

See ADR 1289.
