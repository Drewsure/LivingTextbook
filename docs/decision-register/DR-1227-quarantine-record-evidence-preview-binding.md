# DR-1227: Quarantine Record To Evidence Preview Binding

- Date: 2026-09-29
- Status: Accepted
- Decision: Bind each requested quarantine record to the shared admission
  preview contract through a tenant-authorized metadata-only route.

## Required boundary

The route must preserve the real tenant and opaque quarantine id, derive the
pending evidence state through the shared validator, and return no raw payload,
filesystem path, download URL, mutation capability, package promotion, or
student-facing permission.

## Next gate

The next implementation must decide how reviewed evidence becomes durable and
how a human-approved packet can feed the package assembly writer. This preview
does not make that decision.
