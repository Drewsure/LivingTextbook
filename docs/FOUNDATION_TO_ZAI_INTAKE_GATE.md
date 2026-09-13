# Foundation To Z.ai Intake Gate

**Status:** Open for controlled intake; direct integration remains blocked.

## Decision

The LivingTextbook foundation has reached the phase where isolated Z.ai game
prototypes may be requested and inventoried. The first approved prototype
repository is `Drewsure/ministar-lab`. This phase does not authorize source
copying, app changes, route replacement, package promotion, or student use.

## Foundation Evidence

- Full foundation verification passes all runtime contract checks.
- AI-service and content-model typechecks pass.
- The production web build passes.
- All 88 active route checks pass.
- Prototype intake, returned-package, evidence-packet, wrapper-review, and
  Codex-decision contracts are present and review-only.

## What Z.ai May Provide Now

Z.ai may build one isolated candidate game at a time in
`Drewsure/ministar-lab` and return a review package containing:

- An immutable source snapshot and repository/branch identity.
- The exact source commit SHA plus a repository-relative SHA-256 manifest of
  every reviewed source file.
- A reviewed JSON fixture using the shared unit payload shape.
- Standard event and deterministic scoring replay evidence.
- Target-language audio coverage evidence for every learner-facing cue.
- Mobile and accessibility evidence.
- Phaser wrapper notes when the candidate uses Phaser.
- A README describing dependencies, controls, asset rights, and known limits.

## Frozen Candidate Snapshot Received

The first candidate snapshot has now been identified for Codex review:

- Repository: `Drewsure/ministar-lab`
- Branch: `main`
- Commit: `eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`
- Tag: `frozen-2026-09-12-aaa-stable`
- AI server reference: `16625090e641179625e1d8bb5f60634bb2036e00`
- Freeze verification: `157/157` feature checks passed
- Candidate deployment: `https://ministar-lab.vercel.app`

This proves source identity and reproducibility. It does not yet prove
LivingTextbook wrapper compatibility, target-language audio coverage,
standard-event replay, deterministic scoring ownership, mobile accessibility,
or white-label tenant safety.

The isolated snapshot has now been checked locally with
`node scripts/verify-phaser-source-evidence.mjs` using the extracted review
folder. Result: `5/5` manifest hashes match
`eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`. This verifies the evidence packet
against the supplied files; it does not change the blocked integration status.

## What Remains Blocked

- Direct file copy into `apps/web` or `apps/ai-service`.
- Route registry replacement or new student-facing route activation.
- Scoring, Star Dust, reward, audio-manifest, playlist, package, roster, or
  assignment mutation.
- Provider billing, live storage writes, or student-data collection.

## Codex Review Gate

Codex must compare the returned package against the parent-engine contract,
tenant boundary, payload schema, audio-first rule, event taxonomy, scoring
replay, mobile evidence, and wrapper boundary before proposing an integration
plan. A returned package is evidence for review, not approval to integrate.

## Human-Side Action

The owner has completed the source-freeze handoff. Codex may now inspect the
identified snapshot and open the first candidate review. No other human
intervention is required unless the review finds missing fixtures, replay
reports, asset rights, or access to a specific candidate game.

## Reproducibility Check

When the isolated snapshot is available locally, run
`node scripts/verify-phaser-source-evidence.mjs` from the repository root. The
command reads only the review packet manifest and compares SHA-256 hashes
against the external snapshot. It is intentionally outside
`verify:foundation` because the frozen source is not checked into this
repository. If the snapshot is elsewhere, set
`LIVING_TEXTBOOK_ZAI_REVIEW_ROOT` to its folder.

## Returned Candidate Package Check

When a named candidate package is returned, set
`LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT` to its isolated folder and run
`npm run verify:phaser-candidate-package`. The command checks the Memory Match
return envelope, frozen source identity, eight reviewed artifact kinds, safe
paths, and blocked actions. It is intentionally outside `verify:foundation`:
absence of a returned package is `NOT READY`, not a canonical build failure.
