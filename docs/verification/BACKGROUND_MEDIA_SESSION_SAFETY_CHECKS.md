# Background Media Session Safety Checks

Run after teacher session, game audio, or media setting changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1` loads.
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1` loads.
- Active route verification confirms teacher session pages contain `tap-to-speak learning audio`.
- Session controls state that background media stays below tap-to-speak learning audio.
- Shared session settings validation blocks background media that does not pause, duck, or mute for learning audio.
- Background media cannot unlock games, progression, Star Dust, or mastery.
