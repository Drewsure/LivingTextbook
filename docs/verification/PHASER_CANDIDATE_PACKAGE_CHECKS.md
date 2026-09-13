# Phaser Candidate Package Checks

Status: Manual controlled-intake check

## Purpose

Verify one returned Z.ai candidate folder before Codex reviews wrapper
compatibility. This check validates the Memory Match return envelope, frozen
source identity, artifact checksums, required evidence kinds, safe paths, and
blocked actions. It never imports source, creates routes, or changes the
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

## Required return package

The folder must contain `evidence/return-package.json` and exactly eight
reviewed artifacts: source archive manifest, fixture, README, event replay,
audio coverage, scoring replay, mobile/accessibility evidence, and wrapper
notes. Every artifact must be hash-verified on disk.

The package must be bound to the frozen
`Drewsure/ministar-lab` snapshot
`frozen-2026-09-12-aaa-stable` at commit
`eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`.
