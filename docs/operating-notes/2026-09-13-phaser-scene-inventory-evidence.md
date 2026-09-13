# Operating Note: Phaser Scene Inventory Evidence

**Status:** Active

## Procedure

1. Treat `docs/ZAI_MINISTAR_LAB_SUITE_INVENTORY_2026-09-12.md` as the source
   review record for the frozen MiniStar Phaser snapshot.
2. Confirm the repository, tag, commit, active scene count, and SHA-256 file
   evidence before discussing a wrapper.
3. Run `npm run verify:phaser-scene-inventory` after inventory or mapping
   changes.
4. Run `npm run verify:foundation` before accepting a candidate review packet.
5. Keep all Phaser source outside `apps/web` and `apps/ai-service` until the
   candidate-specific wrapper decision is accepted.

## Consistent workaround

When the source archive or local snapshot is unavailable to a managed session,
use the previously recorded commit, tag, file paths, and hashes as provenance
only. Do not recreate a source manifest from memory and do not mark candidate
compatibility complete. Record the missing local evidence and request only the
specific files or replay artifacts needed for the named candidate.

## Human handoff

The foundation is now ready for controlled candidate evidence. The human side
should provide one candidate package at a time, beginning with Memory Match:
fixture replay, event/scoring replay, target-language audio map,
mobile/accessibility evidence, and wrapper notes. A source archive, merge, or
route request is not the next handoff.
