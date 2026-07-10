# 2026-07-10: Persistence Event Taxonomy Write Intents

## Work Completed

- Added `preservesEventEffectTaxonomy` to persistence write intents.
- Required taxonomy preservation for progress-event-stream intents.
- Marked hosted and local progress event writes as taxonomy-preserving.
- Displayed the taxonomy preservation status in the persistence readiness panel.

## Verification

- Run typecheck/build.
- Check `http://127.0.0.1:3000/teacher/intake`.

