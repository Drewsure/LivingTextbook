# DR-1009: Media Language Role Review Surface

Decision: teacher media-rights and media-library review surfaces show media
language and declared language role as explicit evidence.

Required invariants:

- Reviewers can distinguish target, assist, neutral, and undeclared media
  roles without inferring from filenames or routes.
- The upload-channel readiness contract names the role requirement for
  policy-bound audio and video.
- Review visibility does not authorize upload, release, playlist, assignment,
  or progression.

Evidence: `docs/adr/0937-media-language-role-review-surface.md`,
`apps/web/src/data/sampleMediaRightsPlan.ts`,
`apps/web/src/features/multimedia/MediaRightsReadinessPanel.tsx`, and
`apps/web/src/features/multimedia/TeacherMediaLibraryPanel.tsx`.
