# ADR 0936: Multilingual Media Language Role

## Decision

Audio and video assets in a package with an explicit non-English target policy
must declare whether they are target-language, assist-language, or neutral.
Target and assist assets must match the package language configuration.

Image assets remain language-neutral by default because their language-bearing
content is reviewed through the labelled-diagram, alt-text, and audio cue
contracts instead.

## Constraints

- Existing English packages remain compatible during migration.
- Rights, tenant, unit, poster, transcript, and locator checks remain intact.
- Media role validation does not grant release, playlist, assignment, or
  progression authority.

## Evidence

- `packages/content-model/src/index.ts`
- `scripts/verify-runtime-behavior.mjs`
- `scripts/verify-content-package-runtime.mjs`
