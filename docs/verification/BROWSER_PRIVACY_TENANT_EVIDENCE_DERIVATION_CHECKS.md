# Browser, Privacy, and Tenant Evidence Derivation Checks

Run the focused checks after changing observation-to-packet derivation:

```powershell
npm run verify-browser-privacy-tenant-evidence-packet
npm run verify-browser-privacy-tenant-evidence-packet-derivation
```

Confirm:

- A valid observation preserves tenant, package, launch, unit, student-session,
  and observation identity in the derived packet.
- The browser lane advances only when route continuity and student-to-teacher
  handoff checks are explicit.
- Privacy and tenant-isolation lanes remain pending rather than being inferred
  from browser success.
- The derived packet remains review-only and all blocked side-effect flags stay
  false.
