# Background Media Policy Checks

Run after multimedia, game-audio, or teacher-session setting changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/teacher/intake` loads.
- The page shows `Background media policy`.
- Background media is teacher-controlled and off by default unless reviewed.
- Tap-to-speak learning audio has priority over background media.
- Background media reports as engagement only.
- Background media cannot unlock Star Dust, mastery, games, or progression.

