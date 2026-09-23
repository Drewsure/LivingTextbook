# White-Label Release Readiness Checks

Run the focused checks after changing the release-readiness model or sample:

```powershell
node scripts/verify-white-label-release-readiness.mjs
node scripts/verify-white-label-release-readiness-behavior.mjs
npm run verify:runtime-behavior
```

Confirm:

- Exactly seven quality records exist and each has matching tenant/package
  identity.
- The packet exposes a non-empty verification run id and verification revision
  for the evidence snapshot.
- Typecheck, production build, and runtime records use `command` evidence.
- Active routes use `route-sweep` evidence.
- Browser uses `browser-rehearsal` evidence with a non-empty scope.
- Privacy uses `privacy-negative-test` evidence with an explicit exclusion
  scope.
- Tenant isolation uses `tenant-negative-test` evidence with cross-tenant
  rejection scope.
- Evidence scopes are non-empty and unique within each record.
- Wrong evidence kinds and missing scopes are rejected.
- Missing verification run or revision lineage is rejected.
- Fresh observations pass against an explicit reference time; future-dated and
  observations older than seven days are rejected.
- Evidence remains review-only; no production approval, student launch,
  persistence, export, installation, provider activation, or QR mutation is
  enabled.
