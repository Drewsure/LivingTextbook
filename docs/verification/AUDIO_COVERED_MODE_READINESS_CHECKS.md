# Audio-Covered Mode Readiness Checks

Run after syncing `legacy-source-import`.

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

Then verify:

- `http://127.0.0.1:3000/` shows covered modes in the audio support summary.
- `http://127.0.0.1:3000/partner-demo` shows covered modes in the partner audio support summary.
- `http://127.0.0.1:3000/teacher/intake` shows audio-covered mode counts.
- `http://127.0.0.1:3000/teacher/intake` lists the covered game modes for each package.
- The audio support gate evidence mentions covered modes.
