# DR-971: Locale-Independent Content Matching

## Decision

Use locale-independent lowercase normalization for canonical content matching
and ordinal comparison for serialized metadata keys used in browser evidence
fingerprints.

## Required Invariants

- Vocabulary duplicate detection does not depend on the host locale.
- Reviewed audio-cue matching does not depend on the host locale.
- Equivalent metadata objects produce the same evidence fingerprint regardless
  of locale-specific collation rules.
- Display localization may remain locale-aware, but identity and evidence
  comparisons must not be.

## Evidence

- `packages/content-model/src/index.ts`
- `apps/web/src/features/audio/AudioCueButton.tsx`
- `apps/web/src/features/persistence/localSessionEvidenceStore.ts`
- `scripts/verify-audio-accessibility.mjs`
