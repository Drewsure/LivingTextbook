# Build Session: AI Prototype Signed Approval Preflight Validator

## Summary

Added a shared validation guard for signed approval preflight previews.

## Changes

- Added `packages/content-model/src/aiPrototypeSignedApprovalPreflight.ts`.
- Exported the guard from the content model package.
- Wired sample signed approval preflights to the shared validator.
- Added visible guard blocks and warnings to the teacher generator signed approval panel.
- Updated generator and active route verification to require the guard labels.
- Recorded the decision as DR-436.

## Boundaries

- No signed approval is captured.
- No approve button is enabled.
- No patch authorization, app file write, patch generation, test execution, Playwright run, route mutation, scoring or reward mutation, audio manifest mutation, package promotion, assignment, or support-language progress trigger is enabled.
