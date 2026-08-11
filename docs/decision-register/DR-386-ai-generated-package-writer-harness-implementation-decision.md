# DR-386: AI Generated Package Writer Harness Implementation Decision

Date: 2026-08-11

Status: Accepted

## Decision

Add a review-only Codex decision preview before package writer harness code can be considered.

## Rationale

The project needs a visible manual decision gate between harness implementation proposals and any future code work. This keeps the generator path evidence-first and prevents a proposal from being treated as implementation approval.

## White-Label Impact

Positive. The gate is tenant-neutral and protects every publisher package from accidental writer, route, playlist, local bundle, assignment, or QR mutation work.

## Cost Impact

Positive. The decision preview does not run tests, upload evidence, or trigger any paid service. It keeps future automation scoped before implementation.

## Blocked Actions

- Harness implementation approval.
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

- `npm.cmd run verify:ai-generator`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`

## Follow-Up

Add the matching backend-neutral storage contract before any real decision capture, harness implementation, or test execution workflow is designed.
