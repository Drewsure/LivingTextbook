# Local Companion Package Preview Checks

Run after local deployment, local bundle, route registry, media rights, report export, or active route changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/local/sample-publisher` loads.
- The page shows `Local companion package preview`.
- The page shows bundled media assets and checksum status.
- The page shows local QR fallback routes.
- The page shows local deployment preflight blockers.
- The page does not imply the package is offline-ready.
