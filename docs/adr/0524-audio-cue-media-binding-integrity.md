# ADR-0524: Audio Cue Media Binding Integrity

Status: Accepted

## Context

Audio cues can be backed by recorded files, partner media, teacher recordings, text-to-speech, or a fallback voice. The optional `mediaAssetId` field allows a cue to point to a concrete package asset, but the shared validator did not verify that reference. That could leave an apparently valid cue pointing to missing, video, cross-tenant, or cross-unit media.

## Decision

When an audio cue declares `mediaAssetId`, the referenced asset must exist in the same package, have audio kind, use the package tenant, and match the cue unit when both are unit-scoped. Cues without an asset ID remain valid when their source and audio-support plan satisfy the other contracts.

## Consequences

Media-backed cues resolve predictably without selecting a storage provider. Text-to-speech and fallback voice remain provider-neutral. Upload, storage, playback, release, and student-facing activation remain behind existing runtime gates.

