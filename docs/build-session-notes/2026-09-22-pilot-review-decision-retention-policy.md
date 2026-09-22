# Build Session: Pilot Review Decision Retention Policy

## Goal

Make retention, deletion, audit, and school-policy requirements explicit before
any provider-specific snapshot write exists.

## Completed

- Added the shared tenant/package-bound retention policy contract.
- Added review-only sample policy data and persistence workbench visibility.
- Kept writes, restore, export, and activation blocked.
- Wired policy verification into foundation composition.
- Recorded ADR 0951 and DR-1023.

## Next gate

Use the accepted policy contract to define a provider-neutral implementation
readiness handoff, without opening production writes prematurely.
