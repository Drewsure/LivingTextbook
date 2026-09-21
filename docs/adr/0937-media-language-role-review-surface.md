# ADR 0937: Media Language Role Review Surface

## Decision

Expose media language and language role in the teacher media-rights and media
library review previews. The preview must make target-language, assist-language,
neutral, and undeclared evidence distinguishable before any later release or
storage workflow is considered.

## Constraints

- Review data remains read-only and evidence-only.
- Missing role evidence is displayed as unresolved, not inferred.
- The surface does not create upload, release, playlist, assignment, or
  progression authority.
- Existing rights, checksum, transcript, poster, and fallback rules remain in
  force.

## Evidence

- `apps/web/src/data/sampleMediaRightsPlan.ts`
- `apps/web/src/data/sampleUploadChannelReadiness.ts`
- `apps/web/src/features/multimedia/MediaRightsReadinessPanel.tsx`
- `apps/web/src/features/multimedia/TeacherMediaLibraryPanel.tsx`
- `scripts/verify-upload-channel-readiness.mjs`
