# Media Support-Only Preview Checks

Run after playlist route or media event preview changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/media/playlist-ministar-l1-u1-greetings` loads.
- `http://127.0.0.1:3000/media/playlist-sample-publisher-l1-u1-routines` loads.
- Playlist routes show `support-only events`.
- Media event previews do not imply playback unlocks progress, mastery, or Star Dust.

