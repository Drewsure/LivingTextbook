# White-Label Release Readiness Checks

Run the focused checks after changing the release-readiness model or sample:

```powershell
node scripts/verify-white-label-release-readiness.mjs
node scripts/verify-white-label-release-readiness-behavior.mjs
npm run verify:runtime-behavior
npm run verify:browser-rehearsal-observation
npm run verify:browser-rehearsal-observation-runtime
npm run verify:browser-rehearsal-observation-handoff
npm run verify:browser-rehearsal-observation-adjudication
```

Confirm:

- Exactly seven quality records exist and each has matching tenant/package
  identity.
- The packet exposes a non-empty verification run id and verification revision,
  plus a valid `verificationReferenceAt`, for the evidence snapshot.
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
- Browser evidence mode is explicit; coded rehearsal cannot satisfy a
  pilot-ready packet without browser automation or human observation.
- Stronger browser evidence uses a structured observation receipt with tenant,
  package, session, route, check, reviewer, timestamp, and blocked-side-effect
  fields.
- Teacher capture requires an explicit action and stores only a local receipt;
  the runtime check rejects cross-tenant lookup and promotion drift.
- Observation handoff preserves the validated receipt identity and keeps adult
  review, export, hosted writes, promotion, QR mutation, assignment, and
  student launch boundaries explicit.
- Release readiness reads only the exact local observation scope and keeps a
  missing receipt distinguishable from a verified browser observation.
- Adult adjudication requires an explicit reviewer reference and note, binds to
  the exact observation handoff, and records only an accepted-for-next-gate or
  blocked review outcome.
- Adjudication remains review-only: it cannot become release approval, hosted
  persistence, export, QR mutation, assignment, or student launch.
- Evidence remains review-only; no production approval, student launch,
  persistence, export, installation, provider activation, or QR mutation is
  enabled.
