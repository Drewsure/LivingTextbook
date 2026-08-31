# ADR 0465: Local Companion Active Game Coverage

Status: Accepted

Date: 2026-08-31

## Context

White-label textbook partners may need a closed local companion product with stable QR entry, bundled media, games, and teacher progress summaries. The local bundle manifest named several game routes, but it did not fully mirror the active game catalog and used a couple of loose engine aliases instead of shared parent-engine ids.

## Decision

Local companion manifests must name every active playable game mode as included, planned, or blocked. Each game entry must use shared `GameModeId`, shared parent-engine ids, target-language audio coverage, progress-reporting status, and a local route path.

## Consequences

- Closed local packages now track the same active game surface as hosted PWA routes.
- MiniStar and sample publisher planning manifests can show which game routes are included, planned, or still policy-gated.
- Local bundle verification protects Balloon Pop and every current active game mode.
- Parent-engine ids stay aligned with the platform contract instead of local-only aliases.

## Still Blocked

- No local package export.
- No offline-ready status.
- No media file copy or checksum generation.
- No local report retention or student data storage.
