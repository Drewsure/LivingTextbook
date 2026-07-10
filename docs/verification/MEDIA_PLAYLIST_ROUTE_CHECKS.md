# Media Playlist Route Checks

Run after multimedia, route, or package changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/media/playlist-ministar-l1-u1-greetings` loads.
- `http://127.0.0.1:3000/media/playlist-sample-publisher-l1-u1-routines` loads.
- The route shows reviewed playlist metadata, not a loose file browser.
- Audio and video assets show rights status, source path, and local bundle path.
- Optional game background media remains teacher-controlled and off by default.
- Each playlist route includes a return link to the correct student unit launch.
- The route does not imply raw learner audio, learner recordings, or transcripts are stored in progress records.
- The route appears in `docs/ACTIVE_ROUTE_VERIFICATION_LIST.md` and the active route matrix.
- Student launch pages show a package-driven `Unit media` shortcut when a reviewed playlist exists.
- The student shortcut states that media does not unlock games or replace target-language practice.
- The teacher launch page shows a package-driven `Unit media` shortcut when a reviewed playlist exists.
