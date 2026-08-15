# Activity Pathway Compatibility Checks

## Scope

Run after activity pathway, game offer, printable, template conversion, text puzzle, teacher authoring, target-language, or support-language changes.

## Checks

- Confirm `npm run verify:activity-pathways` passes.
- Confirm `/teacher/intake` shows `Activity pathway compatibility`.
- Confirm offered activities include Entry Flashcards, Match Up, Label It, Memory Match, Teacher Review Quiz, Type Answer, and Sentence Builder.
- Confirm printable vocabulary and sentence outputs remain planned.
- Confirm Word Search and Crossword remain blocked until text-only puzzle validation and reviewed clue rules exist.
- Confirm target-language trigger rules are visible.
- Confirm support language cannot unlock progress.
- Confirm backend storage readiness includes `activity_compatibility_snapshot`.
- Confirm activity compatibility snapshots preserve allowed modes, blocked conversions, target-language trigger policy, printable output policy, and student-facing pathway blocks.
- Confirm `npm run verify:foundation` includes the activity pathway verifier.

## Verification Command

```powershell
npm run verify:foundation
```
