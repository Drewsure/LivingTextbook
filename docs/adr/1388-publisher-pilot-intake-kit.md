# ADR 1388: Publisher Pilot Intake Kit

## Decision

Provide a reusable, metadata-only publisher pilot intake kit before requesting
the first real Unit 1 package. The kit records publisher, edition, unit,
source, media, QR, delivery, and policy intent, while keeping assembly,
student-facing use, and hosted persistence disabled.

## Rationale

The platform's review and delivery contracts are now strong, but a publisher
needs a practical handoff format that does not require copying a full internal
manifest or guessing which media and policy evidence is required. A small
folder scaffold reduces intake errors and keeps later preflight deterministic.

## Boundaries

- The generator refuses to overwrite a brief.
- Paths are relative and checked for traversal and unsafe characters.
- Rights, accessibility, checksums, and scans remain review evidence; they are
  never inferred from the brief.
- The kit cannot authorize package assembly, QR printing, persistence, or
  student use.
- The kit is white-label and does not encode MiniStar-specific content.

## Verification

`node scripts/create-publisher-pilot-intake-kit.mjs --self-test`

`node scripts/verify-publisher-pilot-intake-kit.mjs`

`node scripts/publisher-pilot-intake-preflight.mjs --self-test`

See `docs/PUBLISHER_PILOT_INPUT_KIT.md` and the active pilot acceptance matrix.
