# Media Telemetry Verification Checks

Use these checks with `docs/VERIFICATION_CHECKLIST.md` after the `legacy-source-import` branch is locally synced and the app is running.

## Unit Media Playback Checks

On `/enter/ministar` after opening the sample unit:

1. Confirm each media asset card shows native audio or video controls when a source is configured.
2. Confirm each media asset card has audio-supported action controls for start/resume, pause, and completion.
3. Click the listen control beside `Start media` or `Resume media` and confirm it speaks without recording a media event.
4. Click `Start media` and confirm a `media_started` event appears.
5. Click `Mark paused` and confirm a `media_paused` event appears.
6. Confirm the media card status changes to `Paused`.
7. Click `Resume media` and confirm the paused status clears without recording a second start event.
8. Click `Mark complete` and confirm a `media_completed` event appears.
9. Confirm the media card status changes to `Completed`.
10. Confirm the unit-session summary counts starts, pauses, and completions.
11. Confirm the teacher-visible report preview counts media starts, media pauses, and media completions separately.
12. Confirm the teacher session monitor shows a dedicated `Media engagement` section.
13. Confirm media engagement shows started, paused, completed, and background media counts by asset.
14. Confirm playlist route opens are shown separately from actual media playback.

## Native Playback Event Checks

Where browser media controls are available:

1. Press play on the native audio/video control and confirm it records or preserves started state.
2. Press pause on the native audio/video control and confirm a `media_paused` event appears.
3. Resume playback and confirm paused state clears.
4. Let media end or click completion fallback and confirm completion is counted separately from pause.
5. If demo media files are unavailable, confirm the unavailable-source message appears and manual controls still demonstrate the reporting contract.

## Reporting Contract Checks

1. Confirm `media_started`, `media_paused`, and `media_completed` all use the same event stream shape.
2. Confirm event metadata includes media asset id, media kind, media type, and duration seconds.
3. Confirm media events do not affect game mastery scoring.
4. Confirm background media enabled/disabled events remain separate from normal media playback events.
5. Confirm teacher monitor language states that media engagement is report-only and does not unlock games, award mastery, or replace target-language practice.
6. Confirm `media_playlist_opened` is report-only and does not count as media playback completion.
