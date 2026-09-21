# Build Session: Locale-Independent Content Matching

## Goal

Keep white-label multilingual content matching and browser rehearsal evidence
deterministic across operating-system and browser locales.

## Change

Replaced locale-sensitive lowercase and metadata-key collation with
locale-independent normalization and ordinal ordering in the shared
content-model, learning-audio control, and browser evidence fingerprint.

## Boundary

This affects matching and identity only. It does not change visible language,
translation policy, scoring, persistence authorization, rewards, or student
progression.

## Verification

- `npm run verify:audio-accessibility`
- `node scripts/verify-locale-independent-content-matching.mjs`
- Content-model and runtime verification
- AI-service and web typechecks
- Production build
- Full foundation gate
