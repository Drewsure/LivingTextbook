# DR-1178: Gloss-Bound Assist-Language Audio Coverage

## Decision

Calculate support-language audio readiness from the reviewed glosses for each
term, sentence, and instruction. Display the exact required, covered, and
missing items in teacher review.

## Boundaries

- Coverage is review evidence only.
- No speech generation, upload, rights approval, package write, or student
  assignment is enabled.
- Assist audio cannot trigger progression, mastery, rewards, or release.
- Target-language audio remains governed by its existing approval contract.

## Why now

The assist-language review packet exposed that a raw audio count was too weak
for a production-shaped white-label content pipeline. The shared calculation
now makes missing audio explicit without prematurely activating a media path.

## Verification

`npm run verify:assist-language-audio-coverage`

## Related

- ADR 1178
- ADR 1177
- `docs/ASSIST_LANGUAGE_STANDARD.md`
