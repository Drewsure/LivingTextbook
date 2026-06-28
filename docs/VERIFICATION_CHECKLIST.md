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
- `/enter/ministar`

Expected results:

- `/` shows the foundation dashboard, teacher launch panel, multimedia package concept, game sequence, progression contract, and teacher progress summary concept.
- `/teacher` shows the Teacher Launch Protocol and student launch path.
- `/launch/demo-unit-1` shows flashcard entry practice, next game lock state, earned rewards, and an empty progress summary.
- `/enter/ministar` shows the front-door entry form and teacher-visible report preview.

## Dashboard Multimedia Package Checks

On `/`:

1. Confirm the Living Textbook package panel shows 1 unit, 1 audio asset, 1 video asset, and 1 playlist.
2. Confirm the printed QR concept uses a stable `/q/tenant/.../series/.../book/.../unit/.../activity/...` path.
3. Confirm the front-door concept shows `/enter/ministar`.
4. Confirm the `Open front door` link opens `/enter/ministar`.
5. Confirm the optional background media plan is off by default and teacher-controlled.
6. Confirm the teacher report concept separates game progress from media engagement.
7. Confirm the sample package validation status says `Package valid`.

## Front-Door Flow Checks

On `/enter/ministar`:

1. Confirm the sample entry code is `HELLO-101`.
2. Confirm the sample user code is `STUDENT-04`.
3. Click `Open unit`.
4. Confirm the report preview records `launch_opened`.
5. Confirm flashcard practice appears.
6. Click `Mark practice complete`.
7. Confirm the report preview records `entry_practice_completed` and `game_unlocked`.
8. Confirm Star Dust increases and the first deterministic reward unlocks.
9. Start the audio asset and mark it complete.
10. Start the video asset and mark it complete.
11. Confirm media started/completed counts update separately from game progress.
12. Start Memory Match.
13. Confirm the pairing shell appears.
14. Confirm optional background media can now be enabled.
15. Enable and disable background media.
16. Confirm background media events appear in the teacher-visible report preview.

## Student Flow Checks

On `/launch/demo-unit-1`:

1. Confirm initial state says flashcards are ready and Memory Match is locked.
2. Confirm the earned rewards panel shows deterministic locked rewards, not random rewards.
3. Click `Mark practice complete`.
4. Confirm the button becomes disabled or complete.
5. Confirm Star Dust increases.
6. Confirm the first deterministic reward unlocks.
7. Confirm the progress event log shows `entry_practice_completed`.
8. Confirm the progress event log shows `game_unlocked`.
9. Confirm Memory Match changes from locked to unlocked.
10. Click `Start Memory Match`.
11. Confirm the progress event log shows `game_started`.
12. Confirm the Mode Shell appears with pair count, card count, parent engine, and first pair payload.

## Multimedia Checks

When real multimedia playback is implemented:

- Confirm unit packages can include both audio and video assets.
- Confirm playlists can be linked to a unit.
- Confirm media can be opened from teacher preview and student launch surfaces.
- Confirm media started, paused, completed, background enabled, and background disabled events are reportable.
- Confirm optional background media can be disabled.
- Confirm games remain playable when no background media is available.
- Confirm partner media has rights/owner metadata before production use.
- Confirm media engagement is displayed separately from language-game mastery.

## Hybrid QR And Front-Door Checks

When permanent QR resolver work is implemented:

- Confirm printed QR routes use stable tenant/series/book/unit/activity identifiers.
- Confirm printed QR routes do not point to local files, localhost, or version-specific asset paths.
- Confirm a permanent QR can resolve to a unit launch, media playlist, game mode, teacher preview, or front door.
- Confirm `/enter/[tenantId]` supports entry code and optional user code.
- Confirm entry code/user code values are not embedded in printed QR payloads.
- Confirm teacher progress summaries can connect front-door sessions to game and media events.
- Confirm the local app/content-package fallback behavior is documented for the tenant.

## Mobile Layout Checks

Check at narrow mobile width:

- Flashcard cards remain readable.
- Buttons do not overflow their containers.
- Reward labels and thresholds do not overlap.
- Long labels wrap instead of overlapping.
- Event log entries remain scannable.
- Teacher launch route remains readable.
- Media controls are large enough for classroom devices.
- Dashboard multimedia package rows wrap instead of overflowing.
- Front-door entry inputs and buttons wrap without overlap.
- Teacher-visible report metrics remain scannable.

## White-Label Checks

- Shared primitives use tenant CSS variables.
- No MiniStar-only colors are hard-coded in reusable UI primitives.
- MiniStar names appear as tenant/sample data, not platform assumptions.
- Reward text uses `tenant.rewardName` where applicable.
- Rewards are deterministic earned unlocks, not chance-based or pressure-based rewards.
- Multimedia labels, playlists, and route names are tenant-configurable.

## Known Verification Gap

If local repo access is blocked, use GitHub connector readback as a temporary verification method and record the limitation in the final work summary. Do not mark visual/build verification complete until the local app has actually been run.
