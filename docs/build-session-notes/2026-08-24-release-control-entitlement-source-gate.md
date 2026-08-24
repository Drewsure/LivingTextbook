# Build Session Note: Release-Control Entitlement Source Gate

Date: 2026-08-24

Added the package entitlement workbench as a release-control source and expanded blocked release actions around premium adoption.

Why:

Release decisions need to see premium package adoption, AI/speech, billing, report export, storage, and local companion blockers before a package can be treated as pilot-ready.

Added:

- `/teacher/entitlements` source link on the release-control route.
- Premium adoption, billing, microphone scoring, and report export blocked actions.
- Active route verifier coverage.
- Release-control verifier coverage.

Still blocked:

- Package adoption activation.
- Billing entitlement writes.
- Microphone scoring enablement.
- Report export enablement.
- Publish, assignment, student-ready, and local bundle release actions.
