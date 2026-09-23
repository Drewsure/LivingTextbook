# Browser, Privacy, and Tenant Evidence Adjudication Checks

Run the focused check after changing the composite packet adjudication path:

```powershell
npm run verify-browser-privacy-tenant-evidence-adjudication
```

Confirm:

- The adjudication preserves the packet's tenant, package, launch, unit,
  student-session, packet, and observation identity.
- A blocked decision is valid while evidence is incomplete.
- Acceptance is rejected if any evidence lane is pending or failed.
- A complete three-lane packet can be accepted for the next review gate.
- Hosted writes, student-data collection, export, promotion, QR mutation, and
  student production launch remain disabled.

The broader route and build checks are:

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web -- --webpack
npm run verify:routes
```

