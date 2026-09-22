# Sample Launch Boundary Checks

Run:

```powershell
npm run verify:sample-launch-boundary
```

Expected result:

- `demo-unit-1` is the only MiniStar sample launch code.
- `partner-demo-unit-1` is the only sample-publisher game launch code.
- Unknown codes return not-found.
- A guessed `partner-*` prefix cannot select the sample-publisher tenant.
- The resolver cannot silently fall back to another tenant's package, audio,
  progression, reward, or teacher-report context.

This is a sample/demo boundary. Production QR and permanent-route resolution
still requires the tenant-scoped route registry, release state, alias,
rollback, local fallback, and authorization gates.
