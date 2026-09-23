# Browser, Privacy, and Tenant Evidence Release Binding Checks

Run the focused check after changing the release-readiness evidence bridge:

```powershell
npm run verify-browser-privacy-tenant-evidence-release-binding
```

Confirm:

- The binding preserves readiness, pilot binding, packet, adjudication,
  tenant, and package identity.
- Awaiting and blocked composite evidence remain visible as non-ready states.
- Accepted composite evidence becomes accepted for release review only.
- Production approval, student production launch, package promotion, hosted
  persistence, and QR mutation remain disabled.

The broader gate remains:

```powershell
npm run verify:foundation
```

