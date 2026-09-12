# Z.ai MiniStar Lab Frozen Snapshot

**Review state:** Source snapshot received; compatibility review pending.

## Reproducible Identity

- Repository: `Drewsure/ministar-lab`
- Branch: `main`
- Commit: `eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`
- Tag: `frozen-2026-09-12-aaa-stable`
- AI server reference: `16625090e641179625e1d8bb5f60634bb2036e00`
- Freeze message: `FROZEN STATE - AAA Stable Snapshot 2026-09-12`
- Verification result: `157/157` feature checks passed
- Deployment: `https://ministar-lab.vercel.app`

## Meaning Of The Freeze

The freeze gives LivingTextbook a stable, reproducible candidate source for
review. It does not grant the candidate authority over LivingTextbook schema,
routes, scoring, Star Dust, rewards, audio manifests, playlists, packages,
tenant policy, or student assignments.

## Required Codex Review

Review the frozen candidate against:

- Parent-engine and wrapper boundaries.
- Shared unit payload and tenant configuration.
- Standard progress-event taxonomy.
- Target-language audio for every learner-facing cue.
- Deterministic scoring with LivingTextbook owning mastery and rewards.
- Mobile, keyboard, focus, readable-text, and touch-target behavior.
- Image, audio, video, and code asset rights.
- Removal of provider-specific billing, live storage, and learner-data writes.

## Current Decision

The snapshot is accepted as a review source and remains blocked from direct
production integration. Candidate games must be reviewed individually, with
Phaser treated as a removable visual/gameplay wrapper around the canonical
LivingTextbook contracts.
