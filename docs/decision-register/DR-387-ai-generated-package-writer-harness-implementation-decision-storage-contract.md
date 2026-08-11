# DR-387: AI Generated Package Writer Harness Implementation Decision Storage Contract

Date: 2026-08-11

Status: Accepted

## Decision

Add backend-neutral storage coverage for package writer harness implementation decisions before decision capture, harness approval, harness implementation, writer test execution, evidence upload, route writes, playlists, local bundles, assignments, production QR mutation, or support-language-only implementation decisions can exist.

## Rationale

The project now has a visible decision preview. A durable record is required so that future implementation cannot treat UI state as approval.

## White-Label Impact

Positive. The decision record is tenant-neutral and preserves package writer safety for every publisher and local/hybrid deployment.

## Cost Impact

Positive. The record blocks automated test execution, evidence upload, and any future paid or hosted workflow until a separate implementation decision exists.

## Blocked Actions

- Harness implementation approval.
- Harness implementation.
- Package writer harness code.
- Automated writer test execution.
- Mutation browser runs.
- Evidence upload.
- Signed approval capture.
- App file patches.
- Package JSON writes.
- Route registry writes.
- Media playlist writes.
- Local bundle packaging.
- Assignment activation.
- Production QR redirect mutation.
- Support-language-only implementation decisions.

## Verification

- `npm.cmd run verify:backend-storage`
- `npm.cmd run verify:ai-generator`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`

## Follow-Up

Do not build real harness decision capture until reviewer identity, signature policy, release controls, storage retention, rollback, and school policy gates are accepted.
