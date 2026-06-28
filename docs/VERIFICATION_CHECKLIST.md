# Living Textbook Verification Checklist

Use this checklist when the `legacy-source-import` branch is locally accessible. It exists because some Codex sessions may need to update files through the GitHub connector and cannot run local build checks immediately.

## Local Setup Checks

1. Confirm the working branch is `legacy-source-import`.
2. Confirm the local checkout is aligned with the remote branch.
3. Install dependencies from the repository root when needed.
4. Run typecheck/build for the web app.
5. Start the local dev server.

## Route Smoke Checks

Visit these routes:

- `/`
- `/teacher`
- `/launch/demo-unit-1`

Expected results:

- `/` shows the foundation dashboard, teacher launch panel, game sequence, and progression contract.
- `/teacher` shows the Teacher Launch Protocol and student launch path.
- `/launch/demo-unit-1` shows flashcard entry practice, next game lock state, and an empty progress summary.

## Student Flow Checks

On `/launch/demo-unit-1`:

1. Confirm initial state says flashcards are ready and Memory Match is locked.
2. Click `Mark practice complete`.
3. Confirm the button becomes disabled or complete.
4. Confirm Star Dust increases.
5. Confirm the progress event log shows `entry_practice_completed`.
6. Confirm the progress event log shows `game_unlocked`.
7. Confirm Memory Match changes from locked to unlocked.
8. Click `Start Memory Match`.
9. Confirm the progress event log shows `game_started`.
10. Confirm the Mode Shell appears with pair count, card count, parent engine, and first pair payload.

## Mobile Layout Checks

Check at narrow mobile width:

- Flashcard cards remain readable.
- Buttons do not overflow their containers.
- Long labels wrap instead of overlapping.
- Event log entries remain scannable.
- Teacher launch route remains readable.

## White-Label Checks

- Shared primitives use tenant CSS variables.
- No MiniStar-only colors are hard-coded in reusable UI primitives.
- MiniStar names appear as tenant/sample data, not platform assumptions.
- Reward text uses `tenant.rewardName` where applicable.

## Known Verification Gap

If local repo access is blocked, use GitHub connector readback as a temporary verification method and record the limitation in the final work summary. Do not mark visual/build verification complete until the local app has actually been run.
