# Local Companion Artifact Map Checks

## Scope

Run after local companion, package export, installer, media bundle, local report policy, route, or release-control changes.

## Checks

- Confirm `/local/sample-publisher` shows `Package artifact map`.
- Confirm the artifact map separates generated, publisher-provided, school-policy, and future-build artifacts.
- Confirm each artifact has a path, status, required-for stage, blocker, and next step.
- Confirm media and installer artifacts remain blocked until rights, checksums, update, backup, and policy decisions exist.
- Confirm generated manifest snapshots include artifact metadata.
- Confirm the artifact map does not imply an exporter, installer, or offline-ready package already exists.

## Verification Command

```powershell
npm run verify:foundation
```
