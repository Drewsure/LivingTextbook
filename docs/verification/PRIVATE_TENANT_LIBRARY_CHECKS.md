# Private Tenant Library Checks

## Scope

Run after library, sharing, copy/edit, package versioning, teacher authoring, community resource, or public marketplace changes.

## Checks

- Confirm `npm run verify:tenant-library` passes.
- Confirm `/teacher/intake` shows `Private tenant library`.
- Confirm teacher private drafts, tenant-approved package library, and school shared library remain planned.
- Confirm public community library remains blocked for v1.
- Confirm private drafts cannot be assigned directly to students.
- Confirm library sharing does not copy student data.
- Confirm public sharing remains blocked until moderation, copyright, privacy, quality, tenant-isolation, and abuse-reporting governance exists.

## Verification Command

```powershell
npm run verify:foundation
```
