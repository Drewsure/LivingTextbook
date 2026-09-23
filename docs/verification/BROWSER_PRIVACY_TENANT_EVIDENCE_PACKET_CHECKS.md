# Browser, Privacy, and Tenant Evidence Packet Checks

Run the focused check after changing the packet contract or sample:

```powershell
npm run verify:browser-privacy-tenant-evidence-packet
```

Confirm:

- Exactly three lanes exist: browser, privacy, and tenant isolation.
- Each lane has its required evidence kind, scope, and negative-check ids.
- The packet is bound to one tenant, package, launch, unit, and student
  session; tenant drift is rejected.
- Pending source records cannot be marked passed.
- Hosted writes, learner-data collection, export, release promotion, and
  classroom launch remain false and visibly blocked.
- The sample packet is not described as verified evidence until a real
  browser or adult observation is captured and adjudicated.
