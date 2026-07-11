# Local Companion Manifest Snapshot Checks

Run after local companion, local bundle, package export, or route changes.

```powershell
npm run verify:foundation
```

Then verify:

- `http://127.0.0.1:3000/local/sample-publisher` loads.
- The page shows `Generated manifest snapshot`.
- The snapshot includes bundle id, version, assets, routes, and handoff items.
- The snapshot does not imply it is signed or offline-ready.
