# DR-233: Upload Target Mapping Preview

## Decision

Require explicit upload target mapping before any uploaded file can be promoted.

## Why

White-label partners will upload source files and media, but the platform must know what each file is allowed to become. A PDF/text upload may become a teacher draft candidate; an image may become a Labelled Diagram asset; music may become a playlist item; video may become optional playlist or local-bundle media. None of those paths should be implicit.

## Rules

- `target_mapping_packet` is required before upload promotion.
- No route is created directly from an uploaded file.
- No uploaded file becomes a student assignment target.
- No upload-to-assignment shortcut is allowed.
- No folder placement activation is allowed for local bundles.

## Follow-Up

When persistence is ready, preserve target mapping records separately from upload intake, file policy, review decisions, promotion gates, and release approvals.
