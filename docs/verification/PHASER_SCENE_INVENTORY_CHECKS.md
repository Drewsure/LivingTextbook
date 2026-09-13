# Phaser Scene Inventory Checks

Status: Active foundation check

## Purpose

Protect the exact evidence boundary for the frozen Z.ai MiniStar Lab snapshot.
This check confirms that the active scene manifest and candidate mapping remain
reproducible and review-only. It does not inspect or execute the external
source, and it does not approve any Phaser scene for production use.

## Required evidence

- Frozen repository: `Drewsure/ministar-lab`
- Frozen tag: `frozen-2026-09-12-aaa-stable`
- Frozen commit: `eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`
- Exactly 32 active scene entries with SHA-256 evidence.
- Four parent-engine mapping labels.
- Explicit mismatch record for 32 active scenes versus the summary's 25 games.
- Explicit blocked source-import, route-replacement, scene-scoring,
  browser-persistence, package-promotion, and student-assignment rules.

## Verification

```powershell
npm run verify:phaser-scene-inventory
```

Run this check after changing the frozen snapshot identity, candidate order,
scene mapping, or any Phaser intake documentation. Follow it with the complete
foundation gate before proposing wrapper work.

## Human boundary

No Z.ai branch, archive, pull request, or source patch is requested by this
check. The next human handoff is only needed when a specific candidate review
packet is ready to request its fixture replay, audio evidence, accessibility
capture, or wrapper notes.
