# Training Academy Verification Checklist

Use this checklist after pulling the latest `legacy-source-import` branch.

## Local Setup

1. Confirm the branch is `legacy-source-import`.
2. Confirm the checkout includes `apps/web/src/features/training/TrainingAcademyFlow.tsx`.
3. Confirm the checkout includes `apps/web/src/features/training/TrainingRecoveryReportSummary.tsx`.
4. Confirm the checkout includes `apps/web/src/features/training/trainingRecoveryTrigger.ts`.
5. Confirm the checkout includes `apps/web/src/features/training/TrainingRecoveryRecommendationCard.tsx`.
6. Run typecheck.
7. Run build.
8. Start the local web app.

Recommended commands:

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

If port `3000` is occupied by a stale Next process, follow `docs/OPERATING_NOTES.md` OW-007.

## Route Smoke Checks

Visit these routes:

- `/`
- `/launch/demo-unit-1`
- `/enter/ministar`
- `/training/demo-unit-1`

Expected results:

- `/` shows an `Open Training Academy` link in the recovery route card.
- `/launch/demo-unit-1` still supports flashcards, Memory Match unlock, Star Dust progress, and triggered recovery recommendations.
- `/enter/ministar` still supports front-door code entry, multimedia package concept, and teacher-visible progress summary.
- `/enter/ministar` shows recovery event counts in the teacher-visible sample stream.
- `/training/demo-unit-1` shows the Training Academy recovery route.

## Trigger Checks

On `/launch/demo-unit-1`:

1. Complete the flashcard entry practice.
2. Start Memory Match.
3. Intentionally create at least two mismatched pair checks.
4. Confirm a `Recovery Practice Recommended` card appears.
5. Confirm the card explains that Training Academy is optional support and does not block the game path.
6. Tap the recovery recommendation text and confirm it speaks.
7. Confirm the session event log records a `training_recommended` event.
8. Confirm the recommendation event metadata includes `trainingEventType`, `recoveryTriggerId`, `triggerReason`, `sourceGameMode`, `recommendedGameMode`, `recoveryPath`, and `returnPath`.
9. Click `Open Training` and confirm it routes to `/training/demo-unit-1`.
10. Return to `/launch/demo-unit-1` and confirm the normal game path is still available.

Low-score trigger check:

1. Complete Memory Match with many attempts.
2. If the completion reward is low enough, confirm the `Recovery Practice Recommended` card appears or remains visible.
3. Confirm the metadata trigger reason is `low-completion-score` when that path is the active trigger.
4. Confirm low-score recovery is deterministic and does not require AI Tutor.

## Training Academy Checks

On `/training/demo-unit-1`:

1. Confirm the page shows `Training Academy` and the current unit theme.
2. Confirm the page explains the recovery recommendation without shaming the student.
3. Confirm the focus is `Vocabulary Review`.
4. Confirm the practice mode is `Flashcards`.
5. Confirm the return path is `/launch/demo-unit-1`.
6. Tap the recommendation text and confirm it speaks.
7. Tap the instruction text and confirm it speaks.
8. Tap each vocabulary review word and confirm it speaks.
9. Confirm each tapped word is marked `Heard`.
10. Tap each target sentence and confirm it speaks.
11. Use the listen control beside `Start Review` and confirm it speaks without starting review.
12. Confirm the `Teacher Recovery Summary` starts with the recommendation count already visible.
13. Click `Start Review` and confirm the event log records `training_started` in metadata.
14. Confirm the `Teacher Recovery Summary` updates the started count.
15. Click `Mark Complete` and confirm the event log records `training_answer_submitted`, `training_answer_result`, and `training_completed` in metadata.
16. Confirm recovery Star Dust increases by no more than 100.
17. Confirm the unit-session summary updates after completion.
18. Confirm the `Teacher Recovery Summary` updates completed, responses, results, and recovery reward.
19. Click `Record Return` and confirm the event log records `training_returned_to_unit` in metadata.
20. Confirm the `Teacher Recovery Summary` updates returned count and return path.
21. Click `Back To Unit` and confirm the route returns to `/launch/demo-unit-1`.
22. Confirm no AI Tutor entitlement, model call, chat UI, or external service is required.
23. Confirm the teacher-visible event log shows shared type `training_recommended` plus `trainingEventType` metadata.
24. Confirm the route remains usable if optional background media is unavailable.

## Front-Door Teacher Report Checks

On `/enter/ministar`:

1. Enter the sample access details if prompted.
2. Confirm the teacher-visible sample report includes `Recovery events`.
3. Confirm the sample report includes `Recovery complete`.
4. Confirm the sample report includes `Recovery returns`.
5. Confirm the sample report includes `Recovery reward`.
6. Confirm recovery activity appears in the event list using `trainingEventType` metadata.
7. Confirm recovery events remain part of the same report stream as games, media, and Star Dust.

## Acceptance Criteria

- The route is useful as a recovery lane before polish.
- The route follows the audio-first standard.
- Recovery recommendations are deterministic, explainable, and triggered by repeated misses or low completion results.
- Recovery rewards are deterministic and smaller than primary unit-game rewards.
- Training Academy remains core platform functionality, not premium AI Tutor functionality.
- Teacher reports can count recovery events without a separate report stream.
- No database, auth, or persistence dependency is introduced yet.
- Any build/browser issue found here must be fixed before adding more Training Academy focus types.
