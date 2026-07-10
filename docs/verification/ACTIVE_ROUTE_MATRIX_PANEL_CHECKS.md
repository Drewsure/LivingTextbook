# Active Route Matrix Panel Checks

Run after route or teacher intake changes.

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

Then verify:

- `http://127.0.0.1:3000/teacher/intake` loads.
- The page includes an `Active route matrix` section.
- The matrix includes core, MiniStar, sample publisher, and stable QR groups.
- The matrix includes focused Training Academy routes with `?focus=sentence-review`.
- The stable QR route is marked as an active demo route, not a direct media file.
- Route entries display full local `http://127.0.0.1:3000` addresses and remain clickable.
- The panel does not imply all scaffold routes are production QR promises.
