# DR-1179: Assist-Language Audio Asset Evidence

## Decision

Enumerate each reviewed assist-language gloss as a row-level audio evidence
item with cue binding, media asset binding, status, and blockers.

## Boundaries

- The packet is review-only and provider-neutral.
- No upload, download, rights approval, promotion, student-facing use, or
  speech API billing is enabled.
- Support audio cannot trigger progression, mastery, rewards, or package release.

## Why now

The shared coverage contract identified missing support audio, but a publisher
needs to know exactly which reviewed terms, sentences, and instructions still
need assets. This packet makes that work actionable without opening a live
media workflow.

## Verification

`npm run verify:assist-language-audio-evidence`

## Related

- ADR 1179
- ADR 1178
- `docs/ASSIST_LANGUAGE_STANDARD.md`
