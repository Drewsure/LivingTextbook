# DR-209: Activity Compatibility Snapshot Storage Contract

## Decision

Promote `activity_compatibility_snapshot` into the backend-neutral schema, migration candidates, migration specs, persistence adapter plans, durable record map, and backend storage verifier.

## Rationale

Curated pathways are a core product distinction. The platform needs durable compatibility outcomes so teacher authoring, template rendering, printable output, and local bundles cannot silently drift into unchecked template conversion.

## Implications

- `/teacher/intake` exposes `activity_compatibility_snapshot`.
- Hosted and local write intents preserve compatibility snapshots.
- Student-facing pathway changes remain blocked until compatibility, audio, media, language, and release gates pass.
- Support-language triggers, unchecked crossword conversion, media-only mastery paths, and switch-to-anything behavior remain blocked.

## Next

When live pathway editing begins, build the compatibility reviewer before enabling teacher-facing pathway changes or extra conversions.

