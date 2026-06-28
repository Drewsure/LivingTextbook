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
- `/launch/demo-unit-1` shows flashcard entry practice, unit-session summary, next game lock state, earned rewards, and an empty progress summary.
- `/enter/ministar` shows the front-door entry form and teacher-visible report preview.

## Dashboard Multimedia Package Checks

On `/`:

1. Confirm the Living Textbook package panel shows 1 unit, 1 audio file, 1 video asset, 1 playlist, and the audio cue count.
2. Confirm the audio support summary shows required support, vocabulary cues, sentence cues, instruction/feedback cues, cue source, and fallback voice.
3. Confirm the printed QR concept uses a stable `/q/tenant/.../series/.../book/.../unit/.../activity/...` path.
4. Confirm the front-door concept shows `/enter/ministar`.
5. Confirm the `Open front door` link opens `/enter/ministar`.
6. Confirm the optional background media plan is off by default and teacher-controlled.
7. Confirm the teacher report concept separates game progress from audio cue/media engagement.
8. Confirm the sample package validation status says `Package valid`.

## Audio Support Checks

For any student-facing unit or game:

1. Confirm every vocabulary term has an audio cue.
2. Confirm both target sentences have audio cues.
3. Confirm student-facing instructions have audio cues.
4. Confirm important success, retry, or correction feedback has audio cues.
5. Confirm critical controls or prompts needed by young learners have listen/replay support or an explicit audio cue plan.
6. Confirm the preferred interaction is tap/click the learner-facing text itself to hear it.
7. Confirm separate listen buttons are used only when text-as-control would be unclear, crowded, or inaccessible.
8. Confirm any autoplay behavior is opt-in, disable-able, non-overlapping, and justified by the activity design.
9. Confirm audio support is separate from optional background music or chants.
10. Confirm text-to-speech, recorded audio, teacher-recorded audio, partner audio, or reviewed placeholder audio is declared for each cue.
11. Confirm tenant voice/accent/source choices are configurable and not hard-coded as MiniStar-only assumptions.
12. Confirm games remain usable if background media is disabled, while comprehension audio remains available.
13. Confirm audio-supported action controls allow hearing the action label without triggering the action.
14. Do not mark a game or unit student-ready if learner-facing text is unsupported by audio.

## Front-Door Flow Checks

On `/enter/ministar`:

1. Confirm the sample entry code is `HELLO-101`.
2. Confirm the sample user code is `STUDENT-04`.
3. Click the listen control beside `Open unit` and confirm it speaks without opening the unit.
4. Click `Open unit`.
5. Confirm the report preview records `launch_opened`.
6. Confirm the unit-session summary appears with flashcard, Memory Match, media, background-media, reward, and event state.
7. Confirm flashcard practice appears.
8. Tap the unit-session summary message and confirm it speaks.
9. Tap the flashcard instruction text and confirm it speaks.
10. Tap each vocabulary word and confirm it speaks.
11. Tap each target sentence and confirm it speaks.
12. Click the listen control beside `Mark practice complete` and confirm it speaks without completing practice.
13. Click `Mark practice complete`.
14. Confirm the unit-session summary updates flashcards to complete, Memory Match to unlocked, event count, and Star Dust.
15. Confirm the flashcard feedback text can be tapped and spoken.
16. Confirm the report preview records `entry_practice_completed` and `game_unlocked`.
17. Confirm Star Dust increases and the first deterministic reward unlocks.
18. Click the listen control beside `Start Memory Match` and confirm it speaks without starting the game.
19. Start Memory Match.
20. Confirm the playable Memory Match board appears with pairs, remaining, attempts, and engine metrics.
21. Confirm the unit-session summary updates Memory Match to playing.
22. Tap the Memory Match instruction text and confirm it speaks.
23. Tap hidden Memory Match cards and confirm card text is revealed and spoken.
24. Trigger a mismatch and confirm the feedback message can be tapped and spoken.
25. Complete all pairs.
26. Confirm the unit-session summary updates Memory Match to complete.
27. Confirm the report preview records `game_completed`.
28. Confirm Star Dust increases after Memory Match completion.
29. Confirm matched cards can still be tapped to replay their audio.
30. Tap the playlist title and media asset titles and confirm they speak.
31. Click the listen control beside `Start media` and confirm it speaks without recording a media event.
32. Start the audio asset and mark it complete.
33. Start the video asset and mark it complete.
34. Confirm media started/completed counts update separately from game progress.
35. Confirm the unit-session summary updates media counts.
36. Confirm optional background media can now be enabled.
37. Click the listen control beside `Enable media` and confirm it speaks without enabling background media.
38. Enable and disable background media.
39. Confirm the unit-session summary updates background media state.
40. Confirm background media events appear in the teacher-visible report preview.

## Student Flow Checks

On `/launch/demo-unit-1`:

1. Confirm initial state says flashcards are ready and Memory Match is locked.
2. Confirm the earned rewards panel shows deterministic locked rewards, not random rewards.
3. Confirm the unit-session summary appears and says to start with flashcards.
4. Tap the unit-session summary message and confirm it speaks.
5. Tap the flashcard instruction text and confirm it speaks.
6. Tap a vocabulary word and confirm it speaks.
7. Tap a target sentence and confirm it speaks.
8. Click the listen control beside `Mark practice complete` and confirm it speaks without completing practice.
9. Click `Mark practice complete`.
10. Confirm the button becomes disabled or complete.
11. Confirm Star Dust increases.
12. Confirm the unit-session summary updates flashcards to complete and Memory Match to unlocked.
13. Confirm the first deterministic reward unlocks.
14. Confirm the progress event log shows `entry_practice_completed`.
15. Confirm the progress event log shows `game_unlocked`.
16. Confirm Memory Match changes from locked to unlocked.
17. Click the listen control beside `Start Memory Match` and confirm it speaks without starting the game.
18. Click `Start Memory Match`.
19. Confirm the progress event log shows `game_started`.
20. Confirm the unit-session summary updates Memory Match to playing.
21. Confirm the playable Memory Match board appears.
22. Tap the Memory Match instruction text and confirm it speaks.
23. Tap hidden cards and confirm selected card labels are spoken.
24. Match all pairs.
25. Confirm the progress event log shows `game_completed`.
26. Confirm the unit-session summary updates Memory Match to complete and Star Dust.
27. Confirm Star Dust increases after Memory Match completion.
28. Confirm matched cards can still be tapped to replay their audio.

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
- Memory Match cards remain tappable and do not overlap.
- Buttons do not overflow their containers.
- Reward labels and thresholds do not overlap.
- Long labels wrap instead of overlapping.
- Unit-session summary cards wrap without overlapping status pills.
- Event log entries remain scannable.
- Teacher launch route remains readable.
- Media controls are large enough for classroom devices.
- Dashboard multimedia package rows wrap instead of overflowing.
- Audio support metrics and cue summaries wrap without overlap.
- Clickable audio text remains easy to tap and does not overlap nearby controls.
- Audio-supported action controls wrap cleanly without separating the listen button too far from its action.
- Front-door entry inputs and buttons wrap without overlap.
- Teacher-visible report metrics remain scannable.

## White-Label Checks

- Shared primitives use tenant CSS variables.
- No MiniStar-only colors are hard-coded in reusable UI primitives.
- MiniStar names appear as tenant/sample data, not platform assumptions.
- Reward text uses `tenant.rewardName` where applicable.
- Rewards are deterministic earned unlocks, not chance-based or pressure-based rewards.
- Multimedia labels, playlists, and route names are tenant-configurable.
- Audio cue voice, source, pronunciation, autoplay defaults, and language choices are tenant-configurable.

## Known Verification Gap

If local repo access is blocked, use GitHub connector readback as a temporary verification method and record the limitation in the final work summary. Do not mark visual/build verification complete until the local app has actually been run.