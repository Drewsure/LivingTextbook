# Media Support-Only Event Checks

Run after media telemetry, playlist, or background media changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/media/playlist-ministar-l1-u1-greetings` loads.
- `http://127.0.0.1:3000/media/playlist-sample-publisher-l1-u1-routines` loads.
- Media playback events report zero Star Dust.
- Media playback events cannot unlock progression.
- Media playback events cannot award mastery credit.
- Background media events preserve learning-audio priority metadata.

