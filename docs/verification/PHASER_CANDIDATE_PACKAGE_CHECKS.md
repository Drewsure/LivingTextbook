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

Any successful package check remains `review-only`; it is evidence for Codex
review and never a production promotion decision.

## Required return package

The folder must contain `evidence/return-package.json` and exactly eight
reviewed artifacts: source archive manifest, fixture, README, event replay,
audio coverage, scoring replay, mobile/accessibility evidence, and wrapper
notes. Every artifact must be hash-verified on disk.

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
