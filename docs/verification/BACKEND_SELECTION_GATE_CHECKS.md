# Backend Selection Gate Checks

Run after backend, persistence, deployment, or pilot-scope changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/teacher/intake` loads.
- The page shows `Backend selection gate`.
- The first real backend is marked not selected while privacy, release-control, media storage, and optional AI boundaries are unresolved.
- The gate keeps cost control visible.
- The gate keeps future local/closed deployment compatibility visible.
- AI Tutor and speech scoring are not treated as required base-package storage.

