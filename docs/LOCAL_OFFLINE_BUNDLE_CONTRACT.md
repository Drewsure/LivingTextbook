# Local And Offline Bundle Contract

Document type: foundation deployment and content-package contract

Status: Planned contract; no local/offline packaging implementation yet

Related documents:

- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/ROUTE_CONTRACTS.md`
- `docs/SAMPLE_MULTIMEDIA_PACKAGE.md`
- `docs/partner-strategies/LOCAL_TEXTBOOK_COMPANION_STRATEGY.md`
- `docs/adr/0004-permanent-qr-and-local-companion-mode.md`

## Purpose

The Living Textbook platform must support tenants that need a closed or local companion product for printed textbooks, classroom devices, or publisher-controlled media packages.

This contract defines how content and media should be packaged so a tenant can run reliably with poor internet, a local classroom server, an installed PWA, or a desktop app wrapper.

## Product Rule

Local/offline support is part of the white-label platform strategy. It is not a MiniStar-only feature.

A tenant should be able to maintain its own:

- Units
- Games
- Audio
- Video
- Playlists
- QR identifiers
- Teacher reports
- Reward settings
- Optional premium feature entitlements

without hard-coding file paths into game screens.

## Bundle Shape

A local/offline bundle should contain:

- `manifest.json`
- `content-package.json`
- `media/` assets
- `audio-cues/` assets when recorded audio is bundled
- `posters/` and captions/transcripts for video where available
- `checksums.json` or checksum fields in the manifest
- optional tenant theme tokens
- optional teacher/report seed data for local pilots

## Manifest Fields

Planning shape:

```json
{
  "bundle_id": "ministar-level-1-unit-1-demo",
  "tenant_id": "ministar",
  "curriculum_id": "ministar-english",
  "series_id": "ministar-english",
  "book_id": "level-1",
  "unit_ids": ["unit-1"],
  "version": "0.1.0",
  "created_at": "2026-06-29T00:00:00.000Z",
  "content_package_path": "content-package.json",
  "media_root": "media/",
  "offline_ready": true,
  "requires_hosted_redirect": false,
  "assets": [
    {
      "asset_id": "media-ministar-l1-u1-greetings-chant",
      "kind": "audio",
      "local_path": "media/audio/greetings-chant.mp3",
      "checksum": "sha256-placeholder",
      "duration_seconds": 48
    }
  ]
}
```

This is a planning shape, not the final schema.

## Route Resolution

Printed QR codes must resolve stable identifiers, not local files.

A local bundle may resolve:

- `/q/tenant/.../series/.../book/.../unit/.../activity/...`
- `/enter/[tenantId]`
- `/launch/[code]`
- `/media/[playlistId]`

through a local registry.

The same QR identifier should be able to resolve through:

- hosted web app,
- tiny hosted redirect,
- installed PWA,
- desktop app wrapper,
- local classroom server,
- or offline content-package registry.

## Media Resolution

Media assets already support both `sourceUri` and `localBundlePath`.

Resolution order should be:

1. Valid local bundle asset, when running in closed/local mode.
2. Hosted tenant asset URL, when online and permitted.
3. Partner-provided media URL, when allowed by rights metadata.
4. Reviewed placeholder or unavailable-source message, during development only.

Games must not break if optional background media is unavailable.

Comprehension audio for learner-facing text is different: a student-ready offline bundle should provide local audio files or a permitted offline text-to-speech fallback.

## Rights And Provenance

Every media asset in a local/offline bundle must record:

- owner,
- rights status,
- allowed tenant,
- allowed deployment channel,
- redistribution rights,
- local/offline availability,
- source file path or origin,
- checksum or version marker.

Do not bundle public or partner assets without documented rights.

## Sync And Update Strategy

Local/offline bundles must have a clear update story.

Required considerations:

- Bundle version.
- Content package version.
- Asset checksums.
- QR registry version.
- Tenant package entitlement version.
- Teacher report export/sync path.
- Conflict handling if local progress exists when a bundle updates.

## Teacher Reporting In Local Mode

Local/closed deployments still need reports.

Possible reporting paths:

- local device storage only,
- classroom server storage,
- teacher export file,
- periodic online sync,
- school-hosted database.

Do not assume cloud persistence is always available.

## Security And Privacy

Local mode must not leak private student data through QR codes, filenames, or exported bundles.

Student identities should use:

- anonymous session id,
- teacher-provided user code,
- local roster id,
- or tenant-approved authenticated user id.

Printed QR codes should remain stable and non-private.

## Acceptance Criteria For First Local Bundle Prototype

A first prototype should demonstrate:

1. One content package.
2. One audio asset.
3. One video asset.
4. One playlist.
5. One permanent QR identifier.
6. One local bundle manifest.
7. Media resolution through `localBundlePath`.
8. A clear unavailable-source fallback when media is missing.
9. Teacher-visible media/game progress events.
10. No dependency on AI Tutor.

## Current Build Instruction

Do not implement local/offline packaging until the current foundation slice is locally verified.

Before implementation:

1. Sync local checkout to `legacy-source-import`.
2. Run build/typecheck.
3. Verify student and front-door routes.
4. Confirm media telemetry checks.
5. Then add the smallest manifest sample and resolver helper.
