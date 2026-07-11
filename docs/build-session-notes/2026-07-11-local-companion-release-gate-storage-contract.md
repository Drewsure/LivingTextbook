# 2026-07-11: Local Companion Release Gate Storage Contract

## Summary

Promoted local companion release gates into the durable record map, hosted/local adapter plans, backend schema draft, migration candidates, and migration specs. This makes the local companion gate auditable before future installer, local server, desktop companion, backup, restore, or publisher handoff work.

## Verification

- `npm run verify:foundation`
- `docs/verification/LOCAL_COMPANION_RELEASE_GATE_STORAGE_CHECKS.md`

## Notes

- This keeps the white-label local product honest: a visible preview is not the same as a closed handoff.
- The local release gate remains vendor-neutral and does not choose a backend or local store yet.
