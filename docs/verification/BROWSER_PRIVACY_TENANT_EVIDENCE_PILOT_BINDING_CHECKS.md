# Browser, Privacy, and Tenant Evidence Pilot Binding Checks

Run the focused check after changing the evidence-to-pilot binding:

```powershell
npm run verify-browser-privacy-tenant-evidence-pilot-binding
```

Confirm:

- The binding preserves packet, adjudication, pilot decision, tenant, and
  package identity.
- Missing evidence is visibly awaiting rather than accepted.
- A blocked adjudication produces a blocked binding.
- An accepted three-lane adjudication produces accepted-for-pilot-review only.
- Pilot launch, student-data collection, report export, package promotion, QR
  mutation, and hosted persistence remain disabled.

The full gate remains:

```powershell
npm run verify:foundation
```

