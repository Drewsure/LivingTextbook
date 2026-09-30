# ADR 1350: Publisher Source Directory Preflight

Date: 2026-10-01
Status: Accepted

## Decision

Before quarantine intake, a publisher may provide an explicit
`publisher-source-manifest.json` beside a source directory. A bounded
preflight command inventories only the declared files, infers supported media
types from extensions, records file sizes and SHA-256 checksums, and reports
missing, unsupported, invalid, or unlisted files.

The preflight report is review evidence, not an upload or package. It is
side-effect-free unless the operator explicitly supplies an output path for
the report itself. It cannot copy payloads, write quarantine records, promote
assets, assemble packages, print or mutate QR aliases, activate hosted
persistence, create learner records, or start students.

## Rationale

The saleable white-label pilot needs a practical first handoff for publishers
who already have PDFs, images, audio, video, transcripts, fonts, and game
background media in a local folder. Requiring an explicit manifest prevents
filename guessing and gives later review lanes stable asset identity. The
preflight is intentionally separate from the existing upload endpoint so a
publisher can correct a source package before any server-side custody write.

## Operational command

Set `LIVING_TEXTBOOOK_PUBLISHER_SOURCE_DIRECTORY` to the source folder. The
folder must contain `publisher-source-manifest.json`. Optionally set
`LIVING_TEXTBOOOK_PUBLISHER_PREFLIGHT_OUTPUT` to a review-evidence JSON path,
then run `npm run preflight:publisher-source`. An incomplete inventory exits
non-zero and must be corrected before quarantine review.

## Boundaries

- The manifest is metadata and must remain review-only.
- Relative paths must stay within the supplied source folder.
- Only declared files enter the inventory; unlisted files are blockers.
- Checksums are evidence, not rights approval or release approval.
- Rights, accessibility, target-language audio, game replay, sentence
  approval, package, delivery, QR, policy, deployment, persistence, and
  teacher-rehearsal gates remain independent.

