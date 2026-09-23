# Phaser Candidate Package Checks

Status: Manual controlled-intake check

## Purpose

Verify one returned Z.ai candidate folder before Codex reviews wrapper
compatibility. This check validates an approved candidate profile, frozen source
identity, artifact checksums, required evidence kinds, safe paths, and blocked
actions. It also validates fixture shape, event replay, the audio map,
deterministic scoring replay, accessibility evidence, source-manifest syntax,
and wrapper boundaries. It never imports source, creates routes, or changes the
production app.

## Command

```powershell
$env:LIVING_TEXTBOOOK_ZAI_CANDIDATE_ROOT = "C:\\path\\to\\isolated\\memory-match-candidate"
npm run verify:phaser-candidate-package
```

If the environment variable is absent, the command reports `NOT READY` and
exits without changing the repository. This command is intentionally outside
`verify:foundation` because no returned Z.ai package is part of the canonical
source tree.

Do not paste a documentation placeholder such as
`<returned-package-folder>` or `C:\path\to\...` into the command. The verifier
rejects those values before filesystem access. Replace the example with the
actual absolute folder returned by Z.ai, and confirm that it contains the
`evidence` directory.

Any successful package check remains `review-only`; it is evidence for Codex
review and never a production promotion decision.

## Required return package

The folder must contain `evidence/return-package.json` and exactly eight
reviewed artifacts: source archive manifest, fixture, README, event replay,
audio coverage, scoring replay, mobile/accessibility evidence, and wrapper
notes. Every artifact must be hash-verified on disk.

The verifier applies a 64 KiB limit to `evidence/return-package.json` and a
4 MiB limit to each referenced evidence artifact before parsing or hashing.
These are review-process safety limits, not trust or approval signals.

The candidate root must be outside the `LivingTextbook` repository. The gate
resolves the candidate root, the return manifest, and every artifact before
reading them; a missing file, directory, or symlink that resolves outside the
isolated root is rejected. This prevents a review packet from accidentally
reading or promoting product files through a relative path.

The foundation suite also runs a temporary synthetic package test. It proves
that a complete evidence packet passes and that a packet declaring random
rewards or cross-session audio evidence is rejected; no candidate source or
learner data is used by this test.

The currently approved profiles are `memory-match` (`pairing`) and
`balloon-pop` (`selection`). The fixture must contain 8-12 unique vocabulary
terms, exactly two target sentences, and tenant-bound parent-engine metadata.
The event replay must carry
tenant, unit, launch, and student-session identity on every learning event,
use a `replay-v1:` seed, and remain chronological in canonical event order.
At least one `audio_requested` event must appear after `round_shown` so audio
evidence remains attached to a visible learning round.
No `audio_requested` event may appear after `game_completed`; the completed
attempt is closed for replay and report purposes.
No `audio_requested` event may appear after `mastery_updated`; mastery closes
the active learning attempt before final completion is recorded.
The audio map must cover every term plus instruction, feedback, and critical
controls in a reviewed language. The scoring replay must prove the profile's
required scenarios: `memory-match` requires `correct`, `incorrect`, `retry`,
and `completion`; `balloon-pop` additionally requires `miss`. Both profiles
must use deterministic scoring and no random rewards. Accessibility evidence
must cover keyboard, focus, touch, reduced motion, readable fallback, and
small-screen behavior. Wrapper notes must explain Phaser lifecycle mapping
while keeping score, persistence, and reporting platform-owned.

The package must be bound to the frozen
`Drewsure/ministar-lab` snapshot
`frozen-2026-09-12-aaa-stable` at commit
`eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`.
