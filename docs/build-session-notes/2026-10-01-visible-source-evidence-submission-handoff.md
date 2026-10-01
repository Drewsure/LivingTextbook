# Build Session: Visible Source Evidence Submission Handoff

## Goal

Make the first saleable white-label pilot's source-evidence handoff executable
by a publisher operator without weakening review-only boundaries.

## Delivered

- Added the guarded submission command to the tenant-scoped Publisher Pilot
  Input Kit panel after the create-once request command.
- Kept the server-side token environment-only.
- Documented that only tenant, quarantine, package, and validated report
  metadata are sent.
- Preserved independent package, release, QR, persistence, and student gates.

## Verification

- `npm run verify:publisher-pilot-intake-kit`
- `npm run verify:publisher-source-preflight-evidence-submit`
- `npm run verify:foundation-composition`
- `npm run typecheck --workspace @living-textbook/web`
- `git diff --check`

The production build remains subject to the documented Windows stale-process
recovery procedure.
