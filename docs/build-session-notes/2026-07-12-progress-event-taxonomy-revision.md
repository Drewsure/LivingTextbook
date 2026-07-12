# 2026-07-12: Progress Event Taxonomy Revision

## Summary

Added a visible progress event taxonomy revision contract. The teacher/admin intake page now shows `taxonomy-v2026.07.foundation`, required storage fields, and change-control rules for new game, media, speech, AI Tutor, reward, or route-guidance events.

## Verification

- `npm run verify:foundation`
- `docs/verification/PROGRESS_EVENT_TAXONOMY_REVISION_CHECKS.md`

## Notes

- This does not implement live event storage.
- This keeps future backend, report, and game-event work tied to a named taxonomy version.
